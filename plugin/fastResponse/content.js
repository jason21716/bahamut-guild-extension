Core.plugin['FastResponse'] = {};
Core.plugin['FastResponse'].panelSetting = function() {
    var MsgId = Core.config['MsgId'];
    document.getElementById('replyDiv' + MsgId).className = 'context-menu-replyDiv';
    $(function() {
        $.contextMenu({
            selector: '.context-menu-replyDiv',
            callback: function(key, options) {
                Core.plugin['FastResponse'].fastResponseFunt(MsgId, Core.config[key]);
            },
            items: {
                "clean": {
                    "name": "清空內容",
                    "icon": function($element, key, item) { return 'context-menu-icon context-menu-icon-quit'; },
                    "callback": function(key, options) {
                        document.getElementById('replyMsg' + MsgId).value = '';
                        document.getElementById('replyMsg' + MsgId).focus();
                    }
                },
                "fastResponse": {
                    "name": "快速回覆...",
                    "icon": "edit",
                    "items": {
                        "fastResponse1": { "name": Core.config['fastResponse1name'] },
                        "fastResponse2": { "name": Core.config['fastResponse2name'] },
                        "fastResponse3": { "name": Core.config['fastResponse3name'] },
                        "fastResponse4": { "name": Core.config['fastResponse4name'] },
                        "fastResponse5": { "name": Core.config['fastResponse5name'] },
                        "fastResponse6": { "name": Core.config['fastResponse6name'] },
                        "fastResponse7": { "name": Core.config['fastResponse7name'] },
                        "fastResponse8": { "name": Core.config['fastResponse8name'] }
                    }
                }
            }
        });
    });

    //新增監聽Mmessage事件
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log('message received:' + request.message + ' /' + request.text);
        if (request.message == "fastResponse") {
            Core.plugin['FastResponse'].fastResponseFunt(MsgId, request.text);
        }
    });
}

Core.plugin['FastResponse'].fastResponseFunt = function(snid, text) {
    document.getElementById('replyMsg' + snid).value += text;
    document.getElementById('replyMsg' + snid).focus();
}

Core.pages.get('singleACMsg').events.register('common', Core.plugin['FastResponse'].panelSetting);