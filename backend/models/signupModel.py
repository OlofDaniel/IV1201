import re

from integration.integration import add_person


def signup(person_information):
    try:
        add_person(person_information)
    except ValueError as e:
        match = re.search(r'_([^_]+)_key"', str(e))
        raise ValueError(
            "Could not signup, " + match.group(1) + " not unique in database"
        )
