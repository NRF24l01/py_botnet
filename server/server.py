# encode = utf-8
import socket
import json
import os
import struct

# Чтение задачи из JSON файла
def read_task_from_json():
    # Ваш код чтения задачи из JSON файла
    task = {
        "id": 1,
        "name": "Testing",
        "code": "print(1234)",
        "path": "logs/"
    }
    return task

# Создание сокета сервера
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
host = 'localhost'
port = 12345
server_socket.bind((host, port))
server_socket.listen(1)

print('Сервер запущен и ожидает подключения клиента...')

while True:
    client_socket, address = server_socket.accept()
    print('Подключение установлено с клиентом:', address)

    # Чтение запроса от клиента
    request = client_socket.recv(4).decode()

    # Чтение задачи из JSON файла
    task = read_task_from_json()
    # Преобразование задачи в JSON формат
    task_json = json.dumps(task)
    #print(task)
    #print(request)
    if request == 'get1':
        # Отправка длины задачи
        task_length = struct.pack('<I', len(task_json))
        client_socket.send(task_length)

        # Отправка задачи
        client_socket.send(task_json.encode())

    elif request == 'call':
        # Чтение длины результата
        result_length = int(struct.unpack('<I', client_socket.recv(4))[0])

        # Чтение результата
        result = client_socket.recv(result_length).decode()

        # Запись ответа от клиента в файл
        client_ip = address[0]
        client_folder_path = task['path']
        log_file_path = os.path.join(client_folder_path, client_ip + '.txt')
        #print(log_file_path)
        with open(log_file_path, 'a') as file:
            file.write(result + '\n')

        print('Ответ от клиента сохранен в файл:', log_file_path)

    client_socket.close()
    print('Подключение с клиентом закрыто.')
