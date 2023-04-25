from app import db
from sqlalchemy import inspect, func
from datetime import datetime
from sqlalchemy.dialects.postgresql import JSON


class User(db.Model):
    id = db.Column(db.String(20), primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    wallet_address = db.Column(db.String(60), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, unique=False,
                        nullable=False, default=datetime.utcnow)

    def __repr__(self) -> str:
        return f"<User {self.username}>"


class Nonce(db.Model):
    wallet_address = db.Column(db.String(60), primary_key=True)
    nonce = db.Column(db.String(120), unique=False, nullable=False)
    registered = db.Column(db.Boolean, unique=False, nullable=False)

class Requests(db.Model):
    id = db.Column(db.DateTime, primary_key=True, default=datetime.utcnow)
    user_id = db.Column(db.String(20), unique=False, nullable=False)
    address = db.Column(db.String(50), unique=False, nullable=False)
    amount = db.Column(db.String(50), unique=False, nullable=False)
    status = db.Column(db.String(20), unique=False, nullable=False)
    details = db.Column(JSON)

class Transactions(db.Model):
    id = db.Column(db.DateTime, primary_key=True, default=datetime.utcnow)
    user_id = db.Column(db.String(20), unique=False, nullable=False)
    transactiontype = db.Column(db.String(20), unique=False, nullable=False)
    details = db.Column(JSON)
    



def serialize(obj) -> dict:
    return {c: getattr(obj, c) for c in inspect(obj).attrs.keys()}
