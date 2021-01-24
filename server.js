const fs = require("fs");
const express = require("express");
const app = express();
var bodyParser = require('body-parser');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })
 



var request = require('urllib-sync').request;
var xpath = require('xpath');
var path = require('path');
var Dom = require('xmldom').DOMParser;
var offline = false;





function CheckImgExists(imgurl) {
     
    var s = imgurl.match(/http(s):\/\/.*?(gif|png|jpeg|svg|jpg)/gi);
 
    if(s==null) return false;
  else return true;
 
}


function resolv(url,p) {

    var response = '';
    var timeout = 10000;
    try { response = request(url, { timeout: timeout, dataType: 'xml' }); } 
    catch (err) { offline = true; }
    if (offline) {
        return { list: [], next: "" };
    }
    var doc = new Dom({ 
        errorHandler: {
            warning: function (e) {},
            error: function (e) {},
            fatalError: function (e) {}
        }
    }).parseFromString(response.data.toString());

    var items = xpath.select("//*[contains(@class, 'js-active-navigation-container')]/div", doc);
 

  
  
    var list=[];
    
    for (var i in items) {
         
        var parser = new Dom().parseFromString(items[i].toString());
        var jpgs = xpath.select1('string(//div/div[2]/span/a)', parser);
    
 
        if(CheckImgExists(p+jpgs)){
          list.push(p+jpgs);
        }

    }

    return list;
}




// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

app.get("/", (request, response) => {
  
  response.sendFile(__dirname + "/views/index.html");
});

app.post('/fuckqq', urlencodedParser, function (req, res) {
 
    var url = req.body.wechat;
    var arr = url.split("/");
    var flen = arr.length-7;
    var name = arr[3];
    var base = arr[4];
    var path = "";
    for(var i=0;i<flen;i++){
      path = arr[i+7]+"/";
    }
    var upath = "https://cdn.jsdelivr.net/gh/"+name+"/"+base+"/"+path;
    res.send(resolv(url,upath));
 
})

app.get('/s', function(req, res){
 
    var url = req.query.b;
    var arr = url.split("/");
    var flen = arr.length-7;
    var name = arr[3];
    var base = arr[4];
    var path = "";
    for(var i=0;i<flen;i++){
      path = arr[i+7]+"/";
    }
    var upath = "https://cdn.jsdelivr.net/gh/"+name+"/"+base+"/"+path;
    res.send(resolv(url,upath));

})




// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
