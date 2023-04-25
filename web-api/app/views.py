from datetime import datetime
from app import db, models
import random
import jwt

from flask import Blueprint, request, make_response
from flask_cors import cross_origin
from web3.auto import w3
from eth_account.messages import encode_defunct

from .config import AUTH_EXP, JWT_SECRET, NONCE_LETTERS

view = Blueprint("view", __name__)


@view.route("/api/available", methods=["GET"])
def available():
    return {
        "username": models.User.query.filter_by(username=request.args.get("username")).first() is None,
        "email": models.User.query.filter_by(email=request.args.get("email")).first() is None
    }, 200


@view.route("/api/nonce", methods=["GET"])
def nonce():
    address = request.args.get("walletAddress")
    nonce = models.Nonce(
        wallet_address=address,
        nonce="".join(random.choice(NONCE_LETTERS) for i in range(100)),
        registered=models.User.query.filter_by(wallet_address=address).first() is not None)
    db.session.merge(nonce)
    db.session.commit()
    return models.serialize(nonce), 200


@view.route("/api/auth", methods=["POST"])
@cross_origin(supports_credentials=True)
def auth():
    content = request.json
    user = models.User.query.filter_by(
        wallet_address=content["wallet_address"]).first()
    if user is None:
        return "User with this address is not registered", 401
    nonce = models.Nonce.query.filter_by(
        wallet_address=content["wallet_address"]).first()
    expected_address = w3.eth.account.recover_message(
        encode_defunct(text=nonce.nonce), signature=content["signature"])
    if expected_address != content["wallet_address"]:
        return "invalid signature", 401
    db.session.delete(nonce)
    db.session.commit()
    access_token = jwt.encode({
        "exp": datetime.utcnow() + AUTH_EXP,
        "iat": datetime.utcnow(),
        "user_id": user.id,
    }, JWT_SECRET, algorithm="HS256")
    response = make_response()
    response.set_cookie("acc_tkn", access_token, max_age=AUTH_EXP)
    return response, 200

@view.route("/api/transactions", methods=["GET"])
@cross_origin(supports_credentials=True)
def transactions():
    cookie = request.cookies.get("acc_tkn")
    userid = jwt.decode(cookie, JWT_SECRET, algorithms=["HS256"])["user_id"]
    user = models.User.query.filter_by(id=userid).first()
    print(user)
    transactions = models.Transactions.query.filter_by(user_id=user.username).all()
    jsontransactions = []
    for transaction in transactions:
        jsontransactions.append(models.serialize(transaction))
    return {"transactions": jsontransactions}, 200

@view.route("/api/requests", methods=["GET"])
@cross_origin(supports_credentials=True)
def requests():
    cookie = request.cookies.get("acc_tkn")
    userid = jwt.decode(cookie, JWT_SECRET, algorithms=["HS256"])["user_id"]
    user = models.User.query.filter_by(id=userid).first()
    print(user)
    transactionrequests = models.Requests.query.filter_by(address=user.username).all()
    jsonrequests = []
    for transaction in transactionrequests:
        dict = models.serialize(transaction)
        dict['target']=user.wallet_address
        jsonrequests.append(dict)
    return {"requests": jsonrequests}, 200

@view.route("/api/splitmoney", methods=["POST"])
@cross_origin(supports_credentials=True)
def splitmoney():
    print(request.get_json())
    data = request.get_json()
    cookie = request.cookies.get("acc_tkn")
    userid = jwt.decode(cookie, JWT_SECRET, algorithms=["HS256"])["user_id"]
    user = models.User.query.filter_by(id=userid).first()
    transaction = models.Transactions(
        user_id=user.username,
        transactiontype='split',
        details=data
    )
    i=0
    amounts = data['splits'].split(',')
    for payee in data['payees'].split(','):
        txnrequest = models.Requests(
            user_id=user.username,
            address=payee,
            amount=amounts[i],
            status='Pending',
            details=data)
        print(txnrequest)
        db.session.add(txnrequest)
        db.session.commit()
        i+=1
    print(transaction)
    db.session.add(transaction)
    db.session.commit()

    response = make_response()
    return response, 200

@view.route("/api/requestmoney", methods=["POST"])
@cross_origin(supports_credentials=True)
def requestmoney():
    print(request.get_json())
    data = request.get_json()
    cookie = request.cookies.get("acc_tkn")
    userid = jwt.decode(cookie, JWT_SECRET, algorithms=["HS256"])["user_id"]
    user = models.User.query.filter_by(id=userid).first()
    transaction = models.Transactions(
        user_id=user.username,
        transactiontype='request',
        details=data
    )
    
    txnrequest = models.Requests(
        user_id=user.username,
        address=data['address'],
        amount=data['amount'],
        status='Pending',
        details=data)
    print(txnrequest)
    db.session.add(txnrequest)
    db.session.commit()
    print(transaction)
    db.session.add(transaction)
    db.session.commit()

    response = make_response()
    return response, 200

@view.route("/api/buynft", methods=["POST"])
@cross_origin(supports_credentials=True)
def buynft():
    print(request.get_json())
    data = request.get_json()
    cookie = request.cookies.get("acc_tkn")
    userid = jwt.decode(cookie, JWT_SECRET, algorithms=["HS256"])["user_id"]
    user = models.User.query.filter_by(id=userid).first()
    transaction = models.Transactions(
        user_id=user.username,
        transactiontype='split',
        details=data
    )
    
    print(transaction)
    db.session.add(transaction)
    db.session.commit()

    response = make_response()
    return response, 200

@view.route("/api/paymentcomplete", methods=["POST"])
def paymentdone():
    response = make_response()
    return response, 200

@view.route("/api/register", methods=["POST"])
def register():
    content = request.json
    if models.User.query.filter_by(username=content["username"]).first() is not None:
        return "username is already exist", 409
    if models.User.query.filter_by(email=content["email"]).first() is not None:
        return "email is already exist", 409
    if models.User.query.filter_by(email=content["wallet_address"]).first() is not None:
        return "wallet address is already exist", 409
    nonce = models.Nonce.query.filter_by(
        wallet_address=content["wallet_address"]).first()
    expected_address = w3.eth.account.recover_message(
        encode_defunct(text=nonce.nonce), signature=content["signature"])
    if expected_address != content["wallet_address"]:
        return "invalid signature", 401
    user = models.User(id=content["username"],
                       username=content["username"], email=content["email"], wallet_address=expected_address)
    db.session.add(user)
    db.session.delete(nonce)
    db.session.commit()
    access_token = jwt.encode({
        "exp": datetime.utcnow() + AUTH_EXP,
        "iat": datetime.utcnow(),
        "user_id": user.id,
    }, JWT_SECRET, algorithm="HS256")
    response = make_response()
    response.set_cookie("acc_tkn", access_token, max_age=AUTH_EXP)
    return response, 200


@view.after_request
def apply_caching(response):
    print(response.status_code)
    response.headers.add("Access-Control-Allow-Origin",
                         "http://localhost:3000")
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type, Authorization')
    response.headers.add('Access-Control-Allow-Methods', "*")
    response.headers.add('Access-Control-Allow-Credentials', "true")
    return response
