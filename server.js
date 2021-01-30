const fs = require("fs");
const express = require("express");
const app = express();
var bodyParser = require('body-parser');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })
 


//https://gitee.commmmmmmm/W4j1e/pic/raw/master/img/js.jpg
//https://cdn.jsdelivr.net/Tongn/ngg/Cache_32799f853a0e21fe..jpg
//https://cdn.jsdelivr.net/gh/Daibi-mua/jsdelivr@1.3/az.jpg
//https://gitee.com/W4j1e/pic/raw/master/img/js.jpg
//https://gitee.com/xaoxuu/cdn-assets/raw/master/blog/2019-0829a@2x.jpg




var request = require('urllib-sync').request;
var xpath = require('xpath');
var path = require('path');
var Dom = require('xmldom').DOMParser;
var offline = false;



const COMA="https://github.com/";
const COMB="https://cdn.jsdelivr.net/";
const COMC="https://gitee.com/";
var typeQR="github";

function jugeUrl(zoom) {
    var flag = 0;
    if (new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/).test(zoom) == true
       && (zoom.indexOf(COMA.substr(8))>0||zoom.indexOf(COMB.substr(8))>0||zoom.indexOf(COMC.substr(8))>0)){flag = 1;} 
    else if(zoom.indexOf(COMA)<0 && zoom.substr(0,1)=="/" && zoom.split('/').length>=3){flag = 2;} 
    return flag;
} 
 
 

function CheckImgExists(imgurl) {
    var s = imgurl.match(/\.(png|jpe?g|gif|svg)(\?.*)?$/);
    if(s==null) return false;
    else return true;
}



function fullparse(url){
  
    var path="";
    var Component;
    var parseURL = [];
    var arr = url.split("/"),flen=0,ix=0;
  
    if(url.indexOf("cdn.jsdelivr.net/")>0){ix=1;}
    if(url.indexOf("tree/master")>0||url.indexOf("tree/main")>0){
      flen = arr.length-7-ix;
      var name = arr[3];
      var base = arr[4];
      if(url.indexOf("cdn.jsdelivr.net/")>0 
         && base.indexOf("@")>0 ){base = base.split("@")[0];}
      for(var i=0;i<flen;i++){
        path += arr[i+7]+"/";
      } 
      parseURL.push(url);

      return {"parseURL":parseURL,
              "jsdURL":"https://cdn.jsdelivr.net/gh/"+name+"/"+base+"/"+path,
              "name":name,"url":url};
    }else{
      var surl = "";
      flen = arr.length-5-ix;
      var name = arr[3];
      var base = arr[4];
      for(var i=0;i<5;i++){
        surl += arr[i]+"/";
      } 
      if(url.indexOf("cdn.jsdelivr.net/")>0 ){
        if(base.indexOf("@")>0 ){base = base.split("@")[0];}
        surl = COMA+"/"+name+"/"+base+"/";
      }

      surl += "^#";
      for(var i=0;i<flen;i++){
        path += "/"+arr[i+5];
      } 
      surl += path;
      
      parseURL.push(surl.replace("^#","tree/master"));
      parseURL.push(surl.replace("^#","tree/main")); 
      return {"parseURL":parseURL,
              "jsdURL":"https://cdn.jsdelivr.net/gh/"+name+"/"+base+path+"/",
              "name":name,"url":url.replace("https://cdn.jsdelivr.net/","https://cdn.jsdelivr.net/gh/")
      };
    }
}  
//https://gitee.com/W4j1e/pic/img
 //https://gitee.com/W4j1e/pic/tree/master/img
 //https://gitee.com/W4j1e/pic/raw/master/img/clip_image002.jpg

 
function giteeparse(url){ 
 
    var arr = url.split("/"),flen=0,ix=0;
    var name = arr[3];
    var repo = arr[4];
    var obj;
    if(url.indexOf("tree/master")>0){
      obj = {"parseURL":[url],
              "jsdURL":url.replace("/tree/master","/raw/master")+"/",
              "name":name,"url":url};
      
    }else if(url.indexOf("raw/master")>0){ 
      url=url.replace(arr[arr.length-1],"");
      obj = {"parseURL":[url.replace("/raw/master","/tree/master")],
              "jsdURL":url+"/",
              "name":name,"url":url};
    }else{
 
      obj = {"parseURL":[url.replace(arr[4],arr[4]+"/tree/master")],
              "jsdURL":url.replace(arr[4],arr[4]+"/raw/master")+"/",
              "name":name,"url":url};
    }
    return obj;
}  

function getComponent(url){
  
    var mark = jugeUrl(url);  
    var Component;
    var parseURL = [];  
  
    if(mark==1){ 
      if(url.indexOf("gitee.com/")>0)return giteeparse(url); 
      return fullparse(url);
    }else if(mark==2){
      return fullparse("https://github.com"+url);
    }
}

var request2 = require('sync-request');

