/*
** node_helper module for MMM-Dorba-Trails
*/

var bent = require('bent');
var NodeHelper = require("node_helper");

//for parsing the returned HTML
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


module.exports = NodeHelper.create({

	start: function () {
		console.log("Starting node helper: " + this.name);

	},

	socketNotificationReceived: async function (notification, payload) {
		var self = this;
		console.log("TRAILS: Notification: " + notification + " Payload: " + payload);

		if (notification === "GET_TRAIL_STATUS") {
			var dorbaTrailsUrl = payload.config.url.replace("{regionId}", payload.config.regionID);

			var jsonData = { trails: [], error: "" };
			
			console.log("TRAILS: get Bent");

			const CORS_PROXY_API = "https://thingproxy.freeboard.io/fetch/";
			//const url = `${CORS_PROXY_API}${dorbaTrailsUrl}`;
			const url = dorbaTrailsUrl;
			const request = bent("string", "GET", {
				//"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.63",
				'User-Agent': 'Node/12.14.1',
				// "accept-encoding": "gzip, deflate, br",
				// "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
				// "upgrade-insecure-requests": "1",
				// "dnt": '1',
				// "accept-language": "en-US,en;q=0.9",
				// "Connection": "close",
				// "X-Forwarded-Proto": "https",
				// "cache-control": "max-age=0",
				// "sec-ch-ua": '"Chromium";v="110", "Not A(Brand";v="24", "Google Chrome";v="110"',
				// "sec-ch-ua-mobile": "?0",
				// "sec-ch-ua-platform": "Windows",
				// "sec-fetch-dest": "document",
				// "sec-fetch-mode": "navigate",
				// "sec-fetch-site": "none",
				// "sec-fetch-user": "?1",
			});
			try {
				console.log("TRAILS: fetching " + url);
				var body = await request(url);
				//console.log("TRAILS: got body " + body);
			
				var dom = new JSDOM(body);
				var rows = dom.window.document.querySelectorAll("tbody tr");
				rows.forEach(r => {
					var cols = r.cells;
					var name = r.cells[1].children[0].innerHTML;
					//var url = r.cells[1].children[1].innerHTML;
					var statusOpen;
					//console.log ("TRAILS: row:" + r.cells[2].innerHTML);
					if (r.cells[2].innerHTML.includes("sgreen")){
						statusOpen = '<i class="fas fa-check-circle"></i>';
					}else if(r.cells[2].innerHTML.includes("sred")){
						statusOpen = '<i class="far fa-times-circle"></i>';
					}else {
						statusOpen = '<i class="fa fa-exclamation-circle"></i>';
					}
					var lastCheck = "";
					if(r.cells[3].querySelectorAll("div div")[0]){
						lastCheck = r.cells[3].querySelectorAll("div div")[0].innerHTML;
					}
					var condition = ""
					if(r.cells[4].querySelectorAll("span")[1]){
						condition = r.cells[4].querySelectorAll("span")[1].innerHTML;
					}
					
					for(i = 0; i < payload.config.trails.length; i++){
						if(r.cells[1].innerHTML.includes(payload.config.trails[i])){
							jsonData.trails.push({
								name: name,
								statusOpen: statusOpen,
								lastCheck: lastCheck,
								condition: condition
							});
							console.log("TRAILS: status:" + statusOpen);
							break;
						}
					}
				});

				console.log("TRAILS: send status");
				self.sendSocketNotification("TRAIL_STATUS", jsonData);
			} 
			catch(error) {
				console.log("TRAILS: error " + error);
				jsonData.error = error.toString();
				self.sendSocketNotification("TRAIL_STATUS", jsonData);
			}
		}
	},
});
