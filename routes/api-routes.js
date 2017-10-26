require('mongoose');
var axios = require('axios');
var db = require('../models');
var cheerio = require('cheerio');

module.exports = function(app) {
	app.get('/scrape', function (req, res){
		axios.get("https://arstechnica.com/")
			.then(
				function(response){
					var $ = cheerio.load(response.data);

					$("article header").each(function(i ,element) {
						db.Article.create({
							title: $(element).children('h2').children('a').text(),
							snip: $(element).children('p.excerpt').text(),
							link:  $(element).children('h2').children('a').attr('href')
							// thumb:  $(element).children('h2').children('a').text(),
						}).then(
							function(dbArticle){
								res.json(dbArticle);
								// res.send("Scrape Complete");
						});
					});
				}	
			);
	});

	app.get("/articles", function(req, res){
		db.Article
			.find({})
			.then(function(result){
				res.json(result);
			})
			.catch(function(err){
				res.json(err);
			});
	})

	app.get("/comments/:article", function(req, res){
		db.Article
			.find({_id: req.params.article})
			.populate('comments')
			.then(function(result){
				res.json(result);
			})
	})

	app.get("/saved", function(req, res){
		db.User.findOne({})
			.populate('savedArticles')
			.then(function(dbUser){
				res.json(dbUser);
			});
	});

	app.get("/articles/:id", function(req, res){
		db.Article
			.findOne({_id: req.params.id})
			.populate("comments")
			.then(function(result){
				res.json(result);
			}).catch(function(err){
				res.json(err);
			});
	});

	app.post("/save/:id", function(req, res){
		db.User.findOneAndUpdate({}, {$push: {savedArticles: req.params.id}}, {new: true})
			.then(function(dbUser){
				db.Article.findOneAndUpdate({_id: req.params.id}, {saved: true}, {new: true})
				.then(function(res){
					res.json(res);
				});
				res.json(dbUser);
			})
			.catch(function(err){
				res.json(err);
			});
	});

	app.post("/remove/:sArticle", function(req, res){
		db.User.findOneAndUpdate({}, {$pull: {savedArticles: req.params.sArticle}}, {new: true})
			.then(function(result){
				db.Article.findOneAndUpdate({_id: req.params.sArticle}, {saved: false}, {new: true})
				.then(function(res){
					res.json(res);
				});
				res.json(result);
			});
	});

	app.post('/remove/:comment/:article', function(req, res){
		db.Article.findOneAndUpdate({_id: req.params.article}, {$pull: {comments: req.params.comment}}, {new: true})
			.then(function(result){
				db.Comment.remove({_id: req.params.comment})
				.then(function(result){
					res.json(result);
				});
			});
	});
	// app.post("/remove/:target/:parent", function(req, res){
	// 	if (req.params.parent){
	// 		db.User.findOneAndUpdate({}, {$pull: {savedArticles: req.params.target}},{new: true})
	// 		.then(function(result){
	// 			res.json(result);
	// 		});
	// 	} else {
	// 		db.Article.findOneAndUpdate({_id: req.params.parent}, {$pull: {comments: req.params.target}},{new: true})
	// 		.then(function(){
	// 			return db.Comment.remove({_id: req.params.target}, function(err){
	// 				console.log("comment removal");
	// 				if (err) console.log(err);
	// 			})
	// 		}).then(function (result){
	// 			res.json(result);
	// 		})		
	// 	}
	// });

	app.post("/articles/:id", function (req, res){
		db.Comment
			.create(req.body)
			.then(function(result){
				console.log(result._id);
				return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comments: result._id}}, {new: true});
			})
			.then(function(dbComment){
				res.json(dbComment);
			})
			.catch(function(err){
				res.json(err);
			});
	});
}