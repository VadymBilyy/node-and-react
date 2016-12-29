/*
 *	ЗАДАНИЕ 4 Создание клиента

		1. В текстовом редакторе создайте файл 'chat\public\chat.js'
		2. В этом файле опишите событие 'window.onload', в котором:
			- создайте сокетное соединение к адресу 'http://localhost:8080'
			- создайте массив 'messages' для хранения сообщений приходящих с сервера
			- создайте для сокета обработчик метода 'on', который обрабатывает серверное сообщение 'message'
			- создайте обработчик события 'onclick' для html-элемента 'input' c 'id="submit"' (кнопка)
		3. Обработчик кнопки должен: 
			- выбрать введённые пользователем данные из текстового поля
			- послать выбранные данные на сервер в сообщении под именем 'send'	
		4. Обработчик сокета должен:
			- принять сообщение сервера и сохранить его в массиве 'messages'
			- вывести содержимое массива 'messages' в html-элемент 'div'
		5. Сохраните файл 'chat.js'
*/
var socket;

window.onunload = function(){
	socket.disconnect();
};

window.onload = function(){
	socket = io.connect("http://localhost:8080");
	var field = document.getElementById("field");
	var form = document.getElementById("form");
	var content = document.getElementById("content");
	var input = document.getElementById("send");

	var name = prompt("What is your name?", "Guest");
	if (name){
		socket.emit("hello", {name:name});
	};

	form.onsubmit = function(){};
	input.onclick = function(){
		var text = field.value;
		socket.emit("send", {message:text});
		return false;
	}
	var messages = [];

	socket.on("message", function(data){
		if (data.message) {
			messages.push(data.message);
			var html = "";
			for (var i = 0; i < messages.length; i++){
				html += messages[i] + "<br/>"
			}
			content.innerHTML = html;
		}else{
			console.log("Something wrong with recieved message")
		}
	})
}