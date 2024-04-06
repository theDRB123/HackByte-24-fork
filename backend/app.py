from flask import Flask, request, jsonify, make_response
import datetime
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
import jwt
import bitcoinaddress
from functools import wraps
from bitcoinlib.keys import Address
 
x = datetime.datetime.now()
 
# Initializing flask app
app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://akash:akash@justicejunction.fyv1ftg.mongodb.net/marketplace" # Change `myDatabase` to your database name
app.config['SECRET_KEY'] = 'your_secret_key'
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
CORS(app) 


def is_valid_bitcoin_address(address):
    try:
        Address.import_address(address)
        return True
    except Exception:
        return False


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            token = request.headers['Authorization']

        if not token:
            return jsonify({'message': 'Token is missing!'}), 403

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = mongo.db.users.find_one({'username': data['username']})
        except:
            return jsonify({'message': 'Token is invalid!'}), 403

        return f(current_user, *args, **kwargs)

    return decorated

@app.route('/register', methods=['POST'])
def signup_user():  
    data = request.get_json()
    if not data.get('username') or not data.get('password'):
        return jsonify({"error": "Username and password are required"}), 400
    existing_user = mongo.db.users.find_one({"username": data.get('username')})
    if existing_user:
        return jsonify({"error": "Username already exists"}), 400
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    mongo.db.users.insert_one({'username': data['username'], 'password': hashed_password, 'name': data['name']})
    return jsonify({'message': 'registered successfully'})

@app.route('/login', methods=['POST'])
def login_user():
    auth = request.get_json()

    if not auth or not auth['username'] or not auth['password']:
        return make_response('could not verify', 401, {'Authentication': 'login required"'})
    
    user = mongo.db.users.find_one({'username': auth['username']})

    if not user:
        return make_response('could not verify', 401, {'Authentication': 'login required"'})
    
    if bcrypt.check_password_hash(user['password'], auth['password']):
        token = jwt.encode({'username': user['username'], 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])
        return jsonify({'token' : token})

    return make_response('could not verify',  401, {'Authentication': 'login required"'})

@app.route('/surveys', methods=['POST'])
@token_required
def create_survey(user):
    try:
        # Parse request data
        data = request.json
        
        # Validate request data
        if not data.get('title'):
            return jsonify({"error": "Survey title is required"}), 400
        if not data.get('questions'):
            return jsonify({"error": "Survey questions are required"}), 400
        
        # Prepare survey document
        survey = {
            "title": data['title'],
            "description": data.get('description', ''),
            "questions": data['questions'],
            "questions_type": data["questions_type"],
            "fees": data['fees'],
            "status": "open",
            "user": user['username']
        }
        
        # Insert survey into database
        inserted_survey = mongo.db.surveys.insert_one(survey)
        
        # Return success response
        return jsonify({
            "message": "Survey created successfully",
            "survey_id": str(inserted_survey.inserted_id)
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
@app.route('/surveys/<survey_id>/responses', methods=['POST'])
def post_survey_response(survey_id):
    try:
        # Parse request data
        data = request.json
        
        # Validate request data
        if not data.get('answers') or not data.get('wallet_address'):
            return jsonify({"error": "Answers, and wallet address are required"}), 400
        
        # Verify wallet address
        if not is_valid_bitcoin_address(data['wallet_address']):
            return jsonify({"error": "Invalid wallet address"}), 400
        
        # Prepare response document
        response = {
            "survey_id": survey_id,
            "answers": data['answers'],
            "wallet_address": data['wallet_address'],
            'score': 0
        }
        
        # Insert response into database
        inserted_response = mongo.db.responses.insert_one(response)
        
        # Return success response
        return jsonify({
            "message": "Survey response posted successfully",
            "response_id": str(inserted_response.inserted_id)
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
@app.route('/surveys', methods=['GET'])
def get_all_surveys():
    try:
        # Query all surveys from the database
        surveys = list(mongo.db.surveys.find())
        
        # Check if surveys exist
        if not surveys:
            return jsonify({"message": "No surveys found"}), 404
        
        for survey in surveys:
            survey['_id'] = str(survey['_id'])
        
        # Return surveys
        return jsonify({"surveys": surveys}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
 
 
# Route for seeing a data
@app.route('/data')
def get_time():
 
    # Returning an api for showing in  reactjs
    return {
        'Name':"geek", 
        "Age":"22",
        "Date":x, 
        "programming":"python"
        }
 
     
# Running app
if __name__ == '__main__':
    app.run(debug=True)