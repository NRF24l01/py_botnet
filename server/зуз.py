# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


# Главная страница
@app.route('/')
def index():
    # Пример данных для таблицы предыдущих задач
    previous_tasks = [
        {'id': 1, 'name': 'Task 1', 'code': 'print("Hello, World!")'},
        {'id': 2, 'name': 'Task 2', 'code': 'x = 5\nprint(x * 2)'}
    ]

    # Пример данных для таблицы ответов устройств
    device_answers = [
        {'id': 1, 'name': 'Device 1', 'answ': '42'},
        {'id': 2, 'name': 'Device 2', 'answ': 'OK'}
    ]

    return render_template('ind.html', previous_tasks=previous_tasks, device_answers=device_answers)


# Обработка POST-запроса для отправки задачи
@app.route('/api/get/get_data', methods=['GET'])
def get_task():
    # Выполнение обработки задачи и получение результатов
    # ...

    # Возврат JSON-ответа с предыдущими задачами и ответами устройств
    response = {
        'previous_tasks': [
            {'id': 1, 'name': 'Task 1', 'code': 'print ("Hello, World!")'},
            {'id': 2, 'name': 'Task 2', 'code': '''x = 5
            print(x * 2)'''}
        ],
        'device_answers': [
            {'id': 1, 'name': 'Device 1', 'answ': '42'},
            {'id': 2, 'name': 'Device 2', 'answ': 'OKAY'}
        ]
    }

    return jsonify(response)


if __name__ == '__main__':
    app.run()