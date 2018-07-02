Core.plugin['JsonUpload'] = {};



Core.plugin['JsonUpload'].changeTime = function(str) {
    var calender = new Date();
    if (str.indexOf("昨天") !== -1) {
        calender.setDate(calender.getDate() - 1);
        str = str.replace("昨天", calender.format("yyyy-mm-dd"));
    } else if (str.indexOf("前天") !== -1) {
        calender.setDate(calender.getDate() - 2);
        str = str.replace("前天", calender.format("yyyy-mm-dd"));
    } else if (str.indexOf("分前") !== -1) {
        var matchs = str.match(/([0-9]+)分前/);
        calender.setMinutes(calender.getMinutes() - matchs[1]);
        str = calender.format("yyyy-mm-dd HH:MM");
    } else if (str.indexOf("1分內") !== -1) {
        str = calender.format("yyyy-mm-dd HH:MM");
    } else if (str.indexOf("小時前") !== -1) {
        var matchs = str.match(/([0-9]+)小時前/);
        calender.setHours(calender.getHours() - matchs[1]);
        str = calender.format("yyyy-mm-dd HH:MM");
    } else {
        var matchs = str.match(/([0-9]+)-([0-9]+) ([0-9]+):([0-9]+)/);

        var newDate = new Date(calender.getYear(), matchs[1], matchs[2], matchs[3], matchs[4], 0, 0);
        if (newDate > calender)
            calender.setYear(calender.getYear() - 1);
        str = calender.format("yyyy-mm-dd HH:MM");
    }
    return str;
}

Core.plugin['JsonUpload'].uploadJsonFunt = function() {
    var uploadObj = new Object();
    var msgMatch = document.documentElement.innerHTML.match(/buildMsg\(([0-9]+),\'#GID([0-9]+)\',\'([^\']*)\',\'([^\']*)\',\'[^\']*owner=([^\"]*)[^\']*<img[^>]*> ([^<]*)<\/a>：([^']*)\',\'([^\']*)\',([0-9]+),([0-9]+),([0-9]+),\'([^\']*)\',([0-9]+),([0-9]+),([0-9]+),\'([^\']*)\',\'([^\']*)\'\)/);
    uploadObj.sn = msgMatch[1];
    uploadObj.gsn = msgMatch[2];
    uploadObj.uid = msgMatch[5];
    uploadObj.nick = msgMatch[6];
    uploadObj.content = msgMatch[7];
    uploadObj.gp = msgMatch[9];
    uploadObj.bp = msgMatch[10];
    uploadObj.priv = msgMatch[11];
    uploadObj.date = Core.plugin['JsonUpload'].changeTime(msgMatch[8]);
    uploadObj.replynum = Core.config['lastReplyArr'].length;
    uploadObj.reply = new Array();
    $.each(Core.config['lastReplyArr'], function(i, item) {
        var replyObj = new Object();
        replyObj.sn = item.snID;
        replyObj.uid = item.userID;
        replyObj.nick = item.user;
        replyObj.date = Core.plugin['JsonUpload'].changeTime(item.time);
        replyObj.comment = item.content;

        uploadObj.reply.push(replyObj);
    });

    var myJsonString = JSON.stringify(uploadObj);

    $.ajax({
        dataType: "json",
        url: "https://www.isaka.idv.tw/History/uploadJson.php",
        data: {
            data: myJsonString,
            key: Core.config['uploadJsonKey']
        },
        method: "POST",
        success: function(e) {
            alert("上傳完成！" + " (" + e.code + ") " + e.descirbe);
        },
        error: function(j, s, e) {
            alert("上傳失敗！" + e);
        }
    });
}

/*Core.pages.get('singleACMsg').events.register('common', function() {
    if (Core.config['uploadJsonKey'] !== undefined) {
        if (Core.config['uploadJsonKey'].length !== 64)
            return;
        var BH_menuE_appendDOM_uploadJson_link = document.createElement("a");
        BH_menuE_appendDOM_uploadJson_link.innerHTML = "上傳至暫存空間(活動組專用)";
        var BH_menuE_appendDOM_uploadJson = document.createElement("li");
        BH_menuE_appendDOM_uploadJson.appendChild(BH_menuE_appendDOM_uploadJson_link);
        document.getElementsByClassName('BH-menuE')[0].appendChild(BH_menuE_appendDOM_uploadJson);
        BH_menuE_appendDOM_uploadJson_link.addEventListener("click", Core.plugin['JsonUpload'].uploadJsonFunt);
    }
});*/