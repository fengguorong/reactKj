var express = require('express');
var router = express.Router();
var mysql=require("../db/mysql.js");
var markdown = require( "markdown" ).markdown;
var fs=require("fs");
var path = require('path');
/* GET home page. */
var upload=require("./fileuploads1");
var unzip=require("unzip"); //导入用来解压的unzip包
var async=require("async");
var shell=require('shelljs/global'); //操作文件的包
var archiver = require("archiver");
var compUrl=process.cwd()+"/cnp";
var filename1="";
var catname,url,zurl,pid,name;

router.use(function(req,res,next){
    res.locals.userlogin=req.session.userlogin;
    res.locals.qusername=req.session.qusername;
    next();
});
router.get("/click",function(req,res,next){
    if(req.session.userlogin=="yes"){

    }else{
        res.send("yes");
    }
})
router.post('/upload', upload.single('file'), function (req, res, next) {
        if (req.file) {
            async.series([
                function (cb) {
                    var upzipurl = process.cwd() + "/cnp";
                    fs.createReadStream(req.file.path).pipe(unzip.Extract({path: upzipurl}));
                    setTimeout(function () {
                        cb();
                    }, 2000)
                },
                function(cb){
                    var filename1=req.file.originalname.slice(0,req.file.originalname.lastIndexOf("."));
                    var packageUrl=process.cwd()+"/cnp/"+filename1+"/package.json";
                    console.log(packageUrl);
                    var packageData=JSON.parse(fs.readFileSync(packageUrl).toString());
                    var category=packageData.category;
                    name=packageData.name;
                    var explain=packageData.explain;
                    if(category==""||name==""||explain==""){
                        res.redirect("/ms/shuru");
                        return;
                    }
                    catname=category;
                    url="/cnp/"+catname+"/"+name+"/layout/"+explain;
                    zurl="/cnp/"+catname+"/"+name+"/code.zip";

                    var destdir=compUrl+"/"+category+"/"+name;
                    mkdir('-p',destdir);
                    console.log(compUrl+"/code");
                    mv(compUrl+"/"+filename1+"/code",compUrl+"/"+filename1+"/layout",destdir);
                    rm('-rf',compUrl+"/package.json");
                    setTimeout(function () {
                        if(filename1){
                            rm('-rf',compUrl+"/"+filename1);
                        }
                    },2000);
                    var output = fs.createWriteStream(destdir+"/code.zip");//先写输出路径
                    var archive=archiver("zip"); //打包
                    archive.on('error',function(err){
                        throw err;
                    });
                    archive.pipe(output);
                    archive.glob(destdir+"/code/*.*");
                    archive.finalize();
                    cb();
                },
                /*处理数据库处理大类*/
                function (cb) {
                    mysql.query(`select id from kfz where catname='${catname}'`, function (error, rows) {
                        if (error) {
                            console.log("error");
                        } else {
                            /*有类别*/
                            if (rows.length > 0) {
                                pid = rows[0].id;
                                cb();
                            } else {
                                /*没有类别*/
                                mysql.query(`insert into kfz (catname,url,zurl,pid) values ('${catname}','${url}','${zurl}',0)`, function (error, info) {
                                    if (error) {
                                        console.log("error");
                                    } else {
                                        pid = info.insertId;
                                        cb();
                                    }
                                })
                            }
                        }
                    })
                },
                function (cb) {
                    mysql.query(`select id from kfz where catname='${name}'`, function (error, rows) {
                        if (error) {
                            console.log(error);
                        } else {
                            if (rows.length > 0) {
                                cb();
                            } else {
                                mysql.query(`insert into kfz (catname,url,zurl,pid) values ('${name}','${url}','${zurl}','${pid}')`, function (error, rows) {
                                    if (error) {
                                        console.log(error)
                                    } else {
                                        cb();
                                    }
                                })
                            }
                        }
                    })
                }
            ], function () {
                console.log("完毕");
            })
            res.send('文件上传成功');
            //console.log(req.file);
            //console.log(req.body);
        }
});


router.get('/', function(req, res, next){
  res.render('index');
});
router.get('/cnp/:cat/:com/layout/:file', function(req, res, next) {
    var caturl=req.params.cat;
    var comurl=req.params.com;
    var file=req.params.file;
    var url=process.cwd()+"/cnp/"+caturl+"/"+comurl+"/layout/"+file;
    if(path.extname(file)==".md"){
    var mdStr=fs.readFileSync(url).toString();
    var htmlStr=markdown.toHTML(mdStr)
    htmlStr=" <link rel='stylesheet' href='/css/github-markdown.css'><div class='markdown-body'>"+htmlStr+"</div>"
    res.send(htmlStr);
    }else if(path.extname(file)==".html"){
        res.render(url);
    }
});
router.get('/comp/:cat/:com/layout/:file', function(req, res, next) {
    var caturl=req.params.cat;
    var comurl=req.params.com;
    var file=req.params.file;
    var url=process.cwd()+"/comp/"+caturl+"/"+comurl+"/layout/"+file;
    if(path.extname(file)==".md"){
        var mdStr=fs.readFileSync(url).toString();
        var htmlStr=markdown.toHTML(mdStr)
        htmlStr=" <link rel='stylesheet' href='/css/github-markdown.css'><div class='markdown-body'>"+htmlStr+"</div>"
        res.send(htmlStr);
    }else if(path.extname(file)==".html"){
        res.render(url);
    }
});
router.get('/comp/:cat/:com/:zip', function(req, res, next) {
    if(req.session.userlogin=="yes"){
        var caturl=req.params.cat;
        var comurl=req.params.com;
        var zip=req.params.zip;
        var url=process.cwd()+"/comp/"+caturl+"/"+comurl+"/"+zip;
        res.sendFile(url);
    }else{
        res.redirect("/userlogin");
    }
});

