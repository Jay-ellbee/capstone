#!/usr/bin/env python
# coding: utf-8

# In[4]:


recommendations = recommend_similar_items('AR00001', df, similarity_df_attributes, top_n=10)
print(recommendations)


# In[8]:


recommendations = recommend_similar_items('AR00115', df, similarity_df_attributes, top_n=10)
print(recommendations)


# In[9]:


recommendations = recommend_similar_items('AR00169', df, similarity_df_attributes, top_n=10)
print(recommendations)


# In[5]:


import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics.pairwise import cosine_similarity

# Load the dataset (without qty_sold)
df = pd.read_excel("C:\\Capstone\\server\\ml_flask_api\\datasetRS.xlsx")

# Step 1: Encoding the necessary features
df_encoded_attributes = pd.get_dummies(df[['main_flower', 'wrapper_color', 'price', 'tags','arrangement_type']])

# Step 2: Apply weights to the encoded columns
# Identify the columns related to the specific attributes
main_flower_columns = [col for col in df_encoded_attributes.columns if 'main_flower_' in col]
wrapper_color_columns = [col for col in df_encoded_attributes.columns if 'wrapper_color_' in col]
tags_columns = [col for col in df_encoded_attributes.columns if 'tags_' in col]
price_columns = [col for col in df_encoded_attributes.columns if 'price_' in col]
arrangement_type_columns = [col for col in df_encoded_attributes.columns if 'arrangement_type_' in col]

# Apply weights to these columns
df_encoded_attributes[main_flower_columns] *= 5  # Main flower gets the highest weight
df_encoded_attributes[wrapper_color_columns] *= 1.5  # Wrapper color gets a slight weight increase
df_encoded_attributes[tags_columns] *= 1  # Tags have a neutral weight
df_encoded_attributes[price_columns] *= 3  # Price has a higher weight
df_encoded_attributes[arrangement_type_columns] *= 5  # Arrangement type has a high weight

# Step 3: Compute cosine similarity based on weighted attributes
similarity_matrix_attributes = cosine_similarity(df_encoded_attributes)

# Convert similarity matrix to DataFrame for easy lookup
similarity_df_attributes = pd.DataFrame(similarity_matrix_attributes, index=df['arrangement_id'], columns=df['arrangement_id'])

# Step 4: Recommend similar items based on weighted attributes
def recommend_similar_items(arrangementId, df, similarity_df_attributes, top_n=10):
    # Get similarity scores for the given arrangement based on attributes
    similar_items = similarity_df_attributes[arrangementId].sort_values(ascending=False)
    
    # Exclude the item itself from recommendations
    similar_items = similar_items.drop(arrangementId)

    top_similar_items = similar_items.head(top_n)
    
    # Select top N similar items based on attributes
    recommendations = df[df['arrangement_id'].isin(top_similar_items.index)]
    
    print(f"\nTop {top_n} recommendations for Arrangement {arrangementId} (based on weighted attributes):")
    return recommendations

# Step 5: Visualize similarities for a specific arrangement
def plot_similarity_for_arrangement(arrangementId, similarity_df_attributes):
    similarities = similarity_df_attributes[arrangementId].sort_values(ascending=False)
    plt.figure(figsize=(10, 6))
    sns.barplot(x=similarities.index, y=similarities.values)
    plt.xticks(rotation=90)
    plt.title(f"Similarities for Arrangement {arrangementId} (based on weighted attributes)")
    plt.xlabel("Arrangement ID")
    plt.ylabel("Similarity Score")
    plt.show()

