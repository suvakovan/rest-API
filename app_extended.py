from flask import Flask, request, jsonify

app = Flask(__name__)

# In-memory data store
data = {"1": "Item One", "2": "Item Two"}


def success_response(message, payload=None, status=200):
    """Helper to build consistent success responses."""
    response = {"status": "success", "message": message}
    if payload is not None:
        response["data"] = payload
    return jsonify(response), status


def error_response(message, status=400):
    """Helper to build consistent error responses."""
    return jsonify({"status": "error", "message": message}), status


@app.route('/items', methods=['GET'])
def get_items():
    """Return all items."""
    return success_response("Items retrieved successfully", data)


@app.route('/items/<item_id>', methods=['GET'])
def get_item(item_id):
    """Return a single item by ID."""
    if item_id not in data:
        return error_response(f"Item '{item_id}' not found", 404)
    return success_response("Item retrieved", {item_id: data[item_id]})


@app.route('/items', methods=['POST'])
def add_item():
    """Add a new item."""
    # Validate that body exists
    if not request.is_json:
        return error_response("Request body must be JSON", 415)

    body = request.get_json()

    # Validate required fields
    if 'id' not in body:
        return error_response("Missing required field: 'id'", 400)
    if 'value' not in body:
        return error_response("Missing required field: 'value'", 400)

    item_id = str(body['id'])
    item_value = str(body['value'])

    # Check for duplicate ID
    if item_id in data:
        return error_response(
            f"Item '{item_id}' already exists. Use PUT to update.", 409
        )

    data[item_id] = item_value
    return success_response("Item created successfully", data, 201)


@app.route('/items/<item_id>', methods=['PUT'])
def update_item(item_id):
    """Update an existing item."""
    if item_id not in data:
        return error_response(f"Item '{item_id}' not found", 404)

    if not request.is_json:
        return error_response("Request body must be JSON", 415)

    body = request.get_json()

    if 'value' not in body:
        return error_response("Missing required field: 'value'", 400)

    data[item_id] = str(body['value'])
    return success_response("Item updated successfully", data)


@app.route('/items/<item_id>', methods=['DELETE'])
def delete_item(item_id):
    """Delete an item by ID."""
    if item_id not in data:
        return error_response(f"Item '{item_id}' not found", 404)

    del data[item_id]
    return success_response("Item deleted successfully", data)


@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors globally."""
    return error_response("Endpoint not found", 404)


@app.errorhandler(405)
def method_not_allowed(e):
    """Handle 405 errors globally."""
    return error_response("HTTP method not allowed for this endpoint", 405)


if __name__ == '__main__':
    app.run(debug=True)
