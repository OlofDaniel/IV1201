class DatabaseException(Exception):
    """Custom exception used when a database access fails, raised either when cause is unknown or irrelevant to higher layers"""

    def init(self):
        self.msg = "Error occured when accessing the database"


class ValidationError(ValueError):
    def __init__(self, message, details: dict):
        super().__init__(message)
        self.details = details

class InvalidTokenError(Exception):
    def __init__(self, message):
        super().__init__(message)

