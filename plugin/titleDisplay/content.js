Core.plugin['TitleDisplay'] = {};

Core.plugin['TitleDisplay'].title_msgChange = function() {
    var title = Core.config['NEW_TITLE'];
    var boolNotice = Core.config['titleNumbersCheckNotice'];
    var boolSubscript = Core.config['titleNumbersCheckSubscript'];
    var boolRecommend = Core.config['titleNumbersCheckRecommend'];

    var msg_alert = new Array('topBar_light_0', 'topBar_light_1', 'topBar_light_2');

    var total_msg = 0;
    var msg_sep = new Array();
    msg_alert.forEach(function(entry) {
        if (document.getElementById(entry).firstChild != null) {
            var spanText = document.getElementById(entry).children[0].innerHTML;
            var temp_int = parseInt(spanText, 10);
            msg_sep.push(temp_int);
        } else {
            msg_sep.push(0);
        }
    });
    if (boolNotice) total_msg += msg_sep[0];
    if (boolSubscript) total_msg += msg_sep[1];
    if (boolRecommend) total_msg += msg_sep[2];

    if (total_msg > 0) {
        document.title = "(" + total_msg + ") " + title;
    } else {
        document.title = title;
    }
}

Core.plugin['TitleDisplay'].addBtnEditTitle = function() {
    //增加修改網頁標題功能
    var BH_menuE_appendDOM_link = document.createElement("a");
    BH_menuE_appendDOM_link.innerHTML = "更改網頁標題";
    var BH_menuE_appendDOM = document.createElement("li");
    BH_menuE_appendDOM.appendChild(BH_menuE_appendDOM_link);
    document.getElementsByClassName('BH-menuE')[0].appendChild(BH_menuE_appendDOM);
    BH_menuE_appendDOM_link.addEventListener("click", function() {
        var newtitle = prompt("請輸入網頁的新標題", Core.config['ORGINAL_TITLE'])
        if (newtitle) {
            document.title = newtitle;
            Core.config['NEW_TITLE'] = newtitle;
        }
    });
}


Core.events.register('before_page_action', function() {
    Core.config['ORGINAL_TITLE'] = document.title;
    Core.config['NEW_TITLE'] = document.title;

    if (Core.config['titleNumbers'] === true) {
        Core.plugin['TitleDisplay'].title_msgChange();
        document.getElementById('BH-top-data').addEventListener("DOMSubtreeModified", function(event) {
            Core.plugin['TitleDisplay'].title_msgChange();
        });
    }
});

Core.pages.get('singleACMsg').events.register('common', Core.plugin['TitleDisplay'].addBtnEditTitle);
Core.pages.get('guild').events.register('common', Core.plugin['TitleDisplay'].addBtnEditTitle);