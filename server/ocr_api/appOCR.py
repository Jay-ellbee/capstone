from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import pytesseract
import easyocr
import re
import os

# Flask app initialization
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the EasyOCR reader
reader = easyocr.Reader(['en'])

# Update the path for Tesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Function to preprocess the image
def preprocess_image(image_path):
    image = cv2.imread(image_path)
    if image is None:
        raise FileNotFoundError(f"Image not found at {image_path}")

    # Convert to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply adaptive thresholding to improve text clarity
    binary_image = cv2.adaptiveThreshold(
        gray_image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )
    
    return gray_image, binary_image

# Function to extract text using Tesseract
def extract_text_tesseract(image):
    custom_config = r'--oem 3 --psm 6'
    return pytesseract.image_to_string(image, config=custom_config)

# Function to extract text using EasyOCR
def extract_text_easyocr(image):
    results = reader.readtext(image)
    text = " ".join([result[1] for result in results])
    return text

# Function to extract transaction or reference ID
def extract_id(text):
    labels = [
        "Ref No.", "Reference ID", "TID", "Confirmation No.", "Confirmation No"
    ]
    label_pattern = r'(' + '|'.join(labels) + r')[:\s]*([A-Z0-9\s-]{10,20})'

    match = re.search(label_pattern, text, re.IGNORECASE)
    if match:
        raw_id = match.group(2).strip().replace(" ", "")
        return raw_id
    return None

# Function to perform OCR and extract IDs
def extract_ids_from_receipt(image_path):
    gray_image, binary_image = preprocess_image(image_path)

    # First pass using Tesseract
    text_tesseract = extract_text_tesseract(binary_image)
    print(f"Tesseract Output: {text_tesseract}")
    id_tesseract = extract_id(text_tesseract)
    
    if id_tesseract:
        return id_tesseract

    # Fallback to EasyOCR
    text_easyocr = extract_text_easyocr(gray_image)
    print(f"EasyOCR Output: {text_easyocr}")
    id_easyocr = extract_id(text_easyocr)

    return id_easyocr

# Flask endpoint for OCR
@app.route('/ocr', methods=['POST'])
def ocr():
    try:
        # Ensure an image file is provided
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        file = request.files['image']
        print(f"Received image: {file.filename}")

        # Save the uploaded image
        file_path = os.path.join('uploads', file.filename)
        os.makedirs('uploads', exist_ok=True)
        file.save(file_path)

        # Perform OCR
        transaction_id = extract_ids_from_receipt(file_path)

        # Clean up the temporary file
        os.remove(file_path)

        # Return the result
        if transaction_id:
            return jsonify({'transaction_id': transaction_id}), 200
        else:
            return jsonify({'error': 'Transaction ID not found'}), 404

    except Exception as e:
        print(f"Error during OCR processing: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Main entry point
if __name__ == '__main__':
    app.run(debug=True)
