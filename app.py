from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import json


app = Flask(__name__)
socketio = SocketIO(app)


@app.route("/")
def index():
    return render_template('index.html',)


def background_thread():
	for i in range(0,10):
		progress = float(i+1)/10
		socketio.emit('update', {'progress': progress})
		socketio.sleep(0.5)


@socketio.on('send_message')
def handle_source(json_data):
    socketio.start_background_task(target=background_thread)

if __name__ == "__main__":
    socketio.run(app, debug=True)
