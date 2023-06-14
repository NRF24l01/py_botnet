//encode = URF-8

var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    mode: "python",
    theme: getSavedTheme() || "default",
    lineNumbers: true,
    placeholder: "Введите ваш код здесь...",
    autoRefresh: true
});

// Сохранение темы при изменении
function changeTheme() {
    var theme = document.getElementById("theme").value;
    document.body.className = theme;
    editor.setOption("theme", theme);
    editor.refresh();
    saveTheme(theme);
}

// Получение сохраненной темы из Local Storage
function getSavedTheme() {
    return localStorage.getItem("selectedTheme");
}

// Сохранение выбранной темы в Local Storage
function saveTheme(theme) {
    localStorage.setItem("selectedTheme", theme);
}

// Сохранение размера шрифта при изменении
function changeFontSize() {
    var fontSize = document.getElementById("fontSize").value;
    document.querySelector(".CodeMirror").style.fontSize = fontSize + "px";
    saveFontSize(fontSize);
}

// Получение сохраненного размера шрифта из Local Storage
function getSavedFontSize() {
    return localStorage.getItem("selectedFontSize");
}

// Сохранение выбранного размера шрифта в Local Storage
function saveFontSize(fontSize) {
    localStorage.setItem("selectedFontSize", fontSize);
}

// Загрузка сохраненных значений темы и размера шрифта при загрузке страницы
$(document).ready(function () {
    var savedTheme = getSavedTheme();
    if (savedTheme) {
        document.getElementById("theme").value = savedTheme;
        changeTheme();
    }

    var savedFontSize = getSavedFontSize();
    if (savedFontSize) {
        document.getElementById("fontSize").value = savedFontSize;
        changeFontSize();
    }
});

// Функция для отправки задачи через API и обновления страницы с получением JSON
function sendTask() {
    var code = editor.getValue();

    $.ajax({
        url: "api/post/send_task",
        type: "POST",
        data: {code: code},
        dataType: "json",
        success: function (response) {
            // Обработка успешного ответа
            console.log(response);
            updateTables(response); // Обновление таблиц с предыдущими задачами и ответами устройств
        },
        error: function (error) {
            // Обработка ошибки
            console.log(error);
        }
    });
}

// Функция для обновления таблиц с предыдущими задачами и ответами устройств
function updateTables(data) {
    // Очистка таблиц
    $("#previousTasksTable tbody").empty();
    $("#deviceAnswersTable tbody").empty();

    // Заполнение таблиц новыми данными
    for (var i = 0; i < data.previous_tasks.length; i++) {
        var task = data.previous_tasks[i];
        var taskRow = "<tr><td>" + task.id + "</td><td>" + task.name + "</td><td>" + task.code + "</td></tr>";
        $("#previousTasksTable tbody").append(taskRow);
    }

    for (var j = 0; j < data.device_answers.length; j++) {
        var device = data.device_answers[j];
        var deviceRow = "<tr><td>" + device.id + "</td><td>" + device.name + "</td><td>" + device.answ + "</td></tr>";
        $("#deviceAnswersTable tbody").append(deviceRow);
    }
}

// Вызов функции отправки задачи при нажатии на кнопку
$(document).on("click", "button[type=submit]", function (e) {
    e.preventDefault();
    sendTask();
});

// Функция для обновления данных в таблицах
function refreshData() {
    $.ajax({
        url: "/api/get/get_data", // URL для получения обновленных данных
        type: "GET",
        dataType: "json",
        success: function (response) {
            //console.log(response)
            updateTables(response); // Обновление таблиц с полученными данными
        },
        error: function (error) {
            console.log(error); // Обработка ошибки
        }
    });


}