from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib
from fastapi import FastAPI

import os.path
import sqlite3


class Score:
    def __init__(self, sql_score):
        self.index, self.name, self.score = sql_score

    def __dict__(self):
        return {"name": self.name, "score": self.score}


class Database:
    def __init__(self):
        self.db_name = "scores.db"
        self.setup_db()
        self.connection = self.connect_db()

    def check_file(self):
        # Check for db
        return os.path.isfile(self.db_name)

    def setup_db(self):
        # If file doesn't exist make table
        if not self.check_file():
            self.connect_db()
            self.create_table()

    def connect_db(self):
        # Connect to database
        return sqlite3.connect(self.db_name)

    def create_table(self):
        sql_command = """
            CREATE TABLE scores (
            id INTEGER PRIMARY KEY,
            name VARCHAR(64),
            score INTEGER);"""
        self.write_db(sql_command)

    def write_db(self, command, *value):
        # Write raw command
        connection = self.connect_db()
        cursor = connection.cursor()
        cursor.execute(command, *value)
        connection.commit()

    def write_score(self, name, score):
        # Write data as message
        sql_command = """INSERT INTO scores
        (id, name, score)
        VALUES (NULL, ?, ?);"""
        self.write_db(sql_command, (name, score))

    def read_db(self, command, *value):
        # Read raw command
        connection = self.connect_db()
        cursor = connection.cursor()
        cursor.execute(command, *value)
        result = cursor.fetchall()
        return result

    def read_all(self):
        # Read all messages
        data = "SELECT * FROM scores"
        return self.read_db(data)


class RequestServer(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'

        try:
            file_to_open = open(self.path[1:]).read()
            self.send_response(200)
        except:
            file_to_open = "File not found"
            self.send_response(404)

        self.end_headers()
        self.wfile.write(bytes(file_to_open, 'utf-8'))


class Server(HTTPServer):
    def __init__(self, server_address, server):
        super().__init__(server_address, server)
        host, port = self.server_address
        print(f"Server hosted at http://{host}:{port}")


APP = FastAPI()
DB = Database()


def get_top_scores():
    scores = [Score(x) for x in DB.read_all()]
    return sorted(scores, key=lambda x: x.score, reverse=True)[0:20]


@APP.get("/")
def root():
    return "API"


@APP.get("/send")
def submit_score(name: str, score: int):
    print(score, name)
    if isinstance(name, str) and isinstance(score, int):
        DB.write_score(name, score)
        print(f"Writing score of {score} for {name}")


@APP.get("/scores")
def get_scores():
    return [x.__dict__() for x in get_top_scores()]


if __name__ == "__main__":
    httpd = Server(('localhost', 8080), RequestServer)
    httpd.serve_forever()
