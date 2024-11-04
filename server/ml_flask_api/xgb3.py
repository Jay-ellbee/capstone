#!/usr/bin/env python
# coding: utf-8

# In[3]:


import pandas as pd
from xgboost import XGBRegressor
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error
import numpy as np

# Load dataset
df = pd.read_excel("C:\\Capstone\\server\\ml_flask_api\\baby.xlsx")

# Define the volume mapping by year and category
# Original volume mapping
volume_mapping = {
    2018: {'Low': 800, 'Medium': 1200, 'High': 1800},
    2019: {'Low': 800, 'Medium': 1300, 'High': 2000},
    2020: {'Low': 400, 'Medium': 800, 'High': 1100},
    2021: {'Low': 800, 'Medium': 1300, 'High': 2000},
    2022: {'Low': 1200, 'Medium': 1600, 'High': 2500},
    2023: {'Low': 1400, 'Medium': 2000, 'High': 2800}
}

# Standardizing the volume mapping
standardized_volume_mapping = {}
for year, volumes in volume_mapping.items():
    min_val = min(volumes.values())
    max_val = max(volumes.values())
    standardized_volume_mapping[year] = {
        category: (value - min_val) / (max_val - min_val) for category, value in volumes.items()
    }

# Display the standardized volume mapping
print("Standardized Volume Mapping:", standardized_volume_mapping)

# Convert dates and create monthly index for forecasting
df['sales_date'] = pd.to_datetime(df['sales_date'])
df['season_start'] = pd.to_datetime(df['season_start'])
df['season_end'] = pd.to_datetime(df['season_end'])
df['month'] = df['sales_date'].dt.month

# Function to map sales volume categories to numeric values based on the year
def map_sales_volume(row):
    year = row['sales_date'].year
    volume_category = row['sales_volume'].capitalize()
    return volume_mapping.get(year, {}).get(volume_category, None)

# Apply the sales volume mapping function to create the 'sales_volume_numeric' column
df['sales_volume_numeric'] = df.apply(map_sales_volume, axis=1)

# Drop rows with missing sales volume data to prepare for model training
price_data = df.dropna(subset=['sales_volume_numeric', 'price_per_qty'])

# Prepare data for the price forecasting model
X = price_data[['sales_volume_numeric']]
y = price_data['price_per_qty']

# Split data into training and testing sets (80-20 split)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the XGBoost Regressor model for price forecasting
price_model = XGBRegressor(
    objective='reg:squarederror',
    n_estimators=100,
    learning_rate=0.1,
    max_depth=3,
    random_state=42
)
price_model.fit(X_train, y_train)

# Evaluate the model on the testing set
y_pred = price_model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))

print(f"Model Evaluation Metrics:\nMean Absolute Error (MAE): {mae:.2f}\nRoot Mean Squared Error (RMSE): {rmse:.2f}")

# After the model evaluation section, add the following:

# Compute accuracy based on MAE
def compute_accuracy(y_true, y_pred):
    # Calculate MAE
    mae = mean_absolute_error(y_true, y_pred)
    
    # Compute accuracy as a percentage of the average true values
    average_true = np.mean(y_true)
    accuracy = 100 - (mae / average_true * 100)  # In percentage form

    return mae, accuracy

# Evaluate the model on the testing set
y_pred = price_model.predict(X_test)
mae, accuracy = compute_accuracy(y_test, y_pred)

print(f"Model Evaluation Metrics:\nMean Absolute Error (MAE): {mae:.2f}\nAccuracy: {accuracy:.2f}%")


# Define event priority to ensure higher impact events are prioritized
event_priority = {
    "Valentine's": 1,
    "All Saints’ Day": 2,
    "All Souls’ Day": 3,
    "Mother's Day": 4,
    "Christmas": 5,
}

# Define sales volume priority for sorting
sales_volume_priority = {
    "High": 1,
    "Medium": 2,
    "Low": 3
}

# Function to forecast trending products for a specific month
def forecast_trending_products(month):
    # Filter dataset for records matching the specified month, marked as trending, and within season dates
    monthly_trending = df[(df['sales_date'].dt.month == month) & (df['trend_flag'] == 1)]
    
    # Check if there are records for the specified month
    if monthly_trending.empty:
        print(f"No data found for month: {month}.")
        return []

    monthly_trending['sales_volume'] = monthly_trending['sales_volume'].str.capitalize()
    monthly_trending = monthly_trending.dropna(subset=['sales_volume_numeric'])
    
    # Map and sort by event priority and sales volume category
    monthly_trending['event_priority'] = monthly_trending['season_event'].map(event_priority).fillna(99)
    monthly_trending['sales_priority'] = monthly_trending['sales_volume'].map(sales_volume_priority).fillna(99)
    
    # Sort data by event priority and sales volume priority
    monthly_trending = monthly_trending.sort_values(by=['event_priority', 'sales_priority', 'sales_date'])

    suggestions = []
    seen_combinations = set()  # To track unique product combinations
    
    for _, row in monthly_trending.iterrows():
        # Create a unique identifier for the product and season event combination
        unique_id = (row['prod_name'], row['season_event'], row['sales_volume'])
        
        # Check if this combination has already been seen
        if unique_id not in seen_combinations:
            # Prepare input for prediction as a DataFrame with the correct feature name
            sales_volume_input = pd.DataFrame([[row['sales_volume_numeric']]], columns=['sales_volume_numeric'])
            
            # Predict the average price using the model (commented out as per request)
            # predicted_price = price_model.predict(sales_volume_input)[0]
            
            # Build a suggestion entry, capturing all relevant details
            suggestions.append({
                "Product ID": row['prod_id'],
                "Product Name": row['prod_name'],
                "Variant": row['variant_name'],
                "Color": row['var_color'],
                "Date": row['sales_date'].strftime("%B %d") if pd.notna(row['sales_date']) else "N/A",
                "Season Event": row['season_event'],
                "Season Start": row['season_start'].strftime("%B %d") if pd.notna(row['season_start']) else "N/A",
                "Season End": row['season_end'].strftime("%B %d") if pd.notna(row['season_end']) else "N/A",
                "Average Sales": row['sales_volume'],
                # "Average Price": f"₱{predicted_price:.2f}"  # This line is now commented out
            })

            # Add the combination to the seen set to avoid duplicates
            seen_combinations.add(unique_id)

    if not suggestions:
        print("No unique suggestions found for this month.")
    
    return suggestions

# Example usage for February
forecast_results = forecast_trending_products(1)

# Display forecast results in a structured format
def display_forecast_results(forecast_results):
    print("Suggested Products this Month:")
    for suggestion in forecast_results:
        print(f"Product ID: {suggestion['Product ID']}")
        print(f"Product Name: {suggestion['Product Name']}")
        print(f"Variant: {suggestion['Variant']}")
        print(f"Color: {suggestion['Color']}")
        print(f"Date: {suggestion['Date']}")
        print(f"Season Event: {suggestion['Season Event']}")
        print(f"Season Start: {suggestion['Season Start']}")
        print(f"Season End: {suggestion['Season End']}")
        print(f"Average Sales: {suggestion['Average Sales']}")
        # print(f"Average Price: {suggestion['Average Price']}")  # This line is now commented out
        print("-" * 40)  # Divider line for readability

# Example usage
display_forecast_results(forecast_results)


# In[4]:


import numpy as np

# Sample y_test values (replace with your actual values)
y_test = np.array([100, 110, 90, 120, 95])  # Example actual values

# Your previously calculated MAE
mae = 28.58

# Calculate Mean Actual Value
mean_actual = np.mean(y_test)

# Calculate Relative Accuracy
relative_accuracy = 1 - (mae / mean_actual)

# Convert to percentage
accuracy_percentage = relative_accuracy * 100

print(f"Equivalent Accuracy: {accuracy_percentage:.2f}%")


# In[7]:


import pandas as pd
from datetime import datetime

# Load dataset
df = pd.read_excel("C:\\Capstone\\server\\ml_flask_api\\baby.xlsx")

# Define the volume mapping by year and category
volume_mapping = {
    2018: {'Low': 800, 'Medium': 1200, 'High': 1800},
    2019: {'Low': 800, 'Medium': 1300, 'High': 2000},
    2020: {'Low': 400, 'Medium': 800, 'High': 1100},
    2021: {'Low': 800, 'Medium': 1300, 'High': 2000},
    2022: {'Low': 1200, 'Medium': 1600, 'High': 2500},
    2023: {'Low': 1400, 'Medium': 2000, 'High': 2800}
}

# Standardizing the volume mapping
standardized_volume_mapping = {}
for year, volumes in volume_mapping.items():
    min_val = min(volumes.values())
    max_val = max(volumes.values())
    standardized_volume_mapping[year] = {
        category: (value - min_val) / (max_val - min_val) for category, value in volumes.items()
    }

# Display the standardized volume mapping
# print("Standardized Volume Mapping:", standardized_volume_mapping)

# Convert dates and create monthly index for forecasting
df['sales_date'] = pd.to_datetime(df['sales_date'])
df['season_start'] = pd.to_datetime(df['season_start'])
df['season_end'] = pd.to_datetime(df['season_end'])
df['month'] = df['sales_date'].dt.month

# Function to map sales volume categories to numeric values based on the year
def map_sales_volume(row):
    year = row['sales_date'].year
    volume_category = row['sales_volume'].capitalize()
    return volume_mapping.get(year, {}).get(volume_category, None)

# Apply the sales volume mapping function to create the 'sales_volume_numeric' column
df['sales_volume_numeric'] = df.apply(map_sales_volume, axis=1)

# Drop rows with missing sales volume data to prepare for model training
volume_data = df.dropna(subset=['sales_volume_numeric'])

# Define event priority to ensure higher impact events are prioritized
event_priority = {
    "Valentine's": 1,
    "All Saints’ Day": 2,
    "All Souls’ Day": 3,
    "Mother's Day": 4,
    "Christmas": 5,
}

# Define sales volume priority for sorting
sales_volume_priority = {
    "High": 1,
    "Medium": 2,
    "Low": 3
}

# Function to forecast trending products for a specific month
def forecast_trending_products(month):
    # Filter dataset for records matching the specified month, marked as trending, and within season dates
    monthly_trending = df[(df['sales_date'].dt.month == month) & (df['trend_flag'] == 1)]
    
    # Check if there are records for the specified month
    if monthly_trending.empty:
        print(f"No data found for month: {month}.")
        return []

    monthly_trending['sales_volume'] = monthly_trending['sales_volume'].str.capitalize()
    monthly_trending = monthly_trending.dropna(subset=['sales_volume_numeric'])
    
    # Map and sort by event priority and sales volume category
    monthly_trending['event_priority'] = monthly_trending['season_event'].map(event_priority).fillna(99)
    monthly_trending['sales_priority'] = monthly_trending['sales_volume'].map(sales_volume_priority).fillna(99)
    
    # Sort data by event priority and sales volume priority
    monthly_trending = monthly_trending.sort_values(by=['event_priority', 'sales_priority', 'sales_date'])

    suggestions = []
    seen_combinations = set()  # To track unique product combinations
    
    for _, row in monthly_trending.iterrows():
        # Create a unique identifier for the product and season event combination
        unique_id = (row['prod_name'], row['season_event'], row['sales_volume'])
        
        # Check if this combination has already been seen
        if unique_id not in seen_combinations:
            # Build a suggestion entry, capturing all relevant details
            suggestions.append({
                "Product ID": row['prod_id'],
                "Product Name": row['prod_name'],
                "Variant": row['variant_name'],
                "Color": row['var_color'],
                "Date": row['sales_date'].strftime("%B %d") if pd.notna(row['sales_date']) else "N/A",
                "Season Event": row['season_event'],
                "Season Start": row['season_start'].strftime("%B %d") if pd.notna(row['season_start']) else "N/A",
                "Season End": row['season_end'].strftime("%B %d") if pd.notna(row['season_end']) else "N/A",
                "Average Sales": row['sales_volume'],
            })

            # Add the combination to the seen set to avoid duplicates
            seen_combinations.add(unique_id)

    if not suggestions:
        print("No unique suggestions found for this month.")
    
    return suggestions

# Example usage for February
forecast_results = forecast_trending_products(2)

# Display forecast results in a structured format
def display_forecast_results(forecast_results):
    print("Suggested Products this Month:")
    for suggestion in forecast_results:
        print(f"Product ID: {suggestion['Product ID']}")
        print(f"Product Name: {suggestion['Product Name']}")
        print(f"Variant: {suggestion['Variant']}")
        print(f"Color: {suggestion['Color']}")
        print(f"Date: {suggestion['Date']}")
        print(f"Season Event: {suggestion['Season Event']}")
        print(f"Season Start: {suggestion['Season Start']}")
        print(f"Season End: {suggestion['Season End']}")
        print(f"Average Sales: {suggestion['Average Sales']}")
        print("-" * 40)  # Divider line for readability

# Example usage
display_forecast_results(forecast_results)


# In[ ]:




