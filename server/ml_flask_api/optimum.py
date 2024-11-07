import matplotlib
matplotlib.use('Agg')  # Use the Agg backend for non-interactive plots
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics.pairwise import cosine_similarity

# Load the dataset
df = pd.read_excel("C:\\Capstone\\server\\ml_flask_api\\revised.xlsx")
df_encoded_attributes = pd.get_dummies(df[['main_flower', 'wrapper_color', 'price', 'arrangement_type', 'tags']])

# Define the recommendation function with added debugging
def recommend_similar_items(arrangementId, top_n=10):
    similarity_matrix_attributes = cosine_similarity(df_encoded_attributes)
    similarity_df_attributes = pd.DataFrame(similarity_matrix_attributes, index=df['arrangement_id'], columns=df['arrangement_id'])

    if arrangementId not in similarity_df_attributes.index:
        print(f"Arrangement ID {arrangementId} not found in dataset.")
        return pd.DataFrame()

    # Calculate similar items
    similar_items = similarity_df_attributes[arrangementId].sort_values(ascending=False).drop(arrangementId)
    top_similar_items = similar_items.head(top_n * 8)  # Starting with more items for filtering

    # Debugging: show the number of similar items before filtering by type
    recommendations = df[df['arrangement_id'].isin(top_similar_items.index)]
    print(f"Total similar items before filtering by type for {arrangementId}: {len(recommendations)}")

    # Filter by arrangement type
    input_arrangement_type = df.loc[df['arrangement_id'] == arrangementId, 'arrangement_type'].values[0]
    recommendations = recommendations[recommendations['arrangement_type'] == input_arrangement_type]
    recommendations = recommendations.head(top_n)

    # Debugging: show the number of recommendations after filtering
    print(f"Total recommendations after filtering by type for {arrangementId}: {len(recommendations)}")
    
    return recommendations

# Test cases
test_cases = [
    {'arrangementId': 'AR00001', 'expected_ids': ['AR00015', 'AR00022']},
    {'arrangementId': 'AR00004', 'expected_ids': ['AR00063']},
    # Add additional test cases as needed
]

def test_recommender_system(test_cases, top_n=10):
    for case in test_cases:
        arrangementId = case['arrangementId']
        expected_ids = case['expected_ids']
        
        print(f"\nTesting for Arrangement ID: {arrangementId}")
        
        # Get recommendations
        recommendations = recommend_similar_items(arrangementId, top_n)
        
        # Display recommended arrangement IDs
        recommended_ids = recommendations['arrangement_id'].tolist()
        print("Recommended IDs:", recommended_ids)
        
        # Check if expected results are in recommended results
        if set(expected_ids).issubset(recommended_ids):
            print("Test passed.")
        else:
            print(f"Test failed. Expected at least {expected_ids}, but got {recommended_ids}")

# Run the test function
test_recommender_system(test_cases, top_n=10)

# Visualization of recommendations, saved as an image to avoid display issues
def plot_recommendations(recommendations):
    if not recommendations.empty:
        plt.figure(figsize=(8, 4))
        sns.barplot(x='arrangement_id', y='arrangement_name', data=recommendations)
        plt.title("Recommended Items")
        plt.xlabel("Arrangement ID")
        plt.ylabel("Arrangement Name")
        plt.savefig("recommendations_plot.png")  # Save plot as image
        print("Plot saved as recommendations_plot.png")

# Example to visualize recommendations
example_recommendations = recommend_similar_items('AR00001', top_n=10)
plot_recommendations(example_recommendations)
