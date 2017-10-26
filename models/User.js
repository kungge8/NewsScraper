var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema =  new Schema ({
	savedArticles: [{
		type: Schema.Types.ObjectId,
		ref: "Article",
		unique: true
	}]
});

var User = mongoose.model("User", UserSchema);

module.exports = User;