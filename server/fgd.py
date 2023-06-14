# -*- coding: utf-8 -*-

from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def index():
    # Пример данных для передачи в шаблон
    previous_tasks = [
        {'id': 1, 'name': 'Задача 1', 'code': 'print("Hello, World!")'},
        {'id': 2, 'name': 'Задача 2', 'code': 'for i in range(5):\n    print(i)'}
    ]

    device_answers = [
        {'id': 1, 'name': 'Устройство 1', 'answ': 'Ответ 1'},
        {'id': 2, 'name': 'Устройство 2', 'answ': 'Ответ 2'}
    ]

    return render_template('ind.html', previous_tasks=previous_tasks, device_answers=device_answers)


if __name__ == '__main__':
    app.run()
