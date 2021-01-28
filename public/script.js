const i="https://github.com/";
function jugeUrl(zoom) {
    
    var flag = 0;
    if (new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/).test(zoom) == true
       && zoom.indexOf(i.substr(8))>0){flag = 1;} 
    else if(zoom.indexOf(i)<0 && zoom.substr(0,1)=="/" && zoom.split('/').length>=3){flag = 2;} 
    return flag;
} 
 
function reset() {
    $("#wechat").removeAttr("readonly");
    $('#spacex').removeAttr('disabled');
    $('#google').hide();
} 

function firethehole(wechat,o) {
    
    $("#pictures").html("");
    $("#wechat").attr("readonly","readonly");
    $('#spacex').attr('disabled','disabled');
    $('#google').show();
    if(wechat.substr(-1)=="/"){wechat = wechat.slice(0,-1);}
  
    var mark = jugeUrl(wechat);console.log(mark);
    if(mark>0){
      $.ajax({
        type: "post",url: "/fuckqq",data: {"wechat":wechat},dataType: "json",
        success: function(facebook){
          var xiaomi = 0;
          facebook.forEach(function(mac){
            setTimeout(function() {  
              $("#pictures").append(`<a class="fancybox" rel="group" href="${mac}"><img class="img" src="${mac}"/></a>`); 
            }, (++xiaomi)*100);
            if(xiaomi != 0){reset(); //headsup();
            }
          }); 
          const oppo = wechat.split("/")[3];
          if(JSON.stringify(o).indexOf(wechat)<0)
            $("#avat").append(`<img class="avat" src="${i+oppo}.png" title="${oppo}" alt="${wechat}">`);
          if(xiaomi == 0){alert("未解析到任何图片！");reset();$("#wechat").focus();}
        }
      });
    }else{
      if(mark==0) alert("格式错误，请按页面底部规则检查！");
      reset();$("#wechat").focus();
      
    }
} 

//function headsup() {
//    fetch("/payoff", {})
//      .then(res => res.json()).then(vivo => {
//        console.log(vivo);
//      });
//}

$(function(){
      var o; //headsup();
      fetch("/birth", {})
        .then(res => res.json()).then(vivo => {
          o = vivo;
          for (var mix in vivo) {
            //console.log(vivo[mix]);
              $("#avat").append(`<img class="avat" src="${vivo[mix].ex2}" title="${vivo[mix].ex1}" alt="${vivo[mix].url}">`);
          }
        });
      $(document).on("click",".avat",function(event){
          $("#wechat").val(this.alt);
          firethehole(this.alt,o);
      });
      $('#spacex').click(function(){
          var wechat = $("#wechat").val();  
          firethehole(wechat,o);
      })
      $(".fancybox").fancybox();
      $("#pictures").on("focusin", function(){
         $("a.fancybox").fancybox({}); 
      });  
  })
 