from flask import Flask, request, jsonify, render_template
import jwt
import requests

app = Flask(__name__)

# Clé publique Pi Network (tu peux la mettre dans un fichier ou config)
PI_PUB_KEY_URL = "https://pi-auth.s3.amazonaws.com/pi-auth-key.pub"
pub_key = requests.get(PI_PUB_KEY_URL).text

@app.route('/')
def index():
    # Si tu utilises un template, sinon servir ton index.html statique
    return render_template('index.html')

@app.route('/api/verify_token', methods=['POST'])
def verify_token():
    data = request.json
    token = data.get('token')

    if not token:
        return jsonify({"success": False, "error": "Token manquant"}), 400

    try:
        payload = jwt.decode(token, pub_key, algorithms=['RS256'], audience='pi-network')
        username = payload.get("username")
        user_id = payload.get("userId")
        # Ici tu peux gérer ta session ou sauvegarder l'utilisateur en base
        return jsonify({"success": True, "username": username, "userId": user_id})
    except jwt.ExpiredSignatureError:
        return jsonify({"success": False, "error": "Token expiré"}), 401
    except jwt.InvalidAudienceError:
        return jsonify({"success": False, "error": "Audience invalide"}), 401
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 401

if __name__ == "__main__":
    app.run(debug=True)
