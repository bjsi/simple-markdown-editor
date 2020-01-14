from app import create_app


# This file is the entry point for the app
# Creates the project's app and runs it

if __name__ == "__main__":
    app = create_app()
    app.run()
