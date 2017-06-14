var express=require('express');
var path=require('path');
var bodyParser = require('body-parser');
var mongoose=require("mongoose");
var movie=require("./views/models/movie");
var port=process.env.PORT || 8080;
var _=require('underscore');
var app=express();

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/imooc");

app.set("views","./views/pages");
app.set("view engine","pug");
//_id 是mongodb的默认主键。
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "/views")));
app.locals.moment = require('moment');

app.listen(port);
console.log("web started on:"+port);

//todo 运行mongodb ：brew services start mongodb
//mongo
//use imooc
//查询条数 db.movies.find({}).count()
///删除数据 db.movies.remove()



app.get("/",function (req,res) {
	movie.fetch(function (err,movies) {
		if(err){
			console.log(err);
		}
		res.render('index',{
			title:"首页",
			movies:movies
		});
	});
	
});

app.get("/admin/list",function (req,res) {
	movie.fetch(function (err,movies) {
		if(err){
			console.log(err);
		}
		res.render('adminlist',{
			title:"后台管理列表页",
			movies:movies
		});
	});
});
app.get("/detail/:id",function (req,res) {
	var id=req.params.id;
	movie.findById(id,function (err,movie) {
		if(err){
			console.log(err);
		}
		res.render('detail',{
			title:"详情页__"+ movie.title,
			movie:movie
		});
	});
});
app.get("/edit/:id",function (req,res) {
	var id=req.params.id;
	movie.findById(id,function (err,movie) {
		if(err){
			console.log(err);
		}
		res.render('admin',{
			title:"后台更新页__"+ movie.title,
			movie:movie
		});
	});
});
app.post('/tijiao',function (req,res) {
    var id= req.body.movie._id;
    var movieObject=req.body.movie;
    var _movie;
    if(id!=undefined && id!=""){
        movie.findById(id,function (err,movie) {
            if(err){
                console.log(err)
            }
            _movie = _.extend(movie,movieObject);
            _movie.save(function (err,movie) {
                if(err){
                    console.log(err)
                }
                res.redirect('/detail/'+ movie._id);
            })
        });
    }
    else{
        _movie = new movie({
            title:movieObject.title,
            author:movieObject.author
        });
        _movie.save(function (err,movie) {
            if(err){
                console.log(err)
            }
            res.redirect('/detail/'+ movie._id);
        })
    }

});

app.get("/admin",function (req,res) {
	res.render('admin',{
		title:"后台管理",
		movie:{
			author:'',
			title:''
		}
	});
});
app.delete('/del',function(req,res) {
	var id = req.query.id;
	if(id) {
		movie.remove({_id: id},function(err,movie) {
			if(err){
				console.log(err);
			}
			else{
				res.json({success: 1});
			}
		})
	}
})