# Step 6: Test the recommendation system with test cases
def test_recommender_system_with_debug(test_cases, df, similarity_df_attributes, top_n=5):
    for case in test_cases:
        print(f"\nTest Case: Searching for Arrangement {case['arrangementId']} (Expected: {case['expected']})")
        recommendations = recommend_similar_items(case['arrangementId'], df, similarity_df_attributes, top_n=top_n)
        recommended_ids = recommendations['arrangement_id'].tolist()
        print(f"Top {top_n} Recommendations: {recommended_ids}")
        
        # Get Top 20 Recommendations based on similarity score
        similar_items = similarity_df_attributes[case['arrangementId']].sort_values(ascending=False)
        similar_items = similar_items.drop(case['arrangementId'])  # Exclude the queried item itself
        top_20_similar = df[df['arrangement_id'].isin(similar_items.index)].head(20)['arrangement_id'].tolist()
        print(f"Top 20 Recommendations: {top_20_similar}")

        # Check if expected recommendation matches the result
        if set(case['expected']).issubset(recommended_ids):
            print("Test passed!")
        else:
            print("Test failed.")
            missing_in_top_5 = set(case['expected']).difference(recommended_ids)
            missing_in_top_20 = set(case['expected']).difference(top_20_similar)
            if missing_in_top_5:
                print(f"Expected items {missing_in_top_5} are not in the top {top_n} recommendations.")
            if missing_in_top_20:
                print(f"Expected items {missing_in_top_20} are not in the top 20 recommendations.")

# Step 7: Define test cases
test_cases = [
    {'arrangementId': 'AR00001', 'expected': ['AR00015', 'AR00022']},  
    {'arrangementId': 'AR00004', 'expected': ['AR00063']},
    # Add more test cases as needed
]

# Step 8: Run the test cases
test_recommender_system_with_debug(test_cases, df, similarity_df_attributes, top_n=10)

# Step 9: Visualize the recommendations
def plot_recommendations(recommendations):
    plt.figure(figsize=(8, 4))
    sns.barplot(x='arrangement_id', y='arrangement_name', data=recommendations)
    plt.title("Recommended Items")
    plt.xlabel("Arrangement ID")
    plt.ylabel("Arrangement Name")
    plt.show()

# Example to visualize recommendations for a specific test case
recommendations = recommend_similar_items('AR00001', df, similarity_df_attributes, top_n=10)
plot_recommendations(recommendations)


# In[14]:


recommendations = recommend_similar_items('AR00171', df, similarity_df_attributes, top_n=10)
print(recommendations)


# In[6]:


import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics.pairwise import cosine_similarity

# Load the dataset (without qty_sold)
df = pd.read_excel("C:\\Capstone\\server\\ml_flask_api\\datasetRS.xlsx")

# Step 1: Encoding the necessary features
df_encoded_attributes = pd.get_dummies(df[['main_flower', 'wrapper_color', 'price', 'tags', 'arrangement_type']])

# Step 2: Apply weights to the encoded columns
main_flower_columns = [col for col in df_encoded_attributes.columns if 'main_flower_' in col]
wrapper_color_columns = [col for col in df_encoded_attributes.columns if 'wrapper_color_' in col]
tags_columns = [col for col in df_encoded_attributes.columns if 'tags_' in col]
price_columns = [col for col in df_encoded_attributes.columns if 'price_' in col]
arrangement_type_columns = [col for col in df_encoded_attributes.columns if 'arrangement_type_' in col]

# Apply weights to these columns
df_encoded_attributes[main_flower_columns] *= 5
df_encoded_attributes[wrapper_color_columns] *= 1.5
df_encoded_attributes[tags_columns] *= 1
df_encoded_attributes[price_columns] *= 3
df_encoded_attributes[arrangement_type_columns] *= 4

# Step 3: Compute cosine similarity based on weighted attributes
similarity_matrix_attributes = cosine_similarity(df_encoded_attributes)
similarity_df_attributes = pd.DataFrame(similarity_matrix_attributes, index=df['arrangement_id'], columns=df['arrangement_id'])

# Step 4: Recommend similar items based on weighted attributes
def recommend_similar_items(arrangementId, df, similarity_df_attributes, top_n=10):
    similar_items = similarity_df_attributes[arrangementId].sort_values(ascending=False).drop(arrangementId)
    top_similar_items = similar_items.head(top_n)
    recommendations = df[df['arrangement_id'].isin(top_similar_items.index)]
    return recommendations

