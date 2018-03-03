Core.plugin['Bookmark'] = {};

Core.plugin['Bookmark'].setBookMarkBtn = function(MsgReid) {
    var newItem = document.createElement("div");
    newItem.id = 'baha-bookMark-' + MsgReid;
    newItem.className = 'baha-boonMarkBtn';
    newItem.innerHTML = '設為書籤';
    newItem.setAttribute('guildId', Core.config['guildId']);
    newItem.setAttribute('Msgid', Core.config['MsgId']);
    newItem.setAttribute('replyid', MsgReid);

    var tempCurrentDom = document.getElementById(MsgReid);
    tempCurrentDom.insertBefore(newItem, tempCurrentDom.childNodes[0]);
    tempCurrentDom.addEventListener('mouseover', function() {
        this.childNodes[0].style.display = 'block';
        this.style.width = '570px';
    });
    tempCurrentDom.addEventListener('mouseout', function() {
        this.childNodes[0].style.display = 'none';
        this.style.width = '500px';
    });
}

Core.plugin['Bookmark'].setAllBookMarkBtn = function() {
    var replyMsgHistoryArr = document.getElementsByClassName('msgreport');
    for (i = 0; i < replyMsgHistoryArr.length; i++) {
        Core.plugin['Bookmark'].setBookMarkBtn(replyMsgHistoryArr[i].id);
    }
}

Core.plugin['Bookmark'].panelSet = function() {
    if (Core.config['bookMarkBtn'] === true) {
        Core.plugin['Bookmark'].setAllBookMarkBtn();
        var sheet = document.createElement('style');
        sheet.innerHTML = ".baha-boonMarkBtn {float:right; border-width:1px; border-color:black;border-style: inset;background-color: #ffffff;padding: 3px; display:none; margin-left: 10px !important; width: 50px; height: 30px;text-align: center; line-height: 30px !important;} .baha-boonMarkBtn:hover {color:red;}";
        document.body.appendChild(sheet);

        $('#allReply' + Core.config['MsgId']).delegate('.baha-boonMarkBtn', 'click', function(event) {
            var chromeBookMarkNameStr = '{"bookmarkName-' + event.target.getAttribute('Msgid') + '":"' + document.getElementsByClassName('msgright')[0].textContent.substr(0, 30) + '"}';
            var chromeBookMarkStr = '{"bookmark-' + event.target.getAttribute('Msgid') + '":"' + event.target.getAttribute('replyid') + '"}';
            var chromeBookMarkArr = JSON.parse(chromeBookMarkStr);
            var chromeBookMarkNameArr = JSON.parse(chromeBookMarkNameStr);
            chrome.storage.local.set(chromeBookMarkArr, function() {});
            chrome.storage.local.set(chromeBookMarkNameArr, function() {
                alert('書籤記錄完成!!');
                document.getElementById(event.target.getAttribute('replyid')).style.backgroundColor = '#D0B7C5';
                Core.config['bookmark-' + event.target.getAttribute('Msgid')] = event.target.getAttribute('replyid');
            });
            chrome.storage.local.get('bookMarkIndex', function(item) {
                var configBookMarkArr = item['bookMarkIndex'];
                if (isEmpty(configBookMarkArr)) {
                    bookMarkIndexArr = new Array(event.target.getAttribute('Msgid') + '-' + event.target.getAttribute('guildId'));
                    chrome.storage.local.set({ bookMarkIndex: bookMarkIndexArr });
                    Core.config['bookMarkIndex'] = configBookMarkArr;
                } else if (configBookMarkArr.indexOf(event.target.getAttribute('Msgid') + '-' + event.target.getAttribute('guildId')) == -1) {
                    configBookMarkArr.push(event.target.getAttribute('Msgid') + '-' + event.target.getAttribute('guildId'));
                    chrome.storage.local.set({ bookMarkIndex: configBookMarkArr });
                    Core.config['bookMarkIndex'] = configBookMarkArr;
                }
            })



        });
    }
    //回朔書籤位置
    if (Core.config['bookmark-' + Core.config['MsgId']] !== undefined) {
        Core.plugin['Bookmark'].bookMarkChangeColor(Core.config['bookmark-' + Core.config['MsgId']]);
    }
}

Core.plugin['Bookmark'].bookMarkChangeColor = function(snid) {
    document.getElementById(snid).style.backgroundColor = '#D0B7C5';
}

Core.pages.get('singleACMsg').events.register('common', Core.plugin['Bookmark'].panelSet);

Core.pages.get('singleACMsg').events.register('reGenerateReply_insertRender', function(replyId, singleReply, tempAllReply) {
    if (Core.config['bookMarkBtn']) {
        Core.plugin['Bookmark'].setBookMarkBtn("r-" + replyId);
    }
});

Core.pages.get('singleACMsg').events.register('reGenerateReply_AfterRender', function() {
    if (Core.config['bookMarkBtn']) {
        Core.plugin['Bookmark'].setAllBookMarkBtn();
    }
});

Core.pages.get('singleACMsg').events.register('reGenerateReply_post', function() {
    if (Core.config['bookmark-' + Core.config['MsgId']] !== undefined) {
        Core.plugin['Bookmark'].bookMarkChangeColor(Core.config['bookmark-' + Core.config['MsgId']]);
    }
});