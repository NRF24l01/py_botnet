//encode = URF-8

var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    mode: "python",
    theme: getSavedTheme() || "default",
    lineNumbers: true,
    placeholder: "������� ��� ��� �����...",
    autoRefresh: true
});

// ���������� ���� ��� ���������
function changeTheme() {
    var theme = document.getElementById("theme").value;
    document.body.className = theme;
    editor.setOption("theme", theme);
    editor.refresh();
    saveTheme(theme);
}

// ��������� ����������� ���� �� Local Storage
function getSavedTheme() {
    return localStorage.getItem("selectedTheme");
}

// ���������� ��������� ���� � Local Storage
function saveTheme(theme) {
    localStorage.setItem("selectedTheme", theme);
}

// ���������� ������� ������ ��� ���������
function changeFontSize() {
    var fontSize = document.getElementById("fontSize").value;
    document.querySelector(".CodeMirror").style.fontSize = fontSize + "px";
    saveFontSize(fontSize);
}

// ��������� ������������ ������� ������ �� Local Storage
function getSavedFontSize() {
    return localStorage.getItem("selectedFontSize");
}

// ���������� ���������� ������� ������ � Local Storage
function saveFontSize(fontSize) {
    localStorage.setItem("selectedFontSize", fontSize);
}

// �������� ����������� �������� ���� � ������� ������ ��� �������� ��������
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

// ������� ��� �������� ������ ����� API � ���������� �������� � ���������� JSON
function sendTask() {
    var code = editor.getValue();

    $.ajax({
        url: "api/post/send_task",
        type: "POST",
        data: {code: code},
        dataType: "json",
        success: function (response) {
            // ��������� ��������� ������
            console.log(response);
            updateTables(response); // ���������� ������ � ����������� �������� � �������� ���������
        },
        error: function (error) {
            // ��������� ������
            console.log(error);
        }
    });
}

// ������� ��� ���������� ������ � ����������� �������� � �������� ���������
function updateTables(data) {
    // ������� ������
    $("#previousTasksTable tbody").empty();
    $("#deviceAnswersTable tbody").empty();

    // ���������� ������ ������ �������
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

// ����� ������� �������� ������ ��� ������� �� ������
$(document).on("click", "button[type=submit]", function (e) {
    e.preventDefault();
    sendTask();
});

// ������� ��� ���������� ������ � ��������
function refreshData() {
    $.ajax({
        url: "/api/get/get_data", // URL ��� ��������� ����������� ������
        type: "GET",
        dataType: "json",
        success: function (response) {
            //console.log(response)
            updateTables(response); // ���������� ������ � ����������� �������
        },
        error: function (error) {
            console.log(error); // ��������� ������
        }
    });


}