# Step 5: Visualize similarities for a specific arrangement
def plot_similarity_for_arrangement(arrangementId, similarity_df_attributes):
    similarities = similarity_df_attributes[arrangementId].sort_values(ascending=False)
    plt.figure(figsize=(10, 6))
    sns.barplot(x=similarities.index, y=similarities.values)
    plt.xticks(rotation=90)
    plt.title(f"Similarities for Arrangement {arrangementId} (based on weighted attributes)")
    plt.xlabel("Arrangement ID")
    plt.ylabel("Similarity Score")
    plt.show()

# Step 6: Test the recommendation system with test cases
def compute_mae(predicted_scores, actual_scores):
    common_arrangements = set(predicted_scores.keys()).intersection(set(actual_scores.keys()))
    if not common_arrangements:
        return None
    mae = np.mean([abs(predicted_scores[arrangement] - actual_scores[arrangement]) for arrangement in common_arrangements])
    return mae

def test_recommender_system_with_debug(test_cases, df, similarity_df_attributes, actual_preferences, top_n=5):
    for case in test_cases:
        print(f"\nTest Case: Searching for Arrangement {case['arrangementId']} (Expected: {case['expected']})")
        recommendations = recommend_similar_items(case['arrangementId'], df, similarity_df_attributes, top_n=top_n)
        recommended_ids = recommendations['arrangement_id'].tolist()
        print(f"Top {top_n} Recommendations: {recommended_ids}")

        # Get Top 20 Recommendations based on similarity score
        similar_items = similarity_df_attributes[case['arrangementId']].sort_values(ascending=False).drop(case['arrangementId'])
        top_20_similar = df[df['arrangement_id'].isin(similar_items.index)].head(20)['arrangement_id'].tolist()
        print(f"Top 20 Recommendations: {top_20_similar}")

        # Check if expected recommendation matches the result
        if set(case['expected']).issubset(recommended_ids):
            print("Test passed!")
        else:
            print("Test failed.")
            missing_in_top_5 = set(case['expected']).difference(recommended_ids)
            missing_in_top_20 = set(case['expected']).difference(top_20_similar)
            if missing_in_top_5:
                print(f"Expected items {missing_in_top_5} are not in the top {top_n} recommendations.")
            if missing_in_top_20:
                print(f"Expected items {missing_in_top_20} are not in the top 20 recommendations.")

        # Compute predicted scores for MAE calculation
        predicted_scores = {arrangement: similarity_df_attributes[case['arrangementId']][arrangement] for arrangement in recommended_ids}
        mae = compute_mae(predicted_scores, actual_preferences)
        
        if mae is not None:
            accuracy = 100 - mae  # Assuming MAE represents an error, accuracy can be computed as (100 - MAE)
            print(f"Mean Absolute Error for Arrangement {case['arrangementId']}: {mae:.2f}")
            print(f"Accuracy: {accuracy:.2f}%")
        else:
            print("No common arrangements for MAE calculation.")

# Step 7: Define actual preferences (for MAE calculation)
actual_preferences = {
    'AR00001': 5,  # Actual score for AR00001
    'AR00015': 4,
    'AR00022': 3,
    'AR00004': 5,
    'AR00063': 2,
    # Add more actual preferences as needed
}

# Step 8: Define test cases
test_cases = [
    {'arrangementId': 'AR00001', 'expected': ['AR00015', 'AR00022']},  
    {'arrangementId': 'AR00004', 'expected': ['AR00063']},
    # Add more test cases as needed
]

# Step 9: Run the test cases
test_recommender_system_with_debug(test_cases, df, similarity_df_attributes, actual_preferences, top_n=10)

# Step 10: Visualize the recommendations
def plot_recommendations(recommendations):
    plt.figure(figsize=(8, 4))
    sns.barplot(x='arrangement_id', y='arrangement_name', data=recommendations)
    plt.title("Recommended Items")
    plt.xlabel("Arrangement ID")
    plt.ylabel("Arrangement Name")
    plt.show()

# Example to visualize recommendations for a specific test case
recommendations = recommend_similar_items('AR00001', df, similarity_df_attributes, top_n=10)
plot_recommendations(recommendations)


# In[ ]:




