var express = require('express');
var router = express.Router();
router.get("/hbsuccess",function(req,res,next){
    res.render("message",{title:"操作成功",con:"恭喜您合并成功",url:"/users/adminant"})
});
router.get("/error",function(req,res,next){
    res.render("message",{title:"操作失败",con:"用户名密码不能为空",url:"/login"});
});
router.get("/loginerror",function(req,res,next){
    res.render("message",{title:"登录失败",con:"用户名密码不正确",url:"/userlogin"});
});
router.get("/shuru",function(req,res,next){
    res.render("message",{title:"出入数据格式不正确",con:"请用正确的传输格式",url:"/user"});
});

module.exports = router;