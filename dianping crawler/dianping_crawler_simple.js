var http = require('http');
var Promise = require('bluebird');
var cheerio = require('cheerio');

var baseUrl = "http://t.dianping.com/list/tianjin-category_1?pageIndex=";

var maxPageNum = 5;


function getPage (url) {
	return new Promise(function(resolve, reject){
		console.log("正在抓取 " + url);

		http.get(url, function(res){
            var html = '';

            res.on('data', function(data){
            	html += data;
            });

            res.on('end', function(){
            	resolve(html);
            });
		}).on('error', function(e){
            reject(e);
            console.log('获取信息出错');
		})
	});
}


var fetchPageArray = [];//Promise对象数组

for(var i = 0; i < maxPageNum; i++){
	fetchPageArray.push(getPage(baseUrl + i));
}

Promise.all(fetchPageArray)
	   .then(function(pages){
	   	  pages.forEach(function(html) {
	   	  	console.log(html);
	   	  	console.log("====================");
	   	  });
	   });