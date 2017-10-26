module.exports = function(app){
	app.get("/",function(req,res){
		var homeScripts = [{script: './assets/js/app.js'}];
	  res.render('home', {scripts: homeScripts});
	});
}