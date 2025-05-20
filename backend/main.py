from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///contacts.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db = SQLAlchemy(app)


class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email
        }


@app.route('/contacts', methods=['GET'])
def get_contacts():
    contacts = Contact.query.all()
    return jsonify({"contacts": [c.to_dict() for c in contacts]})


@app.route('/create-contact', methods=['POST'])
def create_contact():
    data = request.get_json()
    if not data or not all(k in data for k in ("first_name", "last_name", "email")):
        return jsonify({"success": False, "error": "Missing fields"}), 400
    contact = Contact(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email']
    )
    db.session.add(contact)
    db.session.commit()
    return jsonify({"success": True, "contact": contact.to_dict()}), 201

@app.route('/update-contact/<int:id>', methods=['PATCH'])
def update_contact(id):
    data = request.get_json()
    contact = Contact.query.get_or_404(id)
    contact.first_name = data.get('first_name', contact.first_name)
    contact.last_name = data.get('last_name', contact.last_name)
    contact.email = data.get('email', contact.email)
    db.session.commit()
    return jsonify({"success": True, "contact": contact.to_dict()})


@app.route('/delete-contact/<int:id>', methods=['DELETE'])
def delete_contact(id):
    contact = Contact.query.get_or_404(id)
    db.session.delete(contact)
    db.session.commit()
    return jsonify({"success": True})


@app.route('/')
def index():
    return jsonify({"message": "Contact List API is running!"})

if __name__ == '__main__':
    
    with app.app_context():
        db.create_all()
    app.run(debug=True)
