import requests
import json

# The endpoint you want to test
url = "http://localhost:8000/api/v1/orchestrator/query"

# The data payload
payload = {
    "query": "Forecast sales for next month",
    "user_id": "test_user",
    "context": {
        "dataset": [
            # Prophet usually needs more than 2 points, providing a small mock history here
            {"date": "2024-01-01", "sales": 100},
            {"date": "2024-01-02", "sales": 105},
            {"date": "2024-01-03", "sales": 110},
            {"date": "2024-01-04", "sales": 108},
            {"date": "2024-01-05", "sales": 115}
        ]
    },
    "parameters": {
        "periods": 30
    }
}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, json=payload)
    
    # Print status and response
    print(f"Status Code: {response.status_code}")
    print("\nResponse Body:")
    print(json.dumps(response.json(), indent=2))

except requests.exceptions.ConnectionError:
    print("Error: Could not connect to localhost:8000. Is the server running?")