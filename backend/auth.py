import jwt
import datetime
from flask import request, jsonify
import json, os
from functools import wraps
from flask_bcrypt import Bcrypt

SECRET_KEY = "89036e4d131f0484cc12b880663751b58201bbb1d5070aff20f21cf494a4d521"
USERS_FILE = 'users.json'
bcrypt = Bcrypt()

def load_users():
    if not os.path.exists(USERS_FILE):
        return []
    with open(USERS_FILE, 'r') as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=4)

def find_user_by_email(email):
    users = load_users()
    return next((u for u in users if u["email"] == email), None)

def create_user(email, password):
    users = load_users()
    if find_user_by_email(email):
        return None
    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    user = {"id": len(users)+1, "email": email, "password": hashed_pw}
    users.append(user)
    save_users(users)
    return user

def verify_password(user, password):
    return bcrypt.check_password_hash(user["password"], password)

def generate_token(user):
    payload = {
        "id": user["id"],
        "email": user["email"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[-1]

        if not token:
            return jsonify({"error": "Token is missing"}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user = data
        except Exception as e:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)
    return decorated

def register_routes(app):
    @app.route('/auth/register', methods=['POST'])
    def register():
        data = request.json
        if not data.get('email') or not data.get('password'):
            return jsonify({"error": "Missing email or password"}), 400
        user = create_user(data["email"], data["password"])
        if not user:
            return jsonify({"error": "User already exists"}), 400
        token = generate_token(user)
        return jsonify({"token": token})










    @app.route('/auth/login', methods=['POST'])
    def login():
        data = request.json
        user = find_user_by_email(data.get("email"))
        if not user or not verify_password(user, data.get("password")):
            return jsonify({"error": "Invalid credentials"}), 401
        token = generate_token(user)
        return jsonify({"token": token})
