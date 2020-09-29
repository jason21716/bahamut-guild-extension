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

Core.pages.get('singlePost').subFunt['generateReplyObjArr'] = function(gsn, messageId) {
    jQuery.ajax({
        url: globalConfig.apiRoot + '/v1/comment_list_legacy.php',
        method: 'GET',
        data: {
            gsn: gsn,
            messageId: messageId,
        },
        xhrFields: {
            withCredentials: true
        }
    }).done(function(result) {
        Core.config['lastReplyArr'] = result.data.comments
    })
}

//v1/comment_list_legacy.php?gsn=4158&messageId=13025565

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

    Core.pages.get('singlePost').subFunt['UploadReplyRecursive'](gsn, messageId, msg_arr, 0)
}

Core.pages.get('singlePost').subFunt['UploadReplyRecursive'] = function(gsn, messageId, msgarr, index) {
    if (msgarr.length == index)
        return;

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

        text.val('');
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

    this.subFunt['generateReplyObjArr'](Core.config['guildId'], Core.config['MsgId']);

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

    var funBtn = function(id, gid) { return function() { Core.pages.get('singlePost').subFunt['commentNewFix'](guildId, MsgId); }; };
    var funMsg = function(e, obj) { return function() { Core.pages.get('singlePost').subFunt['enterkeyFix'](e, obj, 'reply', MsgId, msgController, guildId); }; };

    document.getElementById('bahaext-replyBtn' + MsgId).addEventListener("click", funBtn(MsgId, guildId));
    document.getElementById('replyMsg' + MsgId).addEventListener("keypress", funMsg(event, document.getElementById('replyMsg' + MsgId)));

    this.events.exec('after_rebuild');
}