class DatabaseException(Exception):
    """Custom exception used when a database access fails, raised either when cause is unknown or irrelevant to higher layers"""

    def init(self):
        self.msg = "Error occured when accessing the database"


class ValidationError(ValueError):
    def __init__(self, message, details: dict):
        super().__init__(message)
        self.details = details


class DomainException(Exception):
    def __init__(self, code: str, message: str):
        self.code = code
        self.message = message
        super().__init__(message)


class LinkExpiredError(DomainException):
    pass


class WeakPasswordError(DomainException):
    pass


class RateLimitError(DomainException):
    pass