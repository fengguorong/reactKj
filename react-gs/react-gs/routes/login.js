var express = require('express');
var router = express.Router();
var mysql=require("../db/mysql.js");
router.get('/', function(req, res, next) {
    res.render('login');
});
router.use('/loginCheck', function(req, res, next) {
    var password=req.body.password;
    var username=req.body.username;
    console.log(password);
    console.log(username);
    var flag=true;
    mysql.query("select * from admin",function(error,rows){
        var result=rows[0];
        if(result.admin==username){
            if(result.pass==password){
                flag=false;
                req.session.login="yes";
                req.session.username=username;
                res.send("yes");
                //res.redirect("/users");
            }
        }
        if(flag){
            res.redirect("/login");
        }
    })
});
module.exports = router;