from flask import Flask, request, jsonify, make_response, redirect
import datetime
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask import send_file
import requests
import os

import jwt
import bitcoinaddress
import zipfile
import json

from functools import wraps
from bitcoinlib.keys import Address
from bson import ObjectId
from bson import json_util

import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import IsolationForest
 

x = datetime.datetime.now()
 
# Initializing flask app
app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://akash:akash@justicejunction.fyv1ftg.mongodb.net/marketplace" # Change `myDatabase` to your database name
app.config['SECRET_KEY'] = 'your_secret_key'
mongo = PyMongo(app)
bcrypt = Bcrypt(app)
CORS(app) 
# CORS(app, origins='http://localhost:5173')


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
            return jsonify({'message': 'Please login to send this request'}), 403

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = mongo.db.users.find_one({'username': data['username']})
        except:
            return jsonify({'message': 'Auth token is invalid!'}), 403

        return f(current_user, *args, **kwargs)

    return decorated

@app.route('/register', methods=['POST'])
def signup_user():  
    data = request.get_json()
    if not data.get('username') or not data.get('passwd'):
        return jsonify({"error": "Username and password are required"}), 400
    existing_user = mongo.db.users.find_one({"username": data.get('username')})
    if existing_user:
        return jsonify({"error": "Username already exists"}), 400
    hashed_password = bcrypt.generate_password_hash(data['passwd']).decode('utf-8')
    mongo.db.users.insert_one({'username': data['username'], 'password': hashed_password, 'name': data['name']})
    return jsonify({'message': 'registered successfully'})

@app.route('/login', methods=['POST'])
def login_user():
    auth = request.get_json()

    if not auth or not auth['username'] or not auth['password']:
        return make_response('Need all fields', 401, {'Authentication': 'login required"'})
    
    user = mongo.db.users.find_one({'username': auth['username']})

    if not user:
        return make_response('Not Found! Please register', 401, {'Authentication': 'login required"'})
    
    if bcrypt.check_password_hash(user['password'], auth['password']):
        token = jwt.encode({'username': user['username'], 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])
        return jsonify({'token' : token, 'name': user['name']})

    return make_response('Incorrect Password',  401, {'Authentication': 'login required"'})

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
        
        currentTime = datetime.datetime.utcnow()
        # Prepare survey document
        survey = {
            "title": data['title'],
            "description": data.get('description', ''),
            "questions": data['questions'],
            "questions_type": data["questions_type"],
            "fees": data['fees'],
            "status": "open",
            "user": user['username'],
            "time" : currentTime
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
        print(data)
        
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
    
    
@app.route('/surveys/<survey_id>/responses', methods=['GET'])
def get_survey_response(survey_id):
    survey_responses = list(mongo.db.responses.find({'survey_id': survey_id}))
    id = ObjectId(survey_id)
    surveys = list(mongo.db.surveys.find({'_id': id}))
    print(surveys)
    anomaly=0
    nanomaly=0
    nchecked=0
    file_data=[]
    for i in survey_responses:
        if (i['score']!=-1):
            row = {}
            for j in range(len(surveys[0]['questions'])):
                row[surveys[0]['questions'][j]] = i['answers'][j]
            file_data.append(row)
        if (i['score']==-1):
            anomaly+=1
        elif (i['score']==1):
            nanomaly+=1
        else:
            nchecked+=1
    return jsonify({"message": "Responses fetched successfully.", "Anomaly": anomaly, "Not Anomaly": nanomaly, "Not Checked": nchecked, "responses": file_data[0: int(0.1*len(file_data))]}), 200
    
    
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
    
@app.route('/surveys/<survey_id>', methods=['GET'])
def get_all_surveys_by_id(survey_id):
    id = ObjectId(survey_id)
    try:
        # Query all surveys from the database
        surveys = list(mongo.db.surveys.find({"_id": id}))
        
        # Check if surveys exist
        if not surveys:
            return jsonify({"message": "No surveys found"}), 404
        
        for survey in surveys:
            survey['_id'] = str(survey['_id'])
        
        # Return surveys
        return jsonify({"surveys": surveys}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
@app.route('/anomaly_detection/<survey_id>')
def anomaly_detection(survey_id):
        # Step 2: Retrieve survey data responses from MongoDB
    survey_responses = list(mongo.db.responses.find({'survey_id': survey_id}))

    if not survey_responses:
        return jsonify({'error': 'Survey data not found'}), 404

    # Step 3: Preprocess the survey answers
    for response in survey_responses:
        answers = response['answers']
        # Encode string columns using unique data in columns
        for i in range(len(answers)):
            if isinstance(answers[i], str):
                unique_values = set(response['answers'][i] for response in survey_responses if isinstance(response['answers'][i],str))
                label_encoder = LabelEncoder()
                label_encoder.fit(list(unique_values))
                answers[i] = label_encoder.transform([answers[i]])[0]
    # Step 4: Extract relevant features (assuming data is in the 'answers' field)
    data = np.array([response['answers'] for response in survey_responses])
    # Step 5: Run anomaly detection algorithm (Isolation Forest)
    isolation_forest = IsolationForest(contamination=0.05)
    anomaly_predictions = isolation_forest.fit_predict(data)
    # Step 6: Update responses collection with anomaly scores
    for response, anomaly_score in zip(survey_responses, anomaly_predictions):
        mongo.db.responses.update_one({'_id': response['_id']}, {'$set': {'score': int(anomaly_score)}})
    return jsonify({'message': 'Anomaly detection algorithm executed.'}), 200
    
    
@app.route('/buy/<survey_id>', methods=['GET'])
def buy_data(survey_id):
    # Step 7: Check if any anomalies were detected
    # if -1 in anomaly_predictions:
    #     return jsonify({'error': 'Anomalies detected in data. Purchase not allowed'}), 400

    # Step 8: Request payment in Bitcoin using CoinGate API
    id = ObjectId(survey_id)
    amount = mongo.db.surveys.find_one({'_id': id})['fees']/100000000
    payload = {
        'order_id': survey_id,
        'price_amount': f'{amount}',
        'price_currency': 'BTC',
        "receive_address": "YOUR_WALLET_ADDRESS",
        'receive_currency': 'BTC',
        'title': f'Data purchase for survey {survey_id}',
        'callback_url': "http://localhost:5000/callback",
        "cancel_url": "http://localhost:5000/cancel",
        "success_url": f"http://localhost:5000/success/{survey_id}",
        "description": "Description of the order"

    }
    order_json = json.dumps(payload)
    auth_token = "BesNYbT8Py-Loy9yw_skp-AawiDvEvG9q3jRHbL_"
    headers = {
         "accept": "application/json",
        "content-type": "application/json",
        "Authorization": f"Bearer {auth_token}"
    }
    response = requests.post('https://api-sandbox.coingate.com/v2/orders', headers=headers, data=order_json)
    if response.status_code != 200:
        return jsonify(response.json()), response.status_code

    payment_url = response.json().get('payment_url')
    return redirect(payment_url)

@app.route('/callback', methods=['POST'])
def payment_callback():
    data = request.json
    if data['status'] == 'paid':
        survey_id = data['order_id']
        survey_responses = list(mongo.db.responses.find({'survey_id': survey_id}))
        filename = os.path.join('downloads', f'{survey_id}.json')
        with open(filename, 'w') as f:
            json.dump(survey_responses, f, indent=4)
        return send_file(filename, as_attachment=True, attachment_filename=f'{survey_id}.json'), 200
    return jsonify({'error': 'Payment not confirmed'}), 400


@app.route('/success/<survey_id>', methods=['POST', 'GET'])
def success(survey_id):
    survey_responses = list(mongo.db.responses.find({'survey_id': survey_id}))
    id = ObjectId(survey_id)
    surveys = list(mongo.db.surveys.find({'_id': id}))
    print(surveys)
    file_data=[]
    for i in survey_responses:
        if (i['score']!=-1):
            row = {}
            for j in range(len(surveys[0]['questions'])):
                row[surveys[0]['questions'][j]] = i['answers'][j]
            file_data.append(row)
    
    filename = os.path.join('downloads', f'{survey_id}.json')
    with open(filename, 'w') as f:
        json.dump(file_data, f, indent=4)
    return send_file(filename, as_attachment=True), 200
 
 
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