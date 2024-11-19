from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import cv2
import pytesseract
import easyocr
import numpy as np
import os
import re

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize EasyOCR Reader
reader = easyocr.Reader(['en'])

# Update this path to your Tesseract installation
pytesseract.pytesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Preprocess image for OCR
def preprocess_image(image_stream):
    pil_image = Image.open(image_stream)
    opencv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)

    # Convert to grayscale
    gray_image = cv2.cvtColor(opencv_image, cv2.COLOR_BGR2GRAY)

    # Apply GaussianBlur to reduce noise
    gray_image = cv2.GaussianBlur(gray_image, (5, 5), 0)

    # Apply adaptive thresholding for better contrast
    binary_image = cv2.adaptiveThreshold(
        gray_image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2
    )

    # Optional: Deskew image if necessary
    coords = np.column_stack(np.where(binary_image > 0))
    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
    (h, w) = binary_image.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    binary_image = cv2.warpAffine(binary_image, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)

    return gray_image, binary_image

# Extract text using Tesseract
def extract_text_tesseract(image):
    # Limit recognition to numbers and uppercase letters
    custom_config = r'--oem 1 --psm 7 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    return pytesseract.image_to_string(image, config=custom_config)

# Extract text using EasyOCR
def extract_text_easyocr(image):
    results = reader.readtext(image)
    return results

# Improved function to extract ID with stricter bounding box filtering and validation
def extract_id_with_bounding_boxes(ocr_results):
    labels = ["Ref No.", "Reference ID", "TID", "Confirmation No."]
    for i, (bbox, text, _) in enumerate(ocr_results):
        if any(label.lower() in text.lower() for label in labels):
            if i + 1 < len(ocr_results):
                next_bbox, next_text, _ = ocr_results[i + 1]

                # Get coordinates of the current and next bounding boxes
                label_x, label_y, label_width, label_height = bbox[0][0], bbox[0][1], bbox[2][0] - bbox[0][0], bbox[2][1] - bbox[0][1]
                next_x, next_y = next_bbox[0][0], next_bbox[0][1]

                # Tighter vertical and horizontal distance checks
                vertical_threshold = max(20, label_height * 1.5)
                horizontal_threshold = max(100, label_width * 1.5)

                # Check proximity conditions
                if abs(next_y - label_y) < vertical_threshold and abs(next_x - (label_x + label_width)) < horizontal_threshold:
                    # Use a more restrictive regex pattern
                    match = re.search(r'^[A-Z0-9]{10,20}$', next_text)
                    if match:
                        return match.group(0)
    return None


# Function to extract transaction/reference ID using regex from plain text
def extract_id(text):
    labels = [
        "Ref No.", "Reference ID", "TID", "Confirmation No."
    ]
    label_pattern = r'(' + '|'.join(labels) + r')[:\s]*([0-9A-Z-]{8,16})'

    match = re.search(label_pattern, text, re.IGNORECASE)
    if match:
        raw_id = match.group(2).strip()
        return raw_id
    return None

# Hybrid OCR to extract IDs
def extract_ids_from_receipt(image_stream):
    gray_image, binary_image = preprocess_image(image_stream)

    # First attempt using Tesseract
    text_tesseract = extract_text_tesseract(binary_image)
    print(f"Tesseract Output: {text_tesseract}")
    id_tesseract = extract_id(text_tesseract)
    if id_tesseract:
        return id_tesseract

    # Fallback to EasyOCR with stricter bounding box filtering
    ocr_results = extract_text_easyocr(gray_image)
    id_easyocr = extract_id_with_bounding_boxes(ocr_results)

    return id_easyocr

# Endpoint for OCR
@app.route('/ocr', methods=['POST'])
def ocr():
    try:
        # Check for an uploaded image
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        file = request.files['image']

        # Perform OCR
        transaction_id = extract_ids_from_receipt(file)

        if transaction_id:
            return jsonify({'transaction_id': transaction_id}), 200
        else:
            return jsonify({'error': 'Transaction ID not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
