from app import app, db
from app.config import SERVER_SETTINGS as settings
from app import views
from app import models
app.app_context().push()
if __name__ == "__main__":
    app.register_blueprint(views.view)
    db.create_all()
    print(db)
    app.run(host=settings["IP"], port=settings["PORT"], debug=settings["DEBUG"])