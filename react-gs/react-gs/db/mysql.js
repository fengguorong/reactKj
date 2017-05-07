var mysql=require("mysql");
var connection = mysql.createConnection({
    host     : 'sqld.duapp.com:4050',
    user     : 'e692507a31ed474eaa256d2c1b56eb24',
    password : '18a4940554e746c79b0dad42637bc86d',
    database : 'zogFhNEmMfAeifjwHOOO'
})
connection.connect();
module.exports=connection;