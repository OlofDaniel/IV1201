from models.signupModel import signup


def signup_controller(person_information):
    try:
        signup(person_information)
    except ValueError:
        raise
