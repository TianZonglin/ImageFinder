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
    var url = request.query.b;
    if(url.indexOf("github.com")>0 && jugeUrl(url)){
      var arr = url.split("/");
      var flen = arr.length-7;
      var name = arr[3];
      var base = arr[4];
      var path = "";
      for(var i=0;i<flen;i++){
        path += arr[i+7]+"/";
      }
      var upath = "https://cdn.jsdelivr.net/gh/"+name+"/"+base+"/"+path;
      var list = resolv(url,upath);
      var html = "";   
          html += '<!DOCTYPE html>';
          html += '<html lang="en">';
          html += '  <head>';
          html += '    <meta charset="utf-8">';
          html += '    <meta http-equiv="X-UA-Compatible" content="IE=edge">';
          html += '    <meta name="viewport" content="width=device-width, initial-scale=1">';
          html += '    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>';
          html += '    <script src="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.js" ></script>';
          html += '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.css" />';
          html += '    <title>偷偷瞄！</title>';
          html += '    <link id="favicon" rel="icon" href="https://cdn.jsdelivr.net/gh/TianZonglin/tuchuang/img/fc.ico" type="image/x-icon">';
          html += '    <link rel="stylesheet" href="/style.css">';
          html += '    <script src="/script.js" defer></script>';
          html += '  </head>';
          html += '  <body>';
          html += '    <main>';
          html += '      <section class="pictures" id="pictures">';
          list.forEach(function(mac){
            html += `<a class="fancybox" rel="group" href="${mac}"><img class="img" src="${mac}"/></a>`; 
          }); 
          html += '      </section>';
          html += '    </main>';
          html += '    <footer><b><a style="color:#664c00" href="https://www.cz5h.com" target="_blank">@CZ5H.COM「2021」</a></b></footer>';
          html += '  </body>';
          html += '</html>';
      
        response.send(html);
      
    }else{
      response.sendFile(__dirname + "/views/index.html");
    }
});

app.post('/fuckqq', urlencodedParser, function (req, res) {
    
    var url = req.body.wechat;
    var arr = url.split("/");
    var flen = arr.length-7;
    var name = arr[3];
    var base = arr[4];
    var path = "";
    for(var i=0;i<flen;i++){
      path += arr[i+7]+"/";
    }
    
    var upath = "https://cdn.jsdelivr.net/gh/"+name+"/"+base+"/"+path;
    var list = resolv(url,upath);
    res.send(list);
    if(list.length){
      db.run("INSERT INTO CList (url,size,ctime,ex1,ex2) VALUES ('"+url+"','"+list.length+"','"+new Date().getTime()+"','"+name+"','"+"https://github.com/"+name+".png"+"')");
      
    }
  
    
 
})

app.get('/init', function(req, res){
 
    db.all("select ex1,ex2,size,url,ctime,count(url),max(ctime) from CList group by ex1;", (err, row) => {
      res.send(row);
    });  
  
    

})

function jugeUrl(zoom) {
    if (new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/).test(zoom) == true) return true;
    else return false;
} 
 
function reset() {
    $("#wechat").removeAttr("readonly");
    $('#spacex').removeAttr('disabled');
    $('#google').hide();
} 
function firethehall(wechat,o) {
    const i="https://github.com/";
    $("#pictures").html("");
    $("#wechat").attr("readonly","readonly");
    $('#spacex').attr('disabled','disabled');
    $('#google').show();
    if(wechat.indexOf(i.substr(8))>0 && jugeUrl(wechat)){
      $.ajax({
        type: "post",url: "/fuckqq",data: {"wechat":wechat},dataType: "json",
        success: function(facebook){
          var xiaomi = 0;
          facebook.forEach(function(mac){
            setTimeout(function() {  
              $("#pictures").append(`<a class="fancybox" rel="group" href="${mac}"><img class="img" src="${mac}"/></a>`); 
            }, (++xiaomi)*100);
            if(xiaomi != 0){reset(); }
          }); 
          const oppo = wechat.split("/")[3];
          if(JSON.stringify(o).indexOf(wechat)<0)
            $("#avat").append(`<img class="avat" src="${i+oppo}.png" title="${oppo}" alt="${wechat}">`);
          if(xiaomi == 0){alert("未解析到任何图片！");reset();$("#wechat").focus();}
        }
      });
    }else{
      alert("地址格式错误！");reset();$("#wechat").focus();
    }
} 

 


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});






function format(date){
    var date = new Date(date);//如果date为13位不需要乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y+M+D+h+m+s;
}


// init sqlite db
const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

 

if(0){
  //db.run("DROP TABLE Seeds");
  db.serialize(() => {db.run("CREATE TABLE CList (id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, hot TEXT, size TEXT, ctime TEXT, ex1 TEXT, ex2 TEXT, ex3 TEXT, ex4 TEXT)");});
}
if(0){
  db.all("SELECT count(id) from Seeds", (err, row) => {console.log("count > "+JSON.stringify(row));});
}
if(0){
  db.run("DELETE FROM CList WHERE url='https://github.com/zhangdo-sheva/imgbed/tree/main/upload'");
}
if(0){
  //db.run("INSERT INTO CList (url,size,ctime) VALUES ('https://github.com/zonelyn/bed','20','"+new Date().getTime()+"')");
  db.all("select ex1,ex2,size,count(url),max(ctime) from CList group by ex1;", (err, row) => {console.log("count > "+JSON.stringify(row));});  
}  
 
//console.log(format(new Date().getTime())); 
  

