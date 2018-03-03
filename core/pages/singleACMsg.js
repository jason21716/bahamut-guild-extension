Core.pages.register(
    'singleACMsg', {
        common: 'common',

        before_rebuild: 'before_rebuild',
        after_rebuild: 'after_rebuild',

        reGenerateReply_pre: 'reGenerateReply_pre',

        reGenerateReply_decideOutput: 'reGenerateReply_decideOutput',
        reGenerateReply_beforeRender: 'reGenerateReply_beforeRender',
        reGenerateReply_AfterRender: 'reGenerateReply_AfterRender',

        reGenerateReply_beforeinsertRender: 'reGenerateReply_insertRender_pre',
        reGenerateReply_insertRender: 'reGenerateReply_insertRender',
        reGenerateReply_beforeinsertRender: 'reGenerateReply_insertRender_post',

        reGenerateReply_post: 'reGenerateReply_post',

        checkReplyFix_pre: 'checkReplyFix_pre'
    },
    function() {});

Core.pages.get('singleACMsg').subFunt['generateReplyObjArr'] = function(html) {
    var replyArrTemp = html.match(/buildReply\([0-9]+\,\'[^\']+\'\,\'[^\']+\'\,\'[^\']+\'\,\'[^\']+\'\,[^\,]+\,[0-9]+\,[0-9]+\,\'[^\']*\'\)\;/g);
    var replyArr = new Array();
    var stopFlag = false;
    var lastResponseUserId;
    try {
        if (replyArrTemp.length != 0)
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
                replyArr.push(replyObj);
            });
    } catch (e) {

    } finally {

    }
    return replyArr;
}

Core.pages.get('singleACMsg').subFunt['reGenerateReply'] = function(flag, replyArr, replySnIdArr) {

    Core.pages.get('singleACMsg').events.exec('reGenerateReply_pre');

    $.each(Core.config['lastReplyArr'], function(i, item) {
        var arr = [];
        arr[0] = true;
        arr[1] = i;
        arr[2] = item;

        arr = Core.pages.get('singleACMsg').events.execArgs('reGenerateReply_decideOutput', arr);

        var printFlag = arr[0];
        i = arr[1];
        item = arr[2];

        if (printFlag) {
            replyArr.push(item);
            replySnIdArr.push(item.snID);
            try {
                document.getElementById('baha-userList-' + item.userID).style.fontWeight = 'bold';
                document.getElementById('baha-userList-' + item.userID).style.color = 'blue';
            } catch (e) {
                Core.plugin['ReplyDisplayConfig'].resetUserList(Core.config['lastReplyArr']);
                document.getElementById('baha-userList-' + item.userID).style.fontWeight = 'bold';
                document.getElementById('baha-userList-' + item.userID).style.color = 'blue';
            }

        }


    });

    if (flag) {
        var arr = [];
        arr[0] = replyArr;
        replyArr = Core.pages.get('singleACMsg').events.execArgs('reGenerateReply_beforeRender', arr)[0];

        var tempAllReplyHTML = '';
        for (i = 0; i < replyArr.length; i++) {
            var singleReply = buildReplyFix(replyArr[i].snID, replyArr[i].userID, replyArr[i].user, replyArr[i].content, replyArr[i].time, replyArr[i].isSelf, replyArr[i].msgID, replyArr[i].replyCount, '');
            tempAllReplyHTML += singleReply;
        }
        document.getElementById('allReply' + Core.config['MsgId']).innerHTML = tempAllReplyHTML;
        for (i = 0; i < replySnIdArr.length; i++) {
            Util.ChangeText("r-" + replySnIdArr[i], Util.ChangeText.FLAG_BALA);
        }
        Core.pages.get('singleACMsg').events.exec('reGenerateReply_AfterRender');

    } else {
        var tempAllReply = document.getElementById('allReply' + Core.config['MsgId']);

        var arr = [];
        arr[0] = replyArr;
        replyArr = Core.pages.get('singleACMsg').events.execArgs('reGenerateReply_insertRender_pre', arr)[0];

        for (i = 0; i < replySnIdArr.length; i++) {
            if ($("#r-" + replySnIdArr[i]).length == 0) {

                var singleReply = buildReplyFix(replyArr[i].snID, replyArr[i].userID, replyArr[i].user, replyArr[i].content, replyArr[i].time, replyArr[i].isSelf, replyArr[i].msgID, replyArr[i].replyCount, '');

                var arr = [replySnIdArr[i], singleReply, tempAllReply];

                if (Core.config['singleACMsgReverse']) {
                    tempAllReply.insertBefore(htmlToElement(singleReply), tempAllReply.firstChild);
                } else {
                    tempAllReply.appendChild(htmlToElement(singleReply));
                }

                Core.pages.get('singleACMsg').events.execArgs('reGenerateReply_insertRender', arr);

                Util.ChangeText("r-" + replySnIdArr[i], Util.ChangeText.FLAG_BALA);
            }
        }

        var replyMsgHistoryArr = document.getElementsByClassName('msgreport');
        for (i = 0; i < replyMsgHistoryArr.length; i++) {
            var checkingReplyId = replyMsgHistoryArr[i].id.substr(2);
            var replyIndex = replySnIdArr.indexOf(checkingReplyId)
            if (replyIndex == -1) {
                document.getElementById('allReply' + Core.config['MsgId']).removeChild(document.getElementById('r-' + checkingReplyId));
            } else if (!Core.plugin['HighSpeed'].flag) {
                var targetObj = replyArr[replyIndex];
                var tempTime = targetObj.time;
                var tempCount = targetObj.replyCount;
                $('#r-' + checkingReplyId + ' .ST1:eq(0)').html(tempTime);
                $('#r-' + checkingReplyId + ' .ST1:eq(1)').html('#' + tempCount);
            }
        }

    }
    Core.pages.get('singleACMsg').events.exec('reGenerateReply_post');

}

