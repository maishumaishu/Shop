//显示灰色 jQuery 遮罩层
function showBg(isShow) {

    //var bh = $("body").height();
    //var bw = $("body").width();
    //$("#fullbg").css({
    //    width: bw,
    //    display: "block"
    //});
    if (isShow == 1) {
        $("#preview_box").show();
    }
}

//关闭灰色 jQuery 遮罩
function closeBg() {
    $("#preview_box,#fullbg,#news_preview_box").hide();
}