router.get('/cnp/:cat/:com/:zip', function(req, res, next) {
    if(req.session.userlogin=="yes"){
        var caturl=req.params.cat;
        var comurl=req.params.com;
        var zip=req.params.zip;
        var url=process.cwd()+"/cnp/"+caturl+"/"+comurl+"/"+zip;
        res.sendFile(url);
    }else{
        res.redirect("/userlogin");
    }
});

router.get("/ajaxUrl",function(req,res){
    mysql.query("select * from ant",function(error,rows){
        if(error){
            console.log("error");
        }else{
            if(rows.length>0){
                var arr=[];
                for(var i=0;i<rows.length;i++){
                    if(rows[i].pid==0){
                        var obj={catname:rows[i].catname,id:rows[i].id};
                        arr.push(obj);
                    }
                }
                var result={};
                for(var i=0;i<arr.length;i++){
                    var newarr=[];
                    for(var j=0;j<rows.length;j++){
                        if(arr[i].id==rows[j].pid){
                            var obj={
                                catname:rows[j].catname,
                                url:rows[j].url,
                                zurl:rows[j].zurl
                            }
                            newarr.push(obj)
                        }
                    }
                    result[arr[i].catname]=newarr;
                }
                res.send(JSON.stringify(result));

            }else{
                res.send(JSON.stringify(['出错了']));
            }
        }
    })
})
router.get("/ajaxkfzUrl",function(req,res){
    mysql.query("select * from kfz",function(error,rows){
        if(error){
            console.log("error");
        }else{
            if(rows.length>0){
                var arr=[];
                for(var i=0;i<rows.length;i++){
                    if(rows[i].pid==0){
                        var obj={catname:rows[i].catname,id:rows[i].id};
                        arr.push(obj);
                    }
                }
                var result={};
                for(var i=0;i<arr.length;i++){
                    var newarr=[];
                    for(var j=0;j<rows.length;j++){
                        if(arr[i].id==rows[j].pid){
                            var obj={
                                catname:rows[j].catname,
                                url:rows[j].url,
                                zurl:rows[j].zurl
                            }
                            newarr.push(obj)
                        }
                    }
                    result[arr[i].catname]=newarr;
                }
                res.send(JSON.stringify(result));

            }else{
                res.send(JSON.stringify(['出错了']));
            }
        }
    })
})


router.get('/kaifa', function(req, res, next) {
    res.render('kaifa');
});

router.get('/shouye', function(req, res, next) {
    res.render('shouye');
});
router.get('/userlogin', function(req, res, next) {
    res.render('userlogin');
});
router.post('/userloginCheck',function(req, res, next) {
    var username=req.body.username;
    var password=req.body.password;
    if(username==""||password==""){
        res.redirect("ms/error");
    }else{
        mysql.query("select * from user",function (error,rows) {
            var flag=true;
            for(var i=0;i<rows.length;i++){
                if(rows[i].username==username){
                    if(rows[i].password==password){
                        flag=false;
                        req.session.userlogin="yes";
                        req.session.qusername=username;
                        res.send("ok");
;                        break;
                    }
                }
            }
            if(flag){
                res.redirect("/loginerror");
            }
        })
    }
});
router.use("/reg",function (req,res,next) {
    res.render("userreg");
});
router.use("/regCheck",function (req,res,next) {
        var username=req.body.username;
        var password1=req.body.password1;
        var password2=req.body.password2;
        if(username==""||password1==""||password2==""){
            res.redirect("/empty");
        }else{
            if(password1!=password2){
                res.redirect("/errorpass");
            }else{
                mysql.query("select * from user",function (error,rows) {
                    var flag=true;   //控制
                    for(var i=0;i<rows.length;i++){
                        if(rows[i].username==username){  //注册的用户名已存在
                            flag=false;
                            res.redirect("/error");
                            console.log("exit");
                            break;
                        }
                    }
                    if(flag){
                        mysql.query(`insert into user (username,password) values ('${username}','${password1}')`,function (error) {
                            if(error){
                                res.redirect("/mysqlerror");
                            }else{   //注册成功
                                res.redirect("/regSuccess");
                            }
                        });
                    }
                })
            }
    }
})
router.use("/logout",function (req,res,next) {
    delete req.session.userlogin;//清空登录
    delete req.session.qusername;//清空登录
    res.redirect("/");
})
module.exports = router;