Core.pages.get('singleACMsg').subFunt['enterkeyFix'] = function(a, b, c, d, f) {
    a = window.event || a;
    var g = (navigator.appName == "Microsoft Internet Explorer") ? a.keyCode : a.which,
        e = "main" == c ? 600 : 85;
    (13 == g) ?
    ((a.shiftKey) ?
        (countLimitFix2(b, e),
            b.clientHeight < b.scrollHeight && (b.style.height = b.scrollHeight + "px")
        ) :
        ("main" == c ?
            checkMsg() :
            Core.pages.get('singleACMsg').subFunt['checkReplyFix'](d, f),
            a.preventDefault ?
            a.preventDefault() :
            a.returnValue = !1)) :
    (countLimitFix2(b, e),
        b.clientHeight < b.scrollHeight && (b.style.height = b.scrollHeight + "px")
    );
}

Core.pages.get('singleACMsg').subFunt['checkReplyFix'] = function(a, b) {
    var c = document.getElementById("replyMsg" + a),
        d = c.value;

    var arr = [];
    arr[0] = d;

    arr = Core.pages.get('singleACMsg').events.execArgs('checkReplyFix_pre', arr);
    c.value = arr[0];

    if (c.value === "[[[checkReplyFix_pre_stop]]]")
        return;

    var letterCount = countLimitFix2(c, 85);
    var postArr = [];


    if (letterCount && Core.config['replyDivCutting'])
        postArr = Core.plugin['CuttingMsg'].cuttingMsg(c.value, 85);
    else
        postArr.push(c.value);

    ("" == d.replace(/(^\s*)|(\s*$)/g, "") ? (alert("\u8acb\u8f38\u5165\u7559\u8a00"),
        c.focus()) : document.getElementById("bahaext-replyBtn" + a).disabled ? alert("\u8655\u7406\u4e2d\uff0c\u8acb\u7a0d\u5019") : (document.getElementById("bahaext-replyBtn" + a).disabled = !0,
        Core.pages.get('singleACMsg').subFunt['uploadRecursion'](postArr, 0, a, b)
    ))
}

