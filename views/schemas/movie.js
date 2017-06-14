var mongoose=require("mongoose");

var movieSchema = new mongoose.Schema({
	title:String,
	imgsrc:String,
	id:String,
	author:String,
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
});

movieSchema.pre("save",function (next) {
	if(this.isNew){
		this.meta.updateAt =this.meta.createAt=Date.now();
	}
	else{
		this.meta.updateAt=Date.now();
	}
	next();
});

movieSchema.statics={
	fetch:function (cb) {
		return this
				.find({})
				.sort("meta.updateAt")
				.exec(cb)
	},
	findById:function (id,cb) {
		return this
				.findOne({_id:id})
				.exec(cb)
	}
}

module.exports=movieSchema;