function getXML(parseURL){
  var offline;
    console.log("XML => "+parseURL);
    var response = '';
    try { 
      //console.log(request2('GET', "https://www.baidu.com").getBody());
      response = request2('GET', parseURL).getBody().toString();
      console.log("response-size > "+ response.length);
      //response = request(parseURL, { timeout: timeout, dataType: 'xml' })   
    } 
    catch (err) { 
      return {"msg":err.message.split(/[\n]/)[0].slice(0,-1).replace(parseURL,"this query")}
    }
    var doc = new Dom({    
        errorHandler: {
            warning: function (e) {},
            error: function (e) {},
            fatalError: function (e) {}
        }
    }).parseFromString(response);
    var proot;
    if(parseURL.indexOf("gitee.com/")>0)
      proot = "//*[@id='tree-slider']/div";
    else 
      proot = "//*[contains(@class, 'js-active-navigation-container')]/div";
 
    var s = xpath.select(proot, doc);
    if(s.length>0){
      //console.log(s.toString());
      return s;
    }
    else return {"msg":"Can't find any images."}
}



 
function resolv(parseURL,jsdURL,url) {
    var list=[];
    var folder=[];
    var pchild;
    if(parseURL.indexOf("gitee.com/")>0)
      pchild = "string(//div[1]/a)"; 
    else
      pchild = "string(//div/div[2]/span/a)";

    for (var i in parseURL) {
      //console.log(parseURL[i]);
      var items = getXML(parseURL[i]);
      console.log(items.length);
      if(i == 0){
        for (var e in items) {
            var parser = new Dom().parseFromString(items[e].toString());
            if(parser==null) break;
            var jpgs = xpath.select1(pchild, parser);
            var p = jsdURL+jpgs;
            if(CheckImgExists(p)){
              //console.log("ppppppp: ",p);
              list.push(p);
            }else{
              if(jpgs.split(".").length==1&&jpgs!=""){
                folder.push(jpgs);
              }
            }
        }
        console.log("part1 > list "+list.length);
        console.log("part1 > folder "+folder.length);
        if(!list.length&&!folder.length) break;
        return {"list":list,"folder":folder,"url":url};
      }else if(i == 1){ 
        if(items.msg!=null) return items;
        for (var e in items) {
            var parser = new Dom().parseFromString(items[e].toString());
            var jpgs = xpath.select1(pchild, parser);
            var p = jsdURL+jpgs;
            if(CheckImgExists(p)){
              list.push(p);
            }else{
              if(jpgs.split(".").length==1&&jpgs!=""){
                folder.push(jpgs);
              }
            }
        }
        console.log("part2 > "+list.length);
        console.log("part2 > folder "+folder.length);
        if(!list.length&&!folder.length) break;
        return {"list":list,"folder":folder,"url":jsdURL};
      }
    }
    return items;
}
 

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));




app.get("/", (request, response) => {
    var url = request.query.x;
    if(url != null){
      if(url.indexOf("cdn.jsdelivr.net/")>0){
        url = url.replace("https://cdn.jsdelivr.net/gh/","https://cdn.jsdelivr.net/");
      }
      var cp = getComponent(url);
      var list = resolv(cp.parseURL,cp.jsdURL,cp.url);
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
          html +=       '<section class="folders" id="folders">';
          list.folder.forEach(function(win){
              var xt="/";
              if(list.url.slice(-1)=="/")xt="";
              html += `<div class="fold" title="${list.url+xt+win}" id="${list.url}">${win}</div>`; 
          });    
          html +=       '</section><br>';
          html += '      <section class="pictures" id="pictures">';
          list.list.forEach(function(mac){
            html += `<a class="fancybox" rel="group" href="${mac}"><img class="img" src="${mac}"/></a>`; 
          }); 
          html += '      </section>';
          html += '    </main>';
          html += '    <footer><b><a style="color:#664c00" href="https://www.cz5h.com" target="_blank">@CZ5H.COM「2021」</a></b></footer>';
          html += '  </body>';
          html += '</html>';
          return response.send(html);
          if(list.list.length){
            db.run("INSERT INTO CList (url,size,ctime,ex1,ex2) VALUES ('"+cp.url+"','"+list.list.length+"','"+new Date().getTime()+"','"+cp.name+"','"+"https://github.com/"+cp.name+".png"+"')");
          }
    }else{
      return response.sendFile(__dirname + "/views/index.html");
    }

});
 //https://gitee.com/W4j1e/pic/tree/master/img
 //https://gitee.com/W4j1e/pic/blob/master/img/clip_image002.jpg
//var cp = getComponent("https://github.com/zonelyn/bed");
//var list = resolv(cp.parseURL,cp.jsdURL,cp.url);
//console.log(">>>>>>>>>>>>> ",list.list.length);



app.post('/fuckqq', urlencodedParser, function (req, res) {
 
    var url = req.body.wechat; 
    url = encodeURI(url);
    if(url.indexOf("cdn.jsdelivr.net/")>0){
      url = url.replace("https://cdn.jsdelivr.net/gh/","https://cdn.jsdelivr.net/");
    }
    var cp = getComponent(url);
    try{
      var list = resolv(cp.parseURL,cp.jsdURL,cp.url);

      if(list.list==null&&list.folder==null){
        return res.send({"msg":"没有子目录且未发现图片资源！"});
      }
      return res.send(list);

      if(list.list.length){  
        db.run("INSERT INTO CList (url,size,ctime,ex1,ex2) VALUES ('"+cp.url+"','"+list.list.length+"','"+new Date().getTime()+"','"+cp.name+"','"+"https://github.com/"+cp.name+".png"+"')");
      }
    }catch(e){

      return res.send({"msg":e.message});
    }
    

})



app.get('/birth', function(req, res){
    db.all("select ex1,ex2,size,url,ctime,count(url),max(ctime) from CList group by ex1;", (err, row) => {
      return res.send(row);
    });  
})


app.get('/payoff', function(req, res){
    db.all("select max(id) from CList;", (err, row) => {
      return res.send(row);
    });  
})


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
  //db.run("DELETE FROM CList WHERE url='https://github.com/zhangdo-sheva/imgbed/tree/main/upload'");
  db.run("DELETE FROM CList WHERE ex1='gh'");
}
if(0){
  //db.run("INSERT INTO CList (url,size,ctime) VALUES ('https://github.com/zonelyn/bed','20','"+new Date().getTime()+"')");
  db.all("select ex1,ex2,size,count(url),max(ctime) from CList group by ex1;", (err, row) => {console.log("count > "+JSON.stringify(row));});  
}  
 
//console.log(format(new Date().getTime())); 
  

 
