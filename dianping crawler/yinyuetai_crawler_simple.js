var http = require('http');
var Promise = require('bluebird');
var cheerio = require('cheerio');

//var baseUrl = "http://t.dianping.com/list/tianjin-category_1?pageIndex="; 
var baseUrl = "http://vchart.yinyuetai.com/vchart/trends?area=";
var type = ['ML', 'HT', 'US', 'KR', 'JP'];
//var type = ['ML'];

function filterPageContent(html){
	var $ = cheerio.load(html);
	var title = $(".search-area a.J_cur").text();

	var chartData = {
		title: title,
		mvs: [],
	}

	var rankList = $("li[name='dmvLi']");

	rankList.each(function(item){
		var ele = $(this);
		var mv = {};
		mv.order = ele.find(".top_num").text();
		mv.name = ele.find("h3 a").text();
		mv.singer = ele.find("p.cc .special").text();
		mv.release_time = ele.find(".c9").text();
		mv.point = ele.find(".score_box h3").text();
		chartData.mvs.push(mv);
	});


	return chartData;


	/*chartData = {
		title: title,
		// mvs: [{
		// 	order: '',
		// 	name: '',
		// 	singer: '',
		// 	release_time: '',
		// 	point: '',
		// }]
	}*/

}

function printChart(charts){
	charts.forEach( function(chart) {
		console.log(chart.title);
		chart.mvs.forEach( function(mv) {
			console.log('第'+mv.order+'名'+', '+mv.name+', 歌手'+mv.singer+', '+mv.release_time+', 当前分数'+mv.point);
		});
		console.log("========================================================================");
	});
}

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

// function showData(charts){
// 	var div = document.getElementById("#charts");
// 	charts.forEach( function(chart) {
// 		var title = document.createElement("h4");
// 		title.innerHTML = chart.title;
// 		div.appendChild(title);
// 		chart.mvs.forEach( function(mv) {
// 			var p = document.createElement("p");
// 			p.innerHTML = '第'+mv.order+'名'+', '+mv.name+', 歌手'+mv.singer+', '+mv.release_time+', 当前分数'+mv.point;
// 			div.appendChild(p);
// 		});
// 		var hr = document.createElement("hr");
// 		div.appendChild(hr);
// 	});
// }


var fetchPageArray = [];//Promise对象数组

type.forEach( function(element) {
	fetchPageArray.push(getPage(baseUrl + element));
});

var resultArray = [];

Promise.all(fetchPageArray)
	   .then(function(pages){
	   	  pages.forEach(function(html) {
	   	  	 resultArray.push(filterPageContent(html));
	   	  });
	   	  printChart(resultArray);
	   });

