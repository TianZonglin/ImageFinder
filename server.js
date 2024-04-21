/*
 * 功能：常量定义
 */
const COMA = "https://github.com/";
const COMB = "https://cdn.jsdelivr.net/";
const COMC = "https://gitee.com/"; 

/*
 * 功能：判断链接是否合法 and 是否是缺省状态
 */
function jugeUrl(zoom) {
  var flag = 0;
  if (
    new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/).test(
      zoom
    ) == true &&
    (zoom.indexOf(COMA.substr(8)) > 0 ||
      zoom.indexOf(COMB.substr(8)) > 0 ||
      zoom.indexOf(COMC.substr(8)) > 0)
  ) {
    flag = 1;
  } else if (
    zoom.indexOf(COMA) < 0 &&
    zoom.substr(0, 1) == "/" &&
    zoom.split("/").length >= 3 
  ) {
    flag = 2;
  }
  return flag;
}


/*
 * 功能：判断图片链接是否合法
 */
function CheckImgExists(imgurl) {
  var s = imgurl.match(/\.(png|jpe?g|gif|svg)(\?.*)?$/);
  if (s == null) return false;
  else return true;
}

/*
 * 功能：解析Github图床或cdn地址
 * 适用链接形如：
 * - https://cdn.jsdelivr.net/Tongn/ngg/Cache_32799f853a0e21fe..jpg
 * - https://cdn.jsdelivr.net/gh/Daibi-mua/jsdelivr@1.3/az.jpg
 */
function fullparse(url) {
  var path = "";
  var Component;
  var parseURL = [];
  var arr = url.split("/"),
    flen = 0,
    ix = 0;
  if (url.indexOf("cdn.jsdelivr.net/") > 0) {
    ix = 1;
  }
  if (url.indexOf("tree/master") > 0 || url.indexOf("tree/main") > 0) {
    flen = arr.length - 7 - ix;
    var name = arr[3];
    var base = arr[4];
    if (url.indexOf("cdn.jsdelivr.net/") > 0 && base.indexOf("@") > 0) {
      base = base.split("@")[0];
    }
    for (var i = 0; i < flen; i++) {
      path += arr[i + 7] + "/";
    }
    parseURL.push(url);
    return {
      parseURL: parseURL,
      jsdURL: "https://cdn.jsdelivr.net/gh/" + name + "/" + base + "/" + path,
      name: name,
      url: url
    };
  } else {
    var surl = "";
    flen = arr.length - 5 - ix;
    var name = arr[3];
    var base = arr[4];
    for (var i = 0; i < 5; i++) {
      surl += arr[i] + "/";
    }
    if (url.indexOf("cdn.jsdelivr.net/") > 0) {
      if (base.indexOf("@") > 0) {
        base = base.split("@")[0];
      }
      surl = COMA + "/" + name + "/" + base + "/";
    }
    surl += "^#";
    for (var i = 0; i < flen; i++) {
      path += "/" + arr[i + 5];
    }
    surl += path;
    parseURL.push(surl.replace("^#", "tree/master"));
    parseURL.push(surl.replace("^#", "tree/main"));
    return {
      parseURL: parseURL,
      jsdURL: "https://cdn.jsdelivr.net/gh/" + name + "/" + base + path + "/",
      name: name,
      url: url.replace(
        "https://cdn.jsdelivr.net/",
        "https://cdn.jsdelivr.net/gh/"
      )
    };
  }
}

/*
 * 功能：解析Gitee图床或cdn地址
 * 适用链接形如：
 * - https://gitee.com/W4j1e/pic/raw/master/img/js.jpg
 * - https://gitee.com/xaoxuu/cdn-assets/raw/master/blog/2019-0829a@2x.jpg
 */
function giteeparse(url) {
  var arr = url.split("/"),
    flen = 0,
    ix = 0;
  var name = arr[3];
  var repo = arr[4];
  var obj;
  if (url.indexOf("tree/master") > 0) {
    obj = {
      parseURL: [url],
      jsdURL: url.replace("/tree/master", "/raw/master") + "/",
      name: name,
      url: url
    };
  } else if (url.indexOf("raw/master") > 0) {
    if (arr[arr.length - 1].indexOf(".") > 0)
      url = url.replace(arr[arr.length - 1], "");
    obj = {
      parseURL: [url.replace("/raw/master", "/tree/master")],
      jsdURL: url + "/",
      name: name,
      url: url
    };
  } else {
    obj = {
      parseURL: [url.replace(arr[4], arr[4] + "/tree/master")],
      jsdURL: url.replace(arr[4], arr[4] + "/raw/master") + "/",
      name: name,
      url: url
    };
  }
  return obj;
}

/*
 * 功能：分流中间层
 */
function getComponent(url) {
  var mark = jugeUrl(url);
  var Component;
  var parseURL = [];
  if (mark == 1) {
    if (url.indexOf("gitee.com/") > 0) 
      return giteeparse(url);
    return fullparse(url);
  } else if (mark == 2) {
    return fullparse("https://github.com" + url);
  }
}

/// Sqlite部分 ///

const fs = require("fs");
const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

function format(date) {
  var date = new Date(date); //如果date为13位不需要乘1000
  var Y = date.getFullYear() + "-";
  var M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
  var h =
    (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
  var m =
    (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
    ":";
  var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}

/*
 * 功能：手动操作sqlite，避免自动执行
 */
if (0) {
  //db.run("DROP TABLE Seeds"); 
  db.serialize(() => {      
    db.run(
      "CREATE TABLE CList (id INTEGER PRIMARY KEY AUTOINCREMENT," +
        "url TEXT, hot TEXT, size TEXT, ctime TEXT, ex1 TEXT, ex2 TEXT, ex3 TEXT, ex4 TEXT)"
    );
  });
}
if (0) {
  db.all("SELECT count(id) from Seeds", (err, row) => {
    console.log("count > " + JSON.stringify(row));
  });
}
if (0) {
  //db.run("DELETE FROM CList WHERE url='https://github.com/zhangdo-sheva/imgbed/tree/main/upload'");
  db.run("DELETE FROM CList WHERE ex1='sen068'");
}
if (0) {
  //db.run("INSERT INTO CList (url,size,ctime) VALUES ('https://github.com/zonelyn/bed','20','"+new Date().getTime()+"')");
  db.all(
    "select ex1,ex2,size,count(url),max(ctime) from CList group by ex1;",
    (err, row) => {
      console.log("count > " + JSON.stringify(row));
    }
  );
}

/// Xpath解析部分 ///

var xpath = require("xpath");
var path = require("path");
var Dom = require("xmldom").DOMParser;
var offline = false;
var request2 = require("sync-request");

/*
 * 功能：初始解析原站XML，返回目标数组
 */
function getXML(parseURL) {
  var offline;
  console.log("XML => " + parseURL);
  var response = "";
  try {
    response = request2("GET", parseURL)
      .getBody()
      .toString();
    console.log("response-size ---> " + response.length);
    //console.log(response);
  } catch (err) {
    return {
      msg: err.message
        .split(/[\n]/)[0]
        .slice(0, -1)
        .replace(parseURL, "this query")
    };
  }
  var doc = new Dom({
    errorHandler: {
      warning: function(e) {},
      error: function(e) {},
      fatalError: function(e) {}
    }
  }).parseFromString(response);
  console.log(response);
  var proot;
  if (parseURL.indexOf("gitee.com/") > 0)
    proot = "//*[@id='tree-slider']/div/div[1]/a/text()";
  else 
    proot = "//*[contains(@class, 'react-directory-truncate')]/a";
  var s = xpath.select(proot, doc);
  console.log(s); //[]
  if (s.length > 0) {
    return s;
  } 
  else 
    return { msg: "Can't find any images." }; 
}

/*
 * 功能：最后加工目标数组为图片链接
 * - 支持Github的 main master 容错解析
 * - 支持Gitee的 解析（整合）
 */
function resolv(parseURL, jsdURL, url) {
  console.log(parseURL);
  var list = [];
  var folder = [];
  var pchild;
  if (parseURL[0].indexOf("gitee.com/") > 0) {
    /*
    var items = getXML(parseURL[0])
      .toString()
      .split(",");
    for (var i in items) {
      var p = jsdURL + items[i];
      if (CheckImgExists(p)) {
        list.push(p);
      } else {
        if (items[i].split(".").length == 1 && items[i] != "") {
          folder.push(items[i].trim().replace("\n", ""));
        }
      }
    }
    console.log("partX > list " + list.length);
    console.log("partX > folder " + folder.length);
    */
    return { list: list, folder: folder, url: url };
  } else {
    pchild = "string(//*)";  //github 现在包括 small big 两套显示元素
    //console.log(parseURL);
    for (var i in parseURL) {
      console.log(i);
      var items = getXML(parseURL[i].replace("/tree/master","").replace("/tree/main",""));
      if (i == 0) {
        for (var e in items) {
          var parser = new Dom().parseFromString(items[e].toString());
          //console.log(parser);
          if (parser != null) {
            var jpgs = xpath.select1(pchild, parser);
            var p = jsdURL + jpgs;
            if (CheckImgExists(p)) {
              list.push(p);
            } else {
              if (jpgs.split(".").length == 1 && jpgs != "") {
                folder.push(jpgs);
              }
            }
          }
        }
        list = list.filter((item, index) => item !== list[index + 1]);
        folder = folder.filter((item, index) => item !== folder[index + 1]);
        if (!list.length && !folder.length) {
          console.log("result is blank");
        }
        else
          return { list: list, folder: folder, url: url };
      } else if (i == 1) {
        console.log("this is i=1");
        if (items.msg == null) {
          for (var e in items) {
            var parser = new Dom().parseFromString(items[e].toString());
            var jpgs = xpath.select1(pchild, parser);
            var p = jsdURL + jpgs;
            if (CheckImgExists(p)) {
              list.push(p);
            } else {
              if (jpgs.split(".").length == 1 && jpgs != "") {
                folder.push(jpgs);
              }
            }
          }
        }
        list = list.filter((item, index) => item !== list[index + 1]);
        folder = folder.filter((item, index) => item !== folder[index + 1]);
        if (!list.length && !folder.length) {}
        else
          return { list: list, folder: folder, url: jsdURL };
      }
    }
  }
  return items;
}

// Express部分 //

const express = require("express");
const app = express();
var bodyParser = require("body-parser");
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false });
// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.static("public"));

let ejs = require("ejs");
 

/*
 * 功能：根目录解析
 * - 不带参数直接返回模板主页
 * - 带参数则返回单页渲染模板
 */
app.get("/", (request, response) => {
  var url = request.query.x;
  if (url != null) {
    var exg = new RegExp('^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$');
    if(exg.test(url)){
      url= new Buffer(url, 'base64').toString();
    }
    if (url.indexOf("cdn.jsdelivr.net/") > 0) {
      url = url.replace(
        "https://cdn.jsdelivr.net/gh/",
        "https://cdn.jsdelivr.net/"
      );
    }
    var cp = getComponent(url);
    var list = resolv(cp.parseURL, cp.jsdURL, cp.url);

    
    if (list.list.length || list.folder.length) {
      var base = COMA + cp.name + ".png";
      if (url.indexOf("gitee.com/") > 0)
        base = "https://robohash.org/" + cp.name + ".png";
      db.run(
        "INSERT INTO CList (url,size,ctime,ex1,ex2) VALUES ('" +
          cp.url +
          "','" +
          list.list.length +
          "','" +
          new Date().getTime() +
          "','" +
          cp.name +
          "','" +
          base +
          "')"
      );
    }
    
    return response.render('/app/views/gallery', { list: list });
  } else{ 
    url = request.query.things;
    if (url != null) {
      var exg = new RegExp('^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$');
      if(exg.test(url)){
        url= new Buffer(url, 'base64').toString();
      }
      if (url.indexOf("cdn.jsdelivr.net/") > 0) {
        url = url.replace(
          "https://cdn.jsdelivr.net/gh/",
          "https://cdn.jsdelivr.net/"
        );
      }
      var cp = getComponent(url);
      var list = resolv(cp.parseURL, cp.jsdURL, cp.url);


      if (list.list.length || list.folder.length) { 
        var base = COMA + cp.name + ".png";
        if (url.indexOf("gitee.com/") > 0)
          base = "https://robohash.org/" + cp.name + ".png";
        db.run(
          "INSERT INTO CList (url,size,ctime,ex1,ex2) VALUES ('" +
            cp.url +
            "','" +
            list.list.length +
            "','" +
            new Date().getTime() + 
            "','" +
            cp.name +
            "','" + 
            base +
            "')"
        );
      }
      return response.render('/app/views/things', { list: list });
    }
  } 
  
  return response.sendFile(__dirname + "/views/index.html");
  

});

/*
 * 功能：核心调用入口
 * - getComponent()清洗解析链接
 * - resolv()完成XML->图片链接的逻辑
 */
app.post("/fuckqq", urlencodedParser, function(req, res) {
  var url = req.body.wechat;
  
  var exg = new RegExp('^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$');
  if(exg.test(url)){
    url= new Buffer(url, 'base64').toString();
  }
 
  url = encodeURI(url);
  if (url.indexOf("cdn.jsdelivr.net/") > 0) {
    url = url.replace(
      "https://cdn.jsdelivr.net/gh/",
      "https://cdn.jsdelivr.net/"
    );
  }
  

  
  var cp = getComponent(url);
  try {
    var list = resolv(cp.parseURL, cp.jsdURL, cp.url);
    if (list.list == null && list.folder == null) {
      return res.send({ msg: "Github已不支持抓取二级目录！" });
    }
    if (list.list.length || list.folder.length) {
      var base = COMA + cp.name + ".png";
      if (url.indexOf("gitee.com/") > 0)
        base = "https://robohash.org/" + cp.name + ".png";
      db.run(
        "INSERT INTO CList (url,size,ctime,ex1,ex2) VALUES ('" +
          cp.url +
          "','" +
          list.list.length +
          "','" +
          new Date().getTime() +
          "','" +
          cp.name +
          "','" +
          base +
          "')"
      );
    }
    return res.send(list);
  } catch (e) {
    return res.send({ msg: e.message });
  }
});

/*
 * 功能：刷新时载入已有用户（都在看）
 * - 可返回更多数据信息，以供页面分析
 */
app.get("/birth", function(req, res) {
  db.all(
    "select ex1,ex2,size,url,ctime,count(url),max(ctime) from CList group by ex1;",
    (err, row) => {
      return res.send(row);
    }
  );
});

app.get("/payoff", function(req, res) {
  db.all("select max(id) from CList;", (err, row) => {
    return res.send(row);
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

 