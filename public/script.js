const COMA="https://github.com";
const COMB="https://cdn.jsdelivr.net/";
const COMC="https://gitee.com";
function jugeUrl(zoom) {
    var flag = 0;
    if (new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/).test(zoom) == true
       && (zoom.indexOf(COMA.substr(8))>0||zoom.indexOf(COMB.substr(8))>0||zoom.indexOf(COMC.substr(8))>0)){flag = 1;} 
    else if(zoom.indexOf(COMA)<0 && zoom.substr(0,1)=="/" && zoom.split('/').length>=3){flag = 2;} 
    return flag;
} 
function reset() {
    $("#wechat").removeAttr("readonly");
    $('#spacex').removeAttr('disabled');
    $('#google').hide();
} 
function firethehole(wechat,o,x) {
    $("#wechat").attr("readonly","readonly");
    $('#spacex').attr('disabled','disabled');
    $('#google').show();
    if(wechat.substr(-1)=="/"){wechat = wechat.slice(0,-1);}
  console.log(wechat);
    var mark = jugeUrl(wechat);//console.log(mark);
    if(mark>0){
      $.ajax({
        type: "post",url: "/fuckqq",
        data: {"wechat":decodeURI(wechat)},dataType: "json",
        success: function(facebook){
          if(facebook.msg==null){
            var huawei = facebook.folder;
            var honor = facebook.list;
            var redmi = 0;
            $("#folders").html("");
            if(x==2&&wechat.split("/").length>5){$("#folders").append(`<div class="fold" title="${wechat.replace("/"+wechat.split("/")[wechat.split("/").length-1],"")}">[返回上层]</div>`); }
            huawei.forEach(function(win){
              setTimeout(function() {    
                var xt="/";
                if(facebook.url.slice(-1)=="/")xt="";
                $("#folders").append(`<div class="fold" title="${facebook.url+xt+win}" id="${facebook.url}">${win}</div>`); 
              }, (++redmi)*20);
            }); 
            var xiaomi = 0;
            $("#pictures").html("");
            honor.forEach(function(mac){
              setTimeout(function() {  
                $("#pictures").append(`<a class="fancybox" rel="group" href="${mac}"><img class="img" src="${mac}"/></a>`); 
              }, (++xiaomi)*100);
              if(xiaomi != 0){reset(); }
            }); 
            var oppo = wechat.split("/")[3];
            if(wechat.indexOf(COMB.substr(8))>0)oppo = wechat.split("/")[4];
            if(x!=2){
              if(JSON.stringify(o).indexOf(wechat)<0)
                if(wechat.indexOf(COMC)>0) $("#avat").append(`<img class="avat" src="${COMC+"/"+oppo}.png" title="${oppo}" id="${wechat}">`);
                else $("#avat").append(`<img class="avat" src="${COMA+"/"+oppo}.png" title="${oppo}" id="${wechat}">`);
            }
            if(xiaomi == 0){
              $("#pictures").append("<span style='color: #c93b0e;'>未解析到任何图片！</span>"); 
              reset();$("#wechat").focus();
            }//alert("未解析到任何图片！");
          }else{
            alert(facebook.msg);
            reset();$("#wechat").focus();
          }
        },error : function(xhr,textStatus){console.log(xhr,textStatus);}
      });
    }else{
      if(mark==0) alert("格式错误，请按页面底部规则检查！");
      reset();$("#wechat").focus();
    }
} 
$(function(){
    var o; //headsup();
    fetch("/birth", {})
      .then(res => res.json()).then(vivo => { o = vivo;
        for (var mix in vivo) {
            $("#avat").append(`<img class="avat" src="${vivo[mix].ex2}" title="${vivo[mix].ex1}" id="${vivo[mix].url}">`);
        }
      });
    $(document).on("click",".avat",function(event){$("#wechat").val(this.id);firethehole(this.id,o,1);});
    $(document).on("click",".fold",function(event){$("#wechat").val(this.title);firethehole(this.title,o,2);});
    $('#spacex').click(function(){var wechat = $("#wechat").val();firethehole(wechat,o,0);});
    $(".fancybox").fancybox();
    $("#pictures").on("focusin", function(){
       $("a.fancybox").fancybox({}); 
    });  
})
 