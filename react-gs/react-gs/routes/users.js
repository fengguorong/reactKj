var express = require('express');
var router = express.Router();
var upload=require("./fileuploads");
var unzip=require("unzip"); //导入用来解压的unzip包
var fs=require("fs");
var async=require("async");
var shell=require('shelljs/global'); //操作文件的包
var archiver = require("archiver");
var mysql=require("../db/mysql.js");
/* GET users listing. */
var compUrl=process.cwd()+"/comp";
var catname,url,zurl,pid,name;

router.get('/',function(req, res, next) {
    res.render("admin");
});
router.get('/add', function(req, res, next) {
  res.render("upant");
});
router.post('/upload', upload.single('file'), function (req, res, next) {
  if (req.file) {
      async.series([
          function (cb){
              var upzipurl=process.cwd()+"/comp";
              fs.createReadStream(req.file.path).pipe(unzip.Extract({path:upzipurl}));
              setTimeout(function () {
                  cb();
              },2000)
          },
          function(cb){
              var filename1=req.file.originalname.slice(0,req.file.originalname.lastIndexOf("."));
              var packageUrl=process.cwd()+"/comp/"+filename1+"/package.json";
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
                  url="/comp/"+catname+"/"+name+"/layout/"+explain;
                  zurl="/comp/"+catname+"/"+name+"/code.zip";

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
          function(cb){
              mysql.query(`select id from ant where catname='${catname}'`,function(error,rows){
                  if(error){
                    console.log("error");
                  }else {
                      /*有类别*/
                      if(rows.length>0){
                          pid=rows[0].id;
                          cb();
                      }else{
                          /*没有类别*/
                          mysql.query(`insert into ant (catname,url,zurl,pid) values ('${catname}','${url}','${zurl}',0)`,function(error,info){
                              if(error){
                                  console.log("error");
                              }else{
                                  pid=info.insertId;
                                  cb();
                              }
                          })
                      }
                  }
              })
          },
          function(cb){
              mysql.query(`select id from ant where catname='${name}'`,function(error,rows){
                  if(error){
                      console.log(error);
                  }else{
                      if(rows.length>0){
                          cb();
                      }else{
                          mysql.query(`insert into ant (catname,url,zurl,pid) values ('${name}','${url}','${zurl}','${pid}')`,function(error,rows){
                              if(error){
                                  console.log(error)
                              }else{
                                  cb();
                              }
                          })
                      }
                  }
              })
          }
      ],function(){
          console.log("完毕");
      })
      res.send('文件上传成功');
      //console.log(req.file);
      //console.log(req.body);
  }
});
router.get('/adminant', function(req, res, next) {
    res.render("showadminant");
});
router.get('/adminantajax', function(req, res, next) {
    var arr=[];
    mysql.query("select * from ant",function(error,rows){
        if(error){
            console.log("error");
        }else{
            res.send(JSON.stringify(rows));
        }
    })
});
router.get('/indexnat', function(req, res, next) {
    res.render("indexnat");
});
router.get('/indexantajax', function(req, res, next) {
    var arr=[];
    mysql.query("select * from kfz",function(error,rows){
        if(error){
            console.log("error");
        }else{
            res.send(JSON.stringify(rows));
        }
    })
});
router.get('/user', function(req, res, next) {
    res.render("showuser");
});
router.get('/userajax', function(req, res, next) {
    var arr=[];
    mysql.query("select * from user",function(error,rows){
        if(error){
            console.log("error");
        }else{
            res.send(JSON.stringify(rows));
        }
    })
});
router.get('/hebing/:id', function(req, res, next) {
    var id=req.params.id;
    mysql.query("select * from kfz where id="+id,function(error,rows){
        if(error){
            console.log("error");
        }else {
            var catname=rows[0].catname;
            var url=rows[0].url;
            var zurl=rows[0].zurl;
            var pid=8;
            mysql.query(`insert into ant (catname,url,zurl,pid) values ('${catname}','${url}','${zurl}','${pid}')`,function(error){
                if(error){
                    console.log("error");
                }else{
                    res.redirect("/ms/hbsuccess");
                }
            })
        }
    })
});

router.get('/me',function(req, res, next) {
    delete req.session.login;
    delete req.session.username;
    res.redirect("/users");
});
module.exports = router;