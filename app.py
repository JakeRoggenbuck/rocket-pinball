from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib

import os.path
import sqlite3
import json


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
    db = Database()

    def do_GET(self):
        if self.headers.get("score"):
            self.send_response(200)
            scores = self.db.read_all()
            self.end_headers()
            self.wfile.write(bytes(json.dumps({"scores": scores}), "utf-8"))
            return 0

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

    def do_POST(self):
        length = self.headers['Content-Length']
        if length is not None:
            length = int(length)

        post_data = urllib.parse.parse_qs(self.rfile.read(length).decode('utf-8'))
        if (score := post_data.get("score")) and (name := post_data.get("name")):
            (score,) = score
            (name,) = name
            self.db.write_score(name, score)


class Server(HTTPServer):
    def __init__(self, server_address, server):
        super().__init__(server_address, server)
        host, port = self.server_address
        print(f"Server hosted at http://{host}:{port}")


if __name__ == "__main__":
    httpd = Server(('localhost', 8080), RequestServer)
    httpd.serve_forever()
