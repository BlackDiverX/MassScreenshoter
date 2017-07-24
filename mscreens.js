// mscreens.js
// Version: 1.0
// License: Apache License Version 2.0
// Author: Georgii Starostin
// E-mail: blackdiverx@gmail.com
// Site: https://BlackDiver.net
var fs = require('fs');
var args = require('system').args;
var system = require('system');
var page = require('webpage').create()
//Вывод справки
if (system.args.length === 1 || args[1] === '-h' || args[1] === '--help') {
	console.log('Usage: mscreens.js <file with urls> [params]');
	console.log('Optional parameters:');
	console.log('full - full page ScreenShot');
	console.log('------');
	console.log('Example: phantomjs mscreens.js sites.txt full');
	phantom.exit();
}
//Символы перевода строки в зависимости от системы
eol = system.os.name == 'windows' ? "\r\n" : "\n";
//
var inputfile = args[1];
var dir = inputfile.split('.')[0]+'-'+Date.now();
//Чтение списка сайтов из файла и создание массива с ссылками
var content = fs.read(inputfile);
var siteslist = content.split(eol);
//Создание директории для скриншотов
fs.makeDirectory(dir);

//page.settings.resourceTimeout = 20000;
//page.settings.userAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36';
page.viewportSize = { width: 1366, height: 768 };
//Размер снимков экрана
if (args[2]!=='full') {
	page.clipRect = { top: 0, left: 0, width: 1366, height: 768 };
}
//Рекурсивная функция сохранения снимков экрана
var screenshot = function(i, max, siteslist) {
	//остановка при достижении конца массива
	if (i === max+1) {
		console.log('Complited');
		phantom.exit();
		return;
		}
	//Рекурсивное создание снимков экрана.
	page.open(siteslist[i], function(status) {
		if (status === "success") {
			console.log('Rendering: '+siteslist[i].split('/')[2]+' ('+(i+1)+' of '+(siteslist.length)+')');
			page.render(dir+'/'+siteslist[i].split('/')[2]+'.png');
			screenshot(i + 1, max, siteslist);
		}
		else {
			console.log('Error rendering: '+siteslist[i].split('/')[2]+' ('+status+')');
			screenshot(i + 1, max, siteslist);
		}
	});
};
//Вызов функции сохранения снимков экрана
screenshot(0, siteslist.length - 1, siteslist);
