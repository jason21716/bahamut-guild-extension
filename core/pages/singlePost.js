Core.pages.register(
    'singlePost', {
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

        checkReplyFix_pre: 'cuttingReply_pre',
        checkReplyFix: 'cuttingReply'
    },
    function() {});

Core.pages.get('singlePost').subFunt['reGenerateReply'] = function(flag, replyArr, replySnIdArr) {

    Core.pages.get('singlePost').events.exec('reGenerateReply_pre');

    $.each(Core.config['lastReplyArr'], function(i, item) {
        var arr = [];
        arr[0] = true;
        arr[1] = i;
        arr[2] = item;

        arr = Core.pages.get('singlePost').events.execArgs('reGenerateReply_decideOutput', arr);

        var printFlag = arr[0];
        i = arr[1];
        item = arr[2];

        if (printFlag) {
            replyArr.push(item);
            replySnIdArr.push(item.id);
            try {
                document.getElementById('baha-userList-' + item.userid).style.fontWeight = 'bold';
                document.getElementById('baha-userList-' + item.userid).style.color = 'blue';
            } catch (e) {
                Core.plugin['ReplyDisplayConfig'].resetUserList(Core.config['lastReplyArr']);
                document.getElementById('baha-userList-' + item.userid).style.fontWeight = 'bold';
                document.getElementById('baha-userList-' + item.userid).style.color = 'blue';
            }

        }


    });
    console.log("reGenerateReply_decideOutput")
    console.log(replyArr)

    if (flag) {
        var arr = [];
        arr[0] = replyArr;
        replyArr = Core.pages.get('singlePost').events.execArgs('reGenerateReply_beforeRender', arr)[0];

        let htmlCode = commentListLayout(Core.config['guildId'], Core.config['MsgId'], replyArr, 1);
        jQuery(`#readMoreComments-${Core.config['MsgId']}`).remove();
        jQuery(`#allReply${Core.config['MsgId']}`).html(htmlCode);

        Core.pages.get('singlePost').events.exec('reGenerateReply_AfterRender');

    } else {
        //從這裡開始改
        var tempAllReply = document.getElementById('allReply' + Core.config['MsgId']);

        var arr = [];
        arr[0] = replyArr;
        replyArr = Core.pages.get('singlePost').events.execArgs('reGenerateReply_insertRender_pre', arr)[0];

        for (i = 0; i < replySnIdArr.length; i++) {
            if ($("#r-" + replySnIdArr[i]).length == 0) {

                var singleReply = buildReplyFix(replyArr[i].snID, replyArr[i].userID, replyArr[i].user, replyArr[i].content, replyArr[i].time, replyArr[i].isSelf, replyArr[i].msgID, replyArr[i].replyCount, '');
                var singleReply = commentLayout(Core.config['MsgId'], replyArr[i].id, replyArr[i].text, i) 
                var arr = [replySnIdArr[i], singleReply, tempAllReply];

                if (Core.config['singlePostReverse']) {
                    tempAllReply.insertBefore(htmlToElement(singleReply), tempAllReply.firstChild);
                } else {
                    tempAllReply.appendChild(htmlToElement(singleReply));
                }

                Core.pages.get('singlePost').events.execArgs('reGenerateReply_insertRender', arr);
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
    Core.pages.get('singlePost').events.exec('reGenerateReply_post');

}

Core.pages.get('singlePost').subFunt['generateReplyObjArr'] = function(gsn, messageId) {
    $.ajax({
        url: globalConfig.apiRoot + '/v1/comment_list_legacy.php',
        method: 'GET',
        data: {
            gsn: gsn,
            messageId: messageId,
        },
        xhrFields: {
            withCredentials: true
        }
   })
   .done((res)=>{Core.config['lastReplyArr'] = res.data.comments})
}

Core.pages.get('singlePost').subFunt['commentNewFix'] = function(gsn, messageId) {
    let text = jQuery('#replyMsg' + messageId);
    let btn = jQuery('#bahaext-replyBtn' + messageId)
    let content = text.val();
    if (content.match(/^\s*$/)) {
        alert('留言不能空白!');
        return;
    }

    if (btn.prop('disabled')) {
        alert('處理中請稍候!');
        return;
    }

    var msg_arr = [];
    msg_arr[0] = content;

    msg_arr = Core.pages.get('singlePost').events.execArgs('cuttingReply_pre', msg_arr);
    var checkStr = msg_arr[0];

    if (checkStr === "[[[cuttingReply_pre_stop]]]")
        return;

    msg_arr = Core.pages.get('singlePost').events.execArgs('cuttingReply', msg_arr);

    text.val('');

    Core.pages.get('singlePost').subFunt['UploadReplyRecursive'](gsn, messageId, msg_arr, 0)
}

Core.pages.get('singlePost').subFunt['UploadReplyRecursive'] = function(gsn, messageId, msgarr, index) {
    console.log(msgarr)

    if (msgarr.length == index) {
        Core.pages.get('singlePost').subFunt['generateReplyObjArr'](gsn, messageId)
        return;
    }


    let csrf = new Bahamut.Csrf();
    csrf.setCookie();

    let btn = jQuery('#bahaext-replyBtn' + messageId)
    btn.prop('disabled', true);
    jQuery.ajax({
        url: globalConfig.apiRoot + '/v1/comment_new.php',
        method: 'POST',
        headers: csrf.getJqueryHeaders(),
        data: {
            gsn: gsn,
            messageId: messageId,
            legacy: 1,
            content: msgarr[index]
        },
        xhrFields: {
            withCredentials: true
        }
    }).done(function(result) {
        btn.prop('disabled', false);
        if (result.error) {
            alert(result.error.message);
            return;
        }


        let commentData = {
            id: result.data.commentId,
            time: result.data.time,
            text: result.data.contxt,
            mentions: result.data.mention,
            userid: Cookies.get('BAHAID'),
            name: Cookies.get('BAHANICK')
        };

        commentNewUpdateLayout(gsn, messageId, commentData);

        if (msgarr.length > 1) {
            Core.pages.get('singlePost').subFunt['UploadReplyRecursive'](gsn, messageId, msgarr, index + 1)
        }
    });
}

Core.pages.get('singlePost').subFunt['enterkeyFix'] = function(e, obj, type, sn, mainOwner, gsn) {
    e = window.event || e;
    var code = (isIE()) ? e.keyCode : e.which;
    var limit = ('main' == type) ? 600 : 85;
    if (13 == code && !e.shiftKey) {
        if ('main' == type) postNew();
        else Core.pages.get('singlePost').subFunt['commentNewFix'](gsn, sn);
        //取消換行這個操作
        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;
    } else {
        countLimit(obj, limit);
        if (obj.clientHeight < obj.scrollHeight) {
            obj.style.height = obj.scrollHeight + 'px';
        }
    }
}

Core.pages.get('singlePost').mainEvent = function() {

    new Promise((resolve, reject) => {
        console.log('Initial');

        //抓取MsgId、guildId
        var singleACMsgParme = null;
        var sn_regex = /[\?&]sn=(\d*)/;
        var sn_match = Core.config['pageName'][1].match(sn_regex);
        var gsn_regex = /[\?&]gsn=(\d*)/;
        var gsn_match = Core.config['pageName'][1].match(gsn_regex);
        if (typeof sn_match != "undefined" && null != sn_match && typeof gsn_match != "undefined" && null != gsn_match ) {
            singleACMsgParme = new Array(sn_match[1], gsn_match[1]);
        }
        console.log(singleACMsgParme)
        var MsgId = singleACMsgParme[0];
        var guildId = singleACMsgParme[1];
        Core.config['MsgId'] = MsgId;
        Core.config['guildId'] = guildId;
    
        resolve();
    }).then((resolve, reject) => {
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
        Core.config['controller'] = msgController;
        return Promise.resolve();
    }).then((resolve, reject) => {
        return $.ajax({
            url: globalConfig.apiRoot + '/v1/comment_list_legacy.php',
            method: 'GET',
            data: {
                gsn: Core.config['guildId'],
                messageId: Core.config['MsgId'],
            },
            xhrFields: {
                withCredentials: true
            }
       })
    }).then((resolve, reject) => {
        Core.config['lastReplyArr'] = resolve.data.comments
        return Promise.resolve();
    }).then((resolve, reject) => {
        this.events.exec('common');
        return Promise.resolve();
    }).then((resolve, reject) => {
        this.events.exec('before_rebuild');
        return Promise.resolve();
    }).then((resolve, reject) => {
        //改寫送出按鍵與replyMsg中keypress事件，解決疊樓異常問題
        var replyBtnDOM = document.createElement("button");
        var MsgId = Core.config['MsgId']
        replyBtnDOM.id = 'bahaext-replyBtn' + MsgId;
        replyBtnDOM.innerHTML = '叭啦';
        document.getElementById('replyDiv' + MsgId).removeChild(document.getElementById('replyBtn' + MsgId));
        document.getElementById('replyDiv' + MsgId).appendChild(replyBtnDOM);
        return Promise.resolve();
    }).then((resolve, reject) => {
        //重建replyMsg，清除先前的onkeypress事件
        var MsgId = Core.config['MsgId']
        document.getElementById('replyDiv' + MsgId).removeChild(document.getElementById('replyMsg' + MsgId));
        var BH_replyDiv_DOM = document.createElement("textarea");
        BH_replyDiv_DOM.id = 'replyMsg' + MsgId;
        BH_replyDiv_DOM.setAttribute("rows", "1");
        document.getElementById('replyDiv' + MsgId).insertBefore(BH_replyDiv_DOM, document.getElementById('emo' + MsgId));
        return Promise.resolve();
    }).then((resolve, reject) => {
        var MsgId = Core.config['MsgId'];
        var guildId = Core.config['guildId']
        var funBtn = function(id, gid) { return function() { Core.pages.get('singlePost').subFunt['commentNewFix'](guildId, MsgId); }; };
        var funMsg = function(e, obj) { return function() { Core.pages.get('singlePost').subFunt['enterkeyFix'](e, obj, 'reply', MsgId, Core.config['controller'], guildId); }; };

        document.getElementById('bahaext-replyBtn' + MsgId).addEventListener("click", funBtn(MsgId, guildId));
        document.getElementById('replyMsg' + MsgId).addEventListener("keypress", funMsg(event, document.getElementById('replyMsg' + MsgId)));
        return Promise.resolve();
    }).then((resolve, reject) => {
        this.events.exec('after_rebuild');
        return Promise.resolve();
    })
}