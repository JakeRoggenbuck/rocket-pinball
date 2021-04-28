from http.server import HTTPServer, BaseHTTPRequestHandler


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


httpd = Server(('localhost', 8080), RequestServer)
httpd.serve_forever()
