function DefaultAi() {}

DefaultAi.prototype.update = function(myClient) {
	function getDistance(cell1, cell2) {
		return Math.sqrt(Math.pow(cell1.x - cell2.x, 2) + Math.pow(cell2.y - cell1.y, 2));
	}
	var player = myClient.balls[myClient.my_balls[0]];
	if (!player) return;
	var nearest = null, nearestDist = 1000;
	for (var id in myClient.balls) {
		if (myClient.my_balls.indexOf(id) != -1) continue;            // Skip own cell
		var cell = myClient.balls[id];
		if (cell.virus) continue;                                     // Skip virus
		if (cell.size * 1.25 > player.size) continue;                 // Skip bigger cells
		
		var dist = getDistance(cell, player);
		if (nearest && nearestDist < dist) continue;                  // Skip cells far away
		if (nearest && nearest.size > 20 && cell.size < 20) continue; // Skip food when found a player or ejected mass
		
		if (cell.size > 20 && cell.size * 4 < player.size) continue;  // Skip players smaller than a 4th or something
		
		nearest = cell;
		nearestDist = dist;
	}
	if (!nearest) return;

	myClient.moveTo(nearest.x, nearest.y);
}
module.exports = DefaultAi;