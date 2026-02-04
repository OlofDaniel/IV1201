class DatabaseException(Exception):
    def init(self):
        self.msg = "Error occured when accessing the database"
