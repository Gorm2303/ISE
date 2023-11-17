from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId

app = Flask(__name__)

# MongoDB configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/TradingPlatformDB"

# JWT configuration
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # change this to a random secret key

mongo = PyMongo(app)
jwt = JWTManager(app)

@app.route('/')
def index():
    return "Trading Platform Backend is Running!"

@app.route('/auth/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    # Query user from the database
    user = mongo.db.users.find_one({'username': username})

    # Check if user exists and password is correct
    if user and check_password_hash(user['password'], password):
        # Create JWT token
        access_token = create_access_token(identity=str(user['_id']))
        return jsonify(token=access_token, userId=str(user['_id']), message="Login successful"), 200
    else:
        return jsonify(message="Invalid username or password"), 401

@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    hashed_password = generate_password_hash(password)

    # Add user to the database
    mongo.db.users.insert_one({'username': username, 'password': hashed_password, 'balance': 0.0})

    return jsonify(message="User registered successfully"), 201

@app.route('/account/deposit', methods=['POST'])
@jwt_required()
def deposit_money():
    current_user_id = get_jwt_identity()
    amount = request.json.get('amount', 0)

    user = mongo.db.users.find_one({'_id': ObjectId(current_user_id)})

    if user:
        if 'balance' not in user:
            user['balance'] = 0.0

        new_balance = user['balance'] + amount
        mongo.db.users.update_one({'_id': current_user_id}, {'$set': {'balance': new_balance}})

        return jsonify(newBalance=new_balance, message="Deposited successfully"), 200
    else:
        return jsonify(message="User not found"), 404
    
@app.route('/account/withdraw', methods=['POST'])
@jwt_required()
def withdraw_money():
    current_user_id = get_jwt_identity()
    amount = request.json.get('amount', 0)

    user = mongo.db.users.find_one({'_id': ObjectId(current_user_id)})

    if user:
        # Check if the user has enough balance to withdraw
        if 'balance' not in user or user['balance'] < amount:
            return jsonify(message="Insufficient balance"), 400

        new_balance = user['balance'] - amount
        mongo.db.users.update_one({'_id': ObjectId(current_user_id)}, {'$set': {'balance': new_balance}})

        return jsonify(newBalance=new_balance, message="Withdrawal successful"), 200
    else:
        return jsonify(message="User not found"), 404
    
@app.route('/stocks/buy', methods=['POST'])
@jwt_required()
def buy_stocks():
    current_user_id = get_jwt_identity()
    stock_symbol = request.json.get('stockSymbol', None)
    quantity = request.json.get('quantity', 0)

    user = mongo.db.users.find_one({'_id': ObjectId(current_user_id)})

    if not user:
        return jsonify(message="User not found"), 404

    # Example: Fetch stock price (this would be your logic to get the real/current price)
    stock_price = get_stock_price(stock_symbol)

    if stock_price is None:
        return jsonify(message="Invalid stock symbol"), 400

    total_cost = stock_price * quantity

    if user['balance'] < total_cost:
        return jsonify(message="Insufficient balance"), 400

    # Deduct the cost and update user's balance
    new_balance = user['balance'] - total_cost
    mongo.db.users.update_one({'_id': ObjectId(current_user_id)}, {'$set': {'balance': new_balance}})

    # Add stocks to user's portfolio
    # This is a simplified logic. You need to handle adding to existing stocks, etc.
    mongo.db.users.update_one({'_id': ObjectId(current_user_id)}, {'$push': {'portfolio': {'stockSymbol': stock_symbol, 'quantity': quantity}}})

    return jsonify(newBalance=new_balance, message="Stocks purchased successfully"), 200

@app.route('/stocks/sell', methods=['POST'])
@jwt_required()
def sell_stocks():
    current_user_id = get_jwt_identity()
    stock_symbol = request.json.get('stockSymbol', None)
    quantity = request.json.get('quantity', 0)

    user = mongo.db.users.find_one({'_id': ObjectId(current_user_id)})

    if not user:
        return jsonify(message="User not found"), 404

    # Check if user has the stock and enough quantity to sell
    stock_to_sell = next((item for item in user.get('portfolio', []) if item['stockSymbol'] == stock_symbol), None)

    if stock_to_sell is None or stock_to_sell['quantity'] < quantity:
        return jsonify(message="Insufficient stock quantity"), 400

    # Example: Fetch stock price
    stock_price = get_stock_price(stock_symbol)

    if stock_price is None:
        return jsonify(message="Invalid stock symbol"), 400

    total_sale_amount = stock_price * quantity

    # Increase user's balance
    new_balance = user['balance'] + total_sale_amount
    mongo.db.users.update_one({'_id': ObjectId(current_user_id)}, {'$set': {'balance': new_balance}})

    # Update portfolio
    if stock_to_sell['quantity'] == quantity:
        # Remove the stock from the portfolio
        mongo.db.users.update_one({'_id': ObjectId(current_user_id)}, {'$pull': {'portfolio': {'stockSymbol': stock_symbol}}})
    else:
        # Subtract the quantity
        new_quantity = stock_to_sell['quantity'] - quantity
        mongo.db.users.update_one({'_id': ObjectId(current_user_id)}, {'$set': {'portfolio.$.quantity': new_quantity}})

    return jsonify(newBalance=new_balance, message="Stocks sold successfully"), 200


if __name__ == '__main__':
    app.run(debug=True)
