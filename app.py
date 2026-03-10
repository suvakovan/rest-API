from flask import Flask, request, jsonify

app = Flask(__name__)

# In-memory data store (acts as our database for this exercise)
data = {"1": "Item One", "2": "Item Two"}


# ─────────────────────────────────────────────
# ENDPOINT 1: GET /items
# Purpose: Retrieve ALL items from the data store
# HTTP Method: GET
# URL: http://127.0.0.1:5000/items
# Request Body: None required
# Response: JSON object containing all items
# ─────────────────────────────────────────────
@app.route('/items', methods=['GET'])
def get_items():
    return jsonify(data)


# ─────────────────────────────────────────────
# ENDPOINT 2: POST /items
# Purpose: Add a NEW item to the data store
# HTTP Method: POST
# URL: http://127.0.0.1:5000/items
# Request Body: {"id": "3", "value": "Item Three"}
# Response: Success message + updated data store
# ─────────────────────────────────────────────
@app.route('/items', methods=['POST'])
def add_item():
    item_id = request.json['id']
    item_value = request.json['value']
    data[item_id] = item_value
    return jsonify({
        "message": "Item added successfully",
        "data": data
    })


# ─────────────────────────────────────────────
# ENDPOINT 3: PUT /items/<item_id>
# Purpose: UPDATE an existing item by its ID
# HTTP Method: PUT
# URL: http://127.0.0.1:5000/items/3
# Request Body: {"value": "Updated Item Three"}
# Response: Success message + updated data store
# ─────────────────────────────────────────────
@app.route('/items/<item_id>', methods=['PUT'])
def update_item(item_id):
    item_value = request.json['value']
    data[item_id] = item_value
    return jsonify({
        "message": "Item updated successfully",
        "data": data
    })


# ─────────────────────────────────────────────
# ENDPOINT 4: DELETE /items/<item_id>
# Purpose: REMOVE an existing item by its ID
# HTTP Method: DELETE
# URL: http://127.0.0.1:5000/items/3
# Request Body: None required
# Response: Success message OR 404 error if not found
# ─────────────────────────────────────────────
@app.route('/items/<item_id>', methods=['DELETE'])
def delete_item(item_id):
    if item_id in data:
        del data[item_id]
        return jsonify({
            "message": "Item deleted successfully",
            "data": data
        })
    else:
        return jsonify({"error": "Item not found"}), 404


# ─────────────────────────────────────────────
# SERVER ENTRY POINT
# Starts the Flask development server
# ─────────────────────────────────────────────
if __name__ == '__main__':
    app.run(debug=True)
