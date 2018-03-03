Core.plugin['HighSpeed'] = {};
Core.plugin['HighSpeed'].flag = false;

Core.plugin['HighSpeed'].changeTime = function(str) {
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
Core.pages.get('singleACMsg').events.register('reGenerateReply_pre', function(replyArr) {
    Core.plugin['HighSpeed'].flag = document.getElementById('baha-autoRefreshHiSpeedCheck').checked;
});

Core.plugin['HighSpeed'].arrayChangeTime = function(replyArr) {
    replyArr.forEach(function(element, id) {
        replyArr[id].time = (Core.plugin['HighSpeed'].flag) ? Core.plugin['HighSpeed'].changeTime(replyArr[id].time) : replyArr[id].time;
    });

    var arr = [];
    arr[0] = replyArr;
    return arr;
}



Core.pages.get('singleACMsg').events.register('reGenerateReply_beforeRender', Core.plugin['HighSpeed'].arrayChangeTime, 10);

Core.pages.get('singleACMsg').events.register('reGenerateReply_insertRender_pre', Core.plugin['HighSpeed'].arrayChangeTime, 10);