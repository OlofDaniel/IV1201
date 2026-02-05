class DatabaseException(Exception):
    """Custom exception used when a database access fails, raised either when cause is unknown or irrelevant to higher layers"""

    def init(self):
        self.msg = "Error occured when accessing the database"
