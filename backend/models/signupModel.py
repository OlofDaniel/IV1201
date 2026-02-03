from integration.integration import add_person


class DatabaseException(Exception):
    def init(self, msg):
        self.msg = msg


def signup(person_information):
    try:
        add_person(person_information)
    except ValueError as e:
        error_data = e.args[0] if e.args else {}

        if error_data.get("code") == "23505":
            details = error_data.get("details", "").lower()

            if "pnr" in details:
                raise ValueError(
                    "Could not signup, person number not unique in database"
                )
            elif "email" in details:
                raise ValueError("Could not signup, email not unique in database")
            elif "username" in details:
                raise ValueError("Could not signup, username not unique in database")

        else:
            raise DatabaseException("Error occured when communicating with database")
