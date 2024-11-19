from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import pytesseract
import easyocr
import re
import os
import sys
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import math

# Add the ml_flask_api folder to the system path
sys.path.append(os.path.abspath("C:\\Capstone\\server\\ml_flask_api"))

from xgb3 import forecast_trending_products

# Flask app initialization
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# ----- OCR Functionality -----
# Initialize the EasyOCR reader
reader = easyocr.Reader(['en'])

# Update the path for Tesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Function to preprocess the image
def preprocess_image(image_path):
    image = cv2.imread(image_path)
    if image is None:
        raise FileNotFoundError(f"Image not found at {image_path}")

    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
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
    text_tesseract = extract_text_tesseract(binary_image)
    print(f"Tesseract Output: {text_tesseract}")
    id_tesseract = extract_id(text_tesseract)

    if id_tesseract:
        return id_tesseract

    text_easyocr = extract_text_easyocr(gray_image)
    print(f"EasyOCR Output: {text_easyocr}")
    id_easyocr = extract_id(text_easyocr)

    return id_easyocr

# OCR endpoint
@app.route('/ocr', methods=['POST'])
def ocr():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        file = request.files['image']
        print(f"Received image: {file.filename}")

        file_path = os.path.join('uploads', file.filename)
        os.makedirs('uploads', exist_ok=True)
        file.save(file_path)

        transaction_id = extract_ids_from_receipt(file_path)
        os.remove(file_path)

        if transaction_id:
            return jsonify({'transaction_id': transaction_id}), 200
        else:
            return jsonify({'error': 'Transaction ID not found'}), 404

    except Exception as e:
        print(f"Error during OCR processing: {str(e)}")
        return jsonify({'error': str(e)}), 500

# ----- ML Recommendation Functionality -----
# Load the dataset for recommendations
df = pd.read_excel("C:\\Capstone\\server\\ml_flask_api\\revised.xlsx")
df_encoded_attributes = pd.get_dummies(df[['main_flower', 'wrapper_color', 'price', 'tags']])

# Function to generate recommendations based on cosine similarity
def recommend_similar_items(arrangement_id, top_n=10):
    similarity_matrix = cosine_similarity(df_encoded_attributes)
    similarity_df = pd.DataFrame(similarity_matrix, index=df['arrangement_id'], columns=df['arrangement_id'])
    similar_items = similarity_df[arrangement_id].sort_values(ascending=False).drop(arrangement_id)
    top_similar_items = similar_items.head(top_n)
    recommendations = df[df['arrangement_id'].isin(top_similar_items.index)]
    return recommendations.to_dict(orient='records')

def sanitize_data(data):
    if isinstance(data, list):
        return [sanitize_data(item) for item in data]
    elif isinstance(data, dict):
        return {key: sanitize_data(value) for key, value in data.items()}
    elif isinstance(data, float) and math.isnan(data):
        return None  # Replace NaN with None or another suitable value
    return data
# Endpoint to get forecasted trending products
@app.route('/forecast', methods=['GET'])
def forecast():
    try:
        month = request.args.get('month', type=int)
        if month < 1 or month > 12:
            return jsonify({"error": "Invalid month. Please provide a value between 1 and 12."}), 400

        forecast_results = forecast_trending_products(month)
        return jsonify(forecast_results), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to get recommendations based on similarity
@app.route('/recommend/<arrangement_id>', methods=['GET'])
def get_recommendations(arrangement_id):
    top_n = request.args.get('top_n', default=10, type=int)
    try:
        recommendations = recommend_similar_items(arrangement_id, top_n)
         # Sanitize the recommendations to replace NaN with None
        sanitized_recommendations = sanitize_data(recommendations)
        
        return jsonify(sanitized_recommendations), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Main entry point
if __name__ == '__main__':
    app.run(debug=True)