from flask import Flask, jsonify, request
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from xgb3 import forecast_trending_products
from flask_cors import CORS
import math
app = Flask(__name__)
CORS(app)

# Load the dataset for recommendations
df = pd.read_excel("C:\\Capstone\\server\\ml_flask_api\\datasetRS.xlsx")
df_encoded_attributes = pd.get_dummies(df[['main_flower', 'wrapper_color', 'price', 'tags']])

# Function to generate recommendations based on cosine similarity
def recommend_similar_items(arrangementId, top_n=10):
    similarity_matrix_attributes = cosine_similarity(df_encoded_attributes)
    similarity_df_attributes = pd.DataFrame(similarity_matrix_attributes, index=df['arrangement_id'], columns=df['arrangement_id'])
    
    # Get similarity scores for the given arrangement based on attributes
    similar_items = similarity_df_attributes[arrangementId].sort_values(ascending=False).drop(arrangementId)
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
        # Extract the month parameter from the request's query string
        month = request.args.get('month', type=int)

        # Ensure month is within valid range
        if month < 1 or month > 12:
            return jsonify({"error": "Invalid month. Please provide a value between 1 and 12."}), 400

        # Call the forecasting function
        forecast_results = forecast_trending_products(month)

        # Return the results as JSON
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
