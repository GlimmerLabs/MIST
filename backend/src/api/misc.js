
// +----------------+--------------------------------------------------
// | Challenges     |
// +----------------+

/*
 *   Load challenges to the page
 *   info.action: getChallenges
 */

handlers.getChallenges = function (info, req, res) {
	// grab URL parameters
	let search =
		req.query.level + ", " + req.query.color + ", " + req.query.animation;

	database.getChallenges(search, (challenges, error) => {
		if (error) {
			console.log(error);
			res.json([]);
		} else if (!challenges) res.json([]);
		else res.json(challenges);
	});
};