Core.pages.get('singleACMsg').subFunt['uploadRecursion'] = function(arr, index, a, b) {
    if (arr.length == index)
        return;
    $.ajax({
        type: "POST",
        url: "/ajax/comment.php",
        data: { a: 'A', s: a, c: arr[index], u: b },
        success: function(t) {
            showActiveDivFix("allReply" + a, t);
            Core.pages.get('singleACMsg').subFunt['uploadRecursion'](arr, index + 1, a, b);
        }
    });
}

Core.pages.get('singleACMsg').mainEvent = function() {
    //抓取MsgId、guildId
    var singleACMsgParme = null;
    var regex = /\?sn=([^\/]*)\&gsn\=([^\/]*)/;
    var match = Core.config['pageName'][1].match(regex);
    if (typeof match != "undefined" && null != match) {
        singleACMsgParme = new Array(match[1], match[2]);
    }
    var MsgId = singleACMsgParme[0];
    var guildId = singleACMsgParme[1];
    Core.config['MsgId'] = MsgId;
    Core.config['guildId'] = guildId;

    //確認是否為該串擁有者
    var msgrightDOM = document.getElementsByClassName('msgright')[0];
    var msgControllerDOM = msgrightDOM.getElementsByTagName('a')[0];
    var isOwner;
    if (msgControllerDOM.textContent == '刪除') {
        isOwner = true;
        Core.config['isOwner'] = isOwner;
    } else {
        var msgControllerDOMMatch = msgControllerDOM.href.match(/https\:\/\/home\.gamer\.com\.tw\/home\.php\?owner\=([a-z A-Z 0-9]*)/);
        var msgController = msgControllerDOMMatch[1];
        isOwner = false;
    }
    Core.config['isOwner'] = isOwner;

    Core.config['lastReplyArr'] = this.subFunt['generateReplyObjArr'](document.documentElement.innerHTML);

    this.events.exec('common');

    this.events.exec('before_rebuild');
    //改寫送出按鍵與replyMsg中keypress事件，解決疊樓異常問題
    var replyBtnDOM = document.createElement("button");
    replyBtnDOM.id = 'bahaext-replyBtn' + MsgId;
    replyBtnDOM.innerHTML = '叭啦';
    document.getElementById('replyDiv' + MsgId).removeChild(document.getElementById('replyBtn' + MsgId));
    document.getElementById('replyDiv' + MsgId).appendChild(replyBtnDOM);

    //重建replyMsg，清除先前的onkeypress事件
    document.getElementById('replyDiv' + MsgId).removeChild(document.getElementById('replyMsg' + MsgId));
    var BH_replyDiv_DOM = document.createElement("textarea");
    BH_replyDiv_DOM.id = 'replyMsg' + MsgId;
    BH_replyDiv_DOM.setAttribute("rows", "1");
    document.getElementById('replyDiv' + MsgId).insertBefore(BH_replyDiv_DOM, document.getElementById('emo' + MsgId));

    var funBtn = function(id, gid) { return function() { Core.pages.get('singleACMsg').subFunt['checkReplyFix'](id, '#GID' + gid); }; };
    var funMsg = function(e, a, id, gid) { return function() { Core.pages.get('singleACMsg').subFunt['enterkeyFix'](e, a, 'reply', id, '#GID' + gid); }; };

    document.getElementById('bahaext-replyBtn' + MsgId).addEventListener("click", funBtn(MsgId, guildId));
    document.getElementById('replyMsg' + MsgId).addEventListener("keypress", funMsg(event, document.getElementById('replyMsg' + MsgId), MsgId, guildId));

    this.events.exec('after_rebuild');
}