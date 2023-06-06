# encode = utf-8
import socket
import json
import os
import struct
import io
import sys


# Проверка, выполнялась ли задача ранее
def check_task_completed(task):
    filename = 'completed_tasks.json'
    if os.path.isfile(filename):
        with open(filename, 'r') as file:
            completed_tasks = json.load(file)
            return task in completed_tasks
    return False


# Функция выполнения задачи
def execute_task(task):
    # Redirect stdout to a StringIO object
    output = io.StringIO()
    sys.stdout = output
    print(task)
    try:
        # Execute the script code
        exec(task)
    except Exception as e:
        # Print the exception if an error occurs
        print(e)

    # Restore stdout and get the captured output
    sys.stdout = sys.__stdout__
    result = output.getvalue()
    output.close()

    return result


# Создание сокета клиента
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
host = 'localhost'
port = 12345

# Подключение к серверу
client_socket.connect((host, port))

# Отправка запроса 'get' серверу
client_socket.send('get1'.encode())

# Чтение длины задачи
task_length = int(struct.unpack('<I', client_socket.recv(4))[0])

# Чтение задачи
taskstr = client_socket.recv(task_length).decode()
task = json.loads(taskstr)
#print(task)
client_socket.close()

# Проверка выполнения задачи
if not check_task_completed(task):
    # Выполнение задачи
    result = execute_task(task["code"])

    # Создание сокета клиента
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    host = 'localhost'
    port = 12345

    # Подключение к серверу
    client_socket.connect((host, port))

    # Отправка запроса 'cal' серверу
    client_socket.send('call'.encode())

    # Отправка длины результата
    result_length = struct.pack('<I', len(result))
    client_socket.send(str(result_length).encode())

    # Отправка результата
    client_socket.send(result.encode())

    # Запись задачи в JSON файл с выполненными задачами
    filename = 'completed_tasks.json'
    if os.path.isfile(filename):
        with open(filename, 'r+') as file:
            completed_tasks = json.load(file)
            completed_tasks.append(task)
            file.seek(0)
            json.dump(completed_tasks, file)
            file.truncate()
    else:
        with open(filename, 'w') as file:
            completed_tasks = [task]
            json.dump(completed_tasks, file)

    print('Задача выполнена и результат отправлен серверу')
else:
    print('Задача была выполнена ранее.')

client_socket.close()
