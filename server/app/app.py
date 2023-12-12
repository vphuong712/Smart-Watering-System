from datetime import datetime
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo 
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
import bcrypt
import fz

app = Flask(__name__)
CORS(app)
app.config["MONGO_URI"] = "mongodb+srv://vphuong712:gtlp560j@cluster0.7nl7hqc.mongodb.net/WateringSystem?retryWrites=true&w=majority"

app.config["JWT_SECRET_KEY"] = "super-secret"

jwt = JWTManager(app)
mongo = PyMongo(app)

def add_timestamp(document):
    document['timestamp'] = datetime.now().isoformat() + 'Z'

def jsonify_with_oid(data):
    for item in data:
        if "_id" in item:
            item["_id"] = str(item["_id"]) 
    return jsonify(data)

def check_register(firstName, lastName, email, password):
    import re

    if len(firstName) > 50 or len(lastName.strip()) == 0:
        return 'Invalid First Name.'
    if len(lastName) > 50 or len(lastName.strip()) == 0:
        return 'Invalid Last Name.'
    if len(email.strip()) == 0 or not re.fullmatch(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b', email):
        return 'Invalid Email.'
    if len(password) < 8:
        return 'Invalid Password.'
    return 'Valid Data'

def check_login(email, password):
    import re

    if len(email.strip()) == 0 or not re.fullmatch(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b', email):
        return 'Invalid Email.'
    if len(password) < 8:
        return 'Invalid Password.'
    return 'Valid Data'


@app.route('/')
def index():
    return 'Server is running!'

        
@app.route('/sensor-data', methods=['GET', 'POST'])
def sensor_data():
    if request.method == 'GET':
        data = mongo.db.sensor.find().sort([("_id", -1)]).limit(7)
        result = []
        for doc in data:
            result.append(doc)
        return jsonify_with_oid(result)

    if request.method == 'POST':
        data = request.get_json()
        temperature = data['temperature']
        humidity = data['humidity']
        soilMoisture = data['soilMoisture']

        new_doc = {
            'temperature': temperature,
            'humidity': humidity,
            'soilMoisture': soilMoisture
        }
        add_timestamp(new_doc)
        mongo.db.sensor.insert_one(new_doc)

        return 'Success!', 200  # Respond with a success message
    else:
        return 'Invalid request', 400  # Respond with a bad request status

@app.route('/sensor-data/auto', methods=['POST'])
def auto_mode():
    if request.method == 'POST':
        data = mongo.db.sensor.find().sort([("_id", -1)]).limit(1)
        result = []
        for doc in data:
            result.append(doc)
        
        doc = result[0]
        temp = doc['temperature']
        humidity = doc['humidity']
        soil = doc['soilMoisture']
        pos = fz.fuzzy(temp, humidity, soil)
        if(pos >= 70):
            return 'Your plant need to be watered', 200
        else:
            return 'Your plant has been watered enough', 200
    else:
        return 'Invalid request', 400  # Respond with a bad request status

    
    

@app.route('/toggle', methods=['GET', 'POST'])
def toggle_button():
    if request.method == 'GET':
        data = mongo.db.toggle.find().sort([("_id", -1)]).limit(4)
        result = []
        for doc in data:
            result.append(doc)
        return jsonify_with_oid(result)
    
    if request.method == 'POST':
        data = request.get_json()
        isOn = data['isOn']
        user = data['user']
        new_doc = {
            'isOn': isOn,
            'user': user
        }
        add_timestamp(new_doc)
        mongo.db.toggle.insert_one(new_doc)
        return 'Success!', 200
    else:
        return 'Invalid request', 400

@app.route('/auth/register', methods=['POST'])
def register():
    if request.method == 'POST':
        data = request.get_json()
        firstName = data['firstName']
        lastName = data['lastName']
        email = data['email']
        password = data['password']

        check = check_register(firstName, lastName, email, password)
        if check != 'Valid Data':
            return check, 400
        
        existedUser = mongo.db.user.find_one({"email": email})
        if existedUser != None:
            return 'User already exist.', 409
        
        salt = bcrypt.gensalt()
        bytes = password.encode('utf-8')
        hashPassword = bcrypt.hashpw(bytes, salt)

        new_user = {
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "password": hashPassword
        }
        mongo.db.user.insert_one(new_user)
        return 'Success!', 200
    else:
        return 'Invalid request', 400

@app.route('/auth/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        email = data['email']
        password = data['password']

        check = check_login(email, password)
        if(check != 'Valid Data'):
            return check, 400
        
        user = mongo.db.user.find_one({"email": email})
        
        if(user == None):
            return 'User does not exist', 400

        bytes = password.encode('utf-8')

        if(not bcrypt.checkpw(bytes, user['password'])):
            return 'Wrong Password.', 400
        
        access_token = create_access_token(identity=email)
        return jsonify(
            {
            'token': access_token,
            'id': str(user['_id']),
            }), 200
    else:
        return 'Invalid request', 400

@app.route('/users/<user_id>', methods=['GET', 'POST'])
@jwt_required()
def user(user_id):
    if request.method == 'GET':
        userEmail = get_jwt_identity()
        user = mongo.db.user.find_one({'email': userEmail})
        if user != None:
            return jsonify({
                    'firstName': user['firstName'],
                    'lastName': user['lastName'],
                    'email': user['email']
                }), 200
        else:
            return 'User does not exist.', 400

    if request.method == 'POST':
        data = request.get_json()
        firstName = data['firstName']
        lastName = data['lastName']
        userEmail = get_jwt_identity()
        user = mongo.db.user.find_one({'email': userEmail})
        if user != None:
            mongo.db.user.update_one({'email': userEmail}, {'$set': {'firstName': firstName, 'lastName': lastName}})
            return 'Success!', 200
        else:
            return 'User does not exist.', 400

@app.route('/users/<user_id>/change-password', methods=['POST'])
@jwt_required()
def change_password(user_id):

    if request.method == 'POST':
        data = request.get_json()
        currentPassword = data['currentPassword']
        newPassword = data['newPassword']
        confirmPassword = data['confirmPassword']

        if(newPassword != confirmPassword):
            return 'Confirm Password incorrect.', 400

        userEmail = get_jwt_identity()
        user = mongo.db.user.find_one({'email': userEmail})
        if user != None:

            bytes = currentPassword.encode('utf-8')
            if(not bcrypt.checkpw(bytes, user['password'])):
                return 'Wrong Password.', 400

            newBytesPassword = newPassword.encode('utf-8')
            salt = bcrypt.gensalt()
            hashPassword = bcrypt.hashpw(newBytesPassword, salt)           

            mongo.db.user.update_one({'email': userEmail}, {'$set': {'password': hashPassword}})
            return 'Success!', 200
        else:
            return 'User does not exist.', 400

        
if __name__ == '__main__':
    app.run(host='172.20.10.9', port=5000, debug=True)