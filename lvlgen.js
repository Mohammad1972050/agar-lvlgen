
// Made by Cr4xy
// https://www.youtube.com/channel/UC1CJCNc6rrtjJzxiqYN97aQ

var agarClient = require("agario-client")
	config = require("./config.js"),
	token = null,
	account = new agarClient.Account(),
	STATIC_NAME = config.name,
	debugObj = {},
	regions = config.regions,
	DefaultAi = new (require("./ai/default_ai.js")),
	AposAi = new (require("./ai/apos_ai.js"));

var VERSION = 0.92;

Array.prototype.contains = function(element) {
	return this.indexOf(element) >= 0;
}
Array.prototype.add = Array.prototype.push;
Array.prototype.remove = function(element) {
	if (this.contains(element)) this.splice(this.indexOf(element), 1);
}

// Check if no region is enabled
!function() {
	if (config.regions.length > 0) return;
	console.log("No region enabled or found. oh well");
	process.exit();
}();

// Check for updates
!function() {
	require("https").get('https://raw.githubusercontent.com/Cr4xy/agar-lvlgen/master/version', (res) => {
		res.on('data', function (bytes) {
			var fetched_version = bytes.toString();
			
			console.log("########################\n\nUpdate-Check\n\n");
			
			if (!isNaN(fetched_version) && isFinite(fetched_version)) {
				if (VERSION < fetched_version)
					console.log("An update (" + fetched_version + ") is available!\nPlease update the script at https://github.com/Cr4xy/agar-lvlgen");
				else
					console.log("No new version available.");
			} else {
				console.log("Unable to fetch new version.");
			}
			
			console.log("\n\n########################\n\n");
			
		});
		//res.resume();
	});
}();

var regionCounter = 0;
function getRegion() {
	regionCounter++;
	if (regionCounter >= regions.length) regionCounter = 0;
	return regions[regionCounter];
}

function getServerOptions() {
	return {region: getRegion()};
}

var accountIndex = 0;
function requestToken(c_user, datr, xs) {
	account.c_user = c_user || config.accounts[accountIndex].c_user;
	account.datr = datr || config.accounts[accountIndex].datr;
	account.xs = xs || config.accounts[accountIndex].xs;
	
	account.requestFBToken(function(token, info) {
		if (!token) {
			if (requestTries++ >= 5) {
				console.log("Got no token for account " + accountIndex + " multiple times, please check your cookies.");
				process.exit();
			}
			console.log("Got no token! Trying again... (Attempt " + requestTries + ")");
			requestToken();
		} else {
			console.log("Got token for account " + accountIndex + ":", token);
			agarClient.servers.getFFAServer(getServerOptions(), function(e) {
				var server = e.server;
				var key = e.key;
				start(server, key, token, account);
			});
			requestTries = 0;
		}
	});
}

// Get token & server, then start
var requestTries = 0;
!function getTokenAndServer() {
	requestToken();
	accountIndex++;
	if (accountIndex >= config.accounts.length) {
		accountIndex = 0;
		return;
	}
	getTokenAndServer();
}();

var clientIdCounter = 0;
var bots = [];

function start(server, key, token, acc) {
	var myClient = new agarClient("Client_" + clientIdCounter++);
	myClient.debug = 0;
	myClient.auth_token = token;
	var myBotObj = {spawned: false, client: myClient, account: acc};
	myClient.on('disconnect', function() {
		bots.remove(myBotObj);
		clearInterval(myClient.sendInterval);
		myClient = null;
	});
	myClient.on('packetError', function(packet, error, preventCrash) {
		preventCrash();
	});
	myClient.on('connected', function() {
		bots.add(myBotObj);
		myClient.spawn(STATIC_NAME);
		myClient.sendInterval = setInterval(function() {
			if (config.ai == "default") {				
				DefaultAi.update(myClient);
			} else {
				if (myClient.my_balls.length == 0) return;
				var myBalls = [];
				for (var i in myClient.my_balls) myClient.balls[myClient.my_balls[i]] && (myBalls.push(myClient.balls[myClient.my_balls[i]]));
				AposAi.setPlayer(myBalls);
				AposAi.setMemoryCells(myClient.balls);
				var destination = AposAi.mainLoop(myClient.balls);
				//console.log(destination);
				myClient.moveTo(destination[0], destination[1]);
			}
		}, 40);
	});
	myClient.on('myNewBall', function() {
		myBotObj.spawned = true;
	});
	myClient.on('lostMyBalls', function() {
		myBotObj.spawned = false;
		myClient.spawn(STATIC_NAME);
	});
	myClient.connect("ws://" + server, key);
}

setInterval(function() {
	for (var i = 0; i < bots.length; i++) {
		var acc = bots[i].account;
		if (Date.now() > acc.token_expire) {
			requestToken(acc.c_user, acc.datr, acc.xs)
			bots.remove(bots[i]);
		}
	}
}, 10000);

setInterval(function() {
	var totalScore = 0;
	var spawnedCount = 0;
	var highestScore = 0;
	for (var i = 0; i < bots.length; i++) bots[i].spawned && (spawnedCount++, totalScore += bots[i].client.score, highestScore = Math.max(highestScore, bots[i].client.score));
	var avgScore = parseInt((totalScore / Math.max(1, spawnedCount)).toFixed(0));
	debugObj.connected = bots.length;
	debugObj.spawned = spawnedCount;
	debugObj.totalScore = totalScore;
	debugObj.avgScore = avgScore;
	debugObj.highest = highestScore;
	console.log(debugObj);
}, config.statusDelay);