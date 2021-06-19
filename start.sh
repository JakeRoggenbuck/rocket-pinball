# Start score api
uvicorn app:APP --reload --port 8081 &

# Start page loader
python3 app.py
