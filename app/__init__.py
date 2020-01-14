from flask import Flask

# Create unitialized ... objects, like the database
# Allows other files in the app module to access the database object
# db = SQLAlchemy()


def create_app():

    """ Application Factory Style
    Create the Flask app object
    Initialize the ... objects with the Flask app
    This function is called from wsgi.py in the project's root directory
    """
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # Initializing ... objects with the flask app object
    # db.init_app(app)

    with app.app_context():

        # import models, views, register blueprints, apis etc.
        from . import views

        # Create the database
        # db.create_all()

        return app
