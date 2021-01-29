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
    var mark = jugeUrl(wechat);//console.log(mark);
    if(mark>0){
      $.ajax({
        type: "post",url: "/fuckqq",data: {"wechat":decodeURI(wechat)},dataType: "json",
        timeout:100000,
        success: function(facebook){
          console.log(facebook);
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
              if(xiaomi != 0){reset(); //headsup();
              }
            }); 
            var oppo = wechat.split("/")[3];
            if(wechat.indexOf(COMB.substr(8))>0)oppo = wechat.split("/")[4];
            if(x!=2){
              if(JSON.stringify(o).indexOf(wechat)<0)
                $("#avat").append(`<img class="avat" src="${COMA+"/"+oppo}.png" title="${oppo}" id="${wechat}">`);
            }
            if(xiaomi == 0){
              $("#pictures").append("<span style='color: #c93b0e;'>未解析到任何图片！</span>"); 
              reset();$("#wechat").focus();
            }//alert("未解析到任何图片！");
          }else{
            alert(facebook.msg);
            reset();$("#wechat").focus();
          }
        },
        error : function(xhr,textStatus){
          console.log(xhr,textStatus);
           //alert("Github长时间(10s)未响应，终止！");
           //location.reload(true);
        }
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


$(document).ready(function(){
    $(window).on("load", function(){
        imgLocation();
        var dataImg = {"data":[{"src":"alt1.jpg"},{"src":"alt2.jpg"}]};                                            
        // 获取最后一张图片距离顶端的高度 + 它本身高度的一半
        $(window).scroll(function() {                      
            if(getSideHeight()){
                $.each(dataImg.data, function(index, value){
                    var pin = $("<div>").addClass('pin').appendTo('#main');
                    var box = $("<div>").addClass('box').appendTo(pin);
                    var img = $("<img>").attr('src', 'images/' + $(value).attr("src")).appendTo(box);
                });
                imgLocation();
            }
        });
 
    });
});
 
//获取最后一张图片的高度
function getSideHeight(){
    var box = $("pin");
    var lastImgHeight = (box.last().get(0)).offsetTop - Math.floor(box.last().height()/2);
    var documentHeight = $(document).height();          //获取当前窗口的高度
    var scrollHeight = $(window).scrollTop();           //获取滚动的距离
    return (lastImgHeight < documentHeight + scrollHeight) ? true:false;
}
 
//图片位置摆放
function imgLocation(){
    var box = $(".pin");                                //返回一个数值
    var boxWidth  = box.eq(0).width();                  //每张图片的宽度
    var num = Math.floor($(window).width()/boxWidth);   //一行能放的图片的个数
    var numArr = [];
    box.each(function(index, value){
        var boxHeight = box.eq(index).height();         //获取每张图片的高度
        if(index < num){                                 //第一排
            numArr[index] = boxHeight;
        }
        else{                                           //第二排
            var minboxHeight = Math.min.apply(numArr,numArr);
            var minIndex = $.inArray(minboxHeight, numArr);
   