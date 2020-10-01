Core.plugin['AutoRefresh'] = {};

Core.plugin['AutoRefresh'].panelset = function() {
    var msgrightDOM = document.getElementsByClassName('msgright')[0];
    var MsgId = Core.config['MsgId']
        //增加定時更新設定欄
    var autoRefreshDivDom = document.createElement('div');
    autoRefreshDivDom.id = 'baha-autoRefreshDiv';
    if (Core.config['singlePostReverse'] === true) {
        document.getElementsByClassName('msgright')[0].insertBefore(autoRefreshDivDom, document.getElementById('allReply' + MsgId));
    } else {
        document.getElementsByClassName('msgright')[0].appendChild(autoRefreshDivDom);
    }

    var mainText = msgrightDOM.textContent;
    var autoRefreshStrDom = document.createElement('p');
    autoRefreshStrDom.innerHTML = '設定自動更新時間(秒，0為取消)：';
    autoRefreshStrDom.style.display = 'inline';
    var autoRefreshInputDom = document.createElement('input');
    autoRefreshInputDom.type = 'text';
    autoRefreshInputDom.id = 'baha-autoRefreshInput';
    autoRefreshInputDom.style.width = '50px';
    autoRefreshInputDom.style.fontSize = '14px';
    autoRefreshInputDom.style.marginLeft = '5px';
    autoRefreshInputDom.style.marginRight = '5px';
    var autoRefreshBtnDom = document.createElement('button');
    autoRefreshBtnDom.innerHTML = '送出';
    autoRefreshBtnDom.id = 'baha-autoRefreshBtn';
    autoRefreshBtnDom.setAttribute('Msgid', MsgId);
    var autoRefreshStr2Dom = document.createElement('p');
    autoRefreshStr2Dom.id = 'baha-autoRefreshStr';
    autoRefreshStr2Dom.innerHTML = '';
    autoRefreshStr2Dom.style.display = 'inline';
    autoRefreshStr2Dom.style.color = 'red';
    autoRefreshStr2Dom.style.marginLeft = '5px';
    var autoRefreshInput2Dom = document.createElement('input');
    autoRefreshInput2Dom.id = 'baha-autoRefreshCheck';
    autoRefreshInput2Dom.type = 'checkbox';
    var autoRefreshStr3Dom = document.createElement('p');
    autoRefreshStr3Dom.innerHTML = '啟動桌面通知功能';
    autoRefreshStr3Dom.style.display = 'inline';
    var autoRefreshInput3Dom = document.createElement('input');
    autoRefreshInput3Dom.id = 'baha-autoRefreshHiSpeedCheck';
    autoRefreshInput3Dom.type = 'checkbox';
    var autoRefreshStr4Dom = document.createElement('p');
    autoRefreshStr4Dom.innerHTML = '啟動長串更新機制';
    autoRefreshStr4Dom.style.display = 'inline';
    var autoRefreshBtn2Dom = document.createElement('button');
    autoRefreshBtn2Dom.innerHTML = '整串手動重整';
    autoRefreshBtn2Dom.id = 'baha-manuelRefreshBtn';
    autoRefreshBtn2Dom.setAttribute('Msgid', MsgId);
    autoRefreshBtn2Dom.style.width = '100px';
    document.getElementById('baha-autoRefreshDiv').appendChild(autoRefreshStrDom);
    document.getElementById('baha-autoRefreshDiv').appendChild(autoRefreshInputDom);
    document.getElementById('baha-autoRefreshDiv').appendChild(autoRefreshBtnDom);
    document.getElementById('baha-autoRefreshDiv').appendChild(autoRefreshStr2Dom);
    document.getElementById('baha-autoRefreshDiv').appendChild(document.createElement('br'));
    document.getElementById('baha-autoRefreshDiv').appendChild(autoRefreshInput2Dom);
    document.getElementById('baha-autoRefreshDiv').appendChild(autoRefreshStr3Dom);
    document.getElementById('baha-autoRefreshDiv').appendChild(autoRefreshInput3Dom);
    document.getElementById('baha-autoRefreshDiv').appendChild(autoRefreshStr4Dom);
    document.getElementById('baha-autoRefreshDiv').appendChild(autoRefreshBtn2Dom);
    document.getElementById('baha-autoRefreshBtn').addEventListener('click', Core.plugin['AutoRefresh'].setAutoRefresh);
    document.getElementById('baha-manuelRefreshBtn').addEventListener('click', function() {
        Core.pages.get('singleACMsg').subFunt['reGenerateReply'](true, new Array(), new Array());
    });
}

Core.plugin['AutoRefresh'].setAutoRefresh = function() {
    var timeStr = document.getElementById('baha-autoRefreshInput').value;
    var timeValue = parseInt(timeStr);
    var setIntervalNumber = 0;
    if (!isNaN(timeValue)) {
        if (timeValue > 0) {
            var cancelNumber = parseInt(document.getElementById('baha-autoRefreshBtn').getAttribute('cancelNumber'));
            if (!isNaN(cancelNumber)) {
                window.clearInterval(cancelNumber);
                document.getElementById('baha-autoRefreshStr').innerHTML = '';
            }
            setIntervalNumber = window.setInterval(Core.plugin['AutoRefresh'].autoRefreshFunt, timeValue * 1000);
            document.getElementById('baha-autoRefreshBtn').setAttribute('cancelNumber', setIntervalNumber);
            document.getElementById('baha-autoRefreshStr').innerHTML = '啟用自動更新中...';

            MSGRE_MAX = -1;
            if (document.getElementById('baha-autoRefreshCheck').checked) {
                MSGRE_NOTIFYID = '';
                MSGRE_MAX = document.getElementById('allReply' + Core.config['MsgId']).childElementCount;
                document.getElementById('baha-autoRefreshStr').innerHTML = '啟用自動更新中...(通知已啟動)';
            }
        } else {
            var cancelNumber = parseInt(document.getElementById('baha-autoRefreshBtn').getAttribute('cancelNumber'));
            if (!isNaN(cancelNumber)) {
                window.clearInterval(cancelNumber);
                document.getElementById('baha-autoRefreshStr').innerHTML = '';
            }
        }
    }

}

Core.plugin['AutoRefresh'].autoRefreshFunt = function() {
    var msgId = Core.config['MsgId'];
    var guildId = Core.config['guildId'];

    $.ajax({
        type: "GET",
        url: "https://guild.gamer.com.tw/singleACMsg.php",
        data: { sn: msgId, gsn: guildId },
        success: function(b) {

            var replySnIdArr = new Array();
            var replyArr = new Array();
            var replyObjArr = new Array();
            var replyArrTemp = b.match(/buildReply\([0-9]+\,\'[^\']+\'\,\'[^\']+\'\,\'[^\']+\'\,\'[^\']+\'\,[^\,]+\,[0-9]+\,[0-9]+\,\'[^\']*\'\)\;/g);

            var stopFlag = false;
            var lastResponseUserId;
            $.each(replyArrTemp, function(i, item) {
                var replyObj = new Array();
                var temp = item.match(/buildReply\(([0-9]+)\,\'([^\']+)\'\,\'([^\']+)\'\,\'([^\']+)\'\,\'([^\']+)\'\,([^\,]+)\,([0-9]+)\,([0-9]+)\,\'[^\']*\'\)\;/);
                replyObj.snID = temp[1];
                replyObj.userID = temp[2];
                replyObj.user = temp[3];
                replyObj.content = temp[4];
                replyObj.time = temp[5];
                replyObj.isSelf = temp[6];
                replyObj.msgID = temp[7];
                replyObj.replyCount = temp[8];
                replyObj.content = replyObj.content.replace(/\&ensp/g, ' ');
                replyObj.content = replyObj.content.replace(/\&emsp/g, '　');

                replyObjArr.push(replyObj);
                lastResponseUserId = replyObj.userID;
            });
            Core.config['lastReplyArr'] = replyObjArr;
            Core.pages.get('singleACMsg').subFunt['reGenerateReply'](false, replyArr, replySnIdArr);

            if (document.getElementById('baha-autoRefreshCheck').checked) {
                var last_check = 0;
                last_check = document.getElementById('allReply' + Core.config['MsgId']).childElementCount;
                if (MSGRE_MAX < last_check && lastResponseUserId != Core.config['controller']) {
                    var text = (Core.config['NEW_TITLE'] != Core.config['ORGINAL_TITLE']) ?
                        '分頁：' + Core.config['NEW_TITLE'] :
                        document.getElementsByClassName('msgright')[0].textContent.substr(0, 20);
                    var number = last_check
                    chrome.runtime.sendMessage({
                        greeting: "nofity",
                        rid: Core.config['MsgId'] + last_check,
                        text: text,
                        num: number,
                        sound: Core.config['notifiSound']
                    })
                    MSGRE_MAX = last_check;
                }
                document.getElementById('baha-autoRefreshStr').innerHTML = '啟用自動更新中...(通知已啟動)';
            } else {
                document.getElementById('baha-autoRefreshStr').innerHTML = '啟用自動更新中...';
            }
        }
    })
}

Core.pages.get('singleACMsg').events.register('common', Core.plugin['AutoRefresh'].panelset);