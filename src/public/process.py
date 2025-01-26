import pandas as pd

# Load the CSV file
df = pd.read_csv('uscities.csv')

# Extract the 'city' column and convert it to a list
cities_list = df['city'].tolist()
cities_list = set(cities_list)

# Create the JavaScript content
js_content = 'export const cities = [\n' + ',\n'.join(f'"{city}"' for city in cities_list) + '\n];'

# Write the content to a JS file
with open('cities.js', 'w') as js_file:
    js_file.write(js_content)

print("cities.js file has been created.")