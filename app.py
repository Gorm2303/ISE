import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# MongoDB configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/TradingPlatformDB"

# JWT configuration
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # change this to a random secret key

mongo = PyMongo(app)
jwt = JWTManager(app)
api_key = 'dd5agEuxMxzBU8yLY97M'  # Replace with your actual API key

@app.route('/')
def index():
    return "Trading Platform Backend is Running!"

@app.route('/latest-stocks')
def get_latest_stocks_prices():
    stock_symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'FB', 'TSLA', 'JPM', 'V', 'WMT', 'DIS']  # Add more symbols as needed
    latest_prices = {}

    for symbol in stock_symbols:
        try:
            url = f'https://www.quandl.com/api/v3/datasets/WIKI/{symbol}.json?api_key={api_key}&rows=1'  # Fetch only the latest row
            response = requests.get(url)
            response.raise_for_status()
            latest_data = response.json()['dataset']['data'][0]
            latest_prices[symbol] = {
                'date': latest_data[0],
                'close': latest_data[4]
            }
        except requests.RequestException as e:
            print(f"Error fetching data for {symbol}: {e}")

    return jsonify(latest_prices)

@app.route('/user/balance', methods=['GET'])
@jwt_required()
def get_balance():
    current_user_id = get_jwt_identity()

    # Fetching the user from the database
    user = mongo.db.users.find_one({'_id': ObjectId(current_user_id)})

    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Extracting the balance from the user's data
    balance = user.get('balance', 0)  # Default to 0 if no balance field

    return jsonify({'balance': balance})

@app.route('/user/portfolio')
@jwt_required()
def get_portfolio():
    current_user_id = get_jwt_identity()
    user = mongo.db.users.find_one({'_id': ObjectId(current_user_id)})
    
    print("Fetching portfolio for user:", current_user_id)  # Debug print

    if not user:
        return jsonify(message="User not found"), 404

    print("Portfolio data:", user.get('portfolio', []))  # Debug print

    return jsonify(portfolio=user.get('portfolio', [])), 200


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
        return jsonify(token=access_token, userId=str(user['_id']), 
                       message="Login successful"), 200
    else:
        return jsonify(message="Invalid username or password"), 401

@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    hashed_password = generate_password_hash(password)

    # Check if username already exists
    if mongo.db.users.find_one({'username': username}):
        return jsonify(message="Username already exists"), 400

    user_data = {
        'username': username,
        'password': hashed_password,
        'balance': 1000,
        'portfolio': []
    }
    
    mongo.db.users.insert_one(user_data)
    return jsonify(message="User registered successfully"), 201

@app.route('/account/deposit', methods=['POST'])
@jwt_required()
def deposit_money():
    data = request.json
    print("Received data:", data)
    # Your validation and processing logic...
    current_user_id = get_jwt_identity()
    amount = request.json.get('amount', 0)
    print("Request amount:", amount)

    user = mongo.db.users.find_one({'_id': ObjectId(current_user_id)})

    print("User: ", user)

    if user:
        if 'balance' not in user:
            user['balance'] = 0.0

        new_balance = user['balance'] + amount
        mongo.db.users.update_one({'_id': ObjectId(current_user_id)}, {'$set': {'balance': new_balance}})
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
    
def get_stock_price(stock_symbol):
    # This is a placeholder. Replace the URL with the actual endpoint of the stock price API.
    url = f'https://www.quandl.com/api/v3/datasets/WIKI/{stock_symbol}/data.json?api_key={api_key}'

    try:
        # Make a request to the API
        response = requests.get(url, params={"api_key": api_key})
        response.raise_for_status()  # This will raise an error for a bad request (4xx or 5xx response)

        # Parse the response JSON and return the stock price
        data = response.json()
        return data['dataset_data']['data'][0][4]  # Adjust according to the response structure
    except requests.RequestException as e:
        # Handle any errors that occur during the request
        print(f"Error fetching stock price for {stock_symbol}: {e}")
        return None

@app.route('/stocks/buy', methods=['POST'])
@jwt_required()
def buy_stocks():
    current_user_id = get_jwt_identity()
    stock_symbol = request.json.get('stockSymbol', None)
    quantity = request.json.get('quantity', 0)

    user = mongo.db.users.find_one({'_id': ObjectId(current_user_id)})
    if not user:
        return jsonify(message="User not found"), 404

    stock_price = get_stock_price(stock_symbol)
    if stock_price is None:
        return jsonify(message="Invalid stock symbol"), 400

    total_cost = stock_price * quantity
    if user['balance'] < total_cost:
        return jsonify(message="Insufficient balance"), 400

    new_balance = user['balance'] - total_cost
    mongo.db.users.update_one({'_id': ObjectId(current_user_id)}, {'$set': {'balance': new_balance}})

    # Update portfolio
    portfolio = user.get('portfolio', [])
    stock_entry = next((item for item in portfolio if item['stockSymbol'] == stock_symbol), None)

    if stock_entry:
        # User already owns this stock, update quantity
        new_quantity = stock_entry['quantity'] + quantity
        mongo.db.users.update_one({'_id': ObjectId(current_user_id), 'portfolio.stockSymbol': stock_symbol}, {'$set': {'portfolio.$.quantity': new_quantity}})
    else:
        # User doesn't own this stock, add to portfolio
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

    portfolio = user.get('portfolio', [])
    stock_entry = next((item for item in portfolio if item['stockSymbol'] == stock_symbol), None)

    if not stock_entry or stock_entry['quantity'] < quantity:
        return jsonify(message="Insufficient stock quantity"), 400

    stock_price = get_stock_price(stock_symbol)
    total_sale_amount = stock_price * quantity
    new_balance = user['balance'] + total_sale_amount

    new_quantity = stock_entry['quantity'] - quantity
    if new_quantity > 0:
        # Update quantity in portfolio
        mongo.db.users.update_one({'_id': ObjectId(current_user_id), 'portfolio.stockSymbol': stock_symbol}, {'$set': {'portfolio.$.quantity': new_quantity}})
    else:
        # Remove stock from portfolio
        mongo.db.users.update_one({'_id': ObjectId(current_user_id)}, {'$pull': {'portfolio': {'stockSymbol': stock_symbol}}})

    # Update user's balance
    mongo.db.users.update_one({'_id': ObjectId(current_user_id)}, {'$set': {'balance': new_balance}})

    return jsonify(newBalance=new_balance, message="Stocks sold successfully"), 200

if __name__ == '__main__':
    app.run(debug=True)
