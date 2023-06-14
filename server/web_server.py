import random
from flask import Flask, render_template, request, redirect
import time

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/post/send_task', methods=['POST'])
def save():
    request_ = request
    code = request_.form['code']
    return redirect('/')

app.run(debug=True)