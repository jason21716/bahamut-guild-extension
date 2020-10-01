  
Core.plugin['keepMessage'] = {};

Core.plugin['keepMessage'].lastMessage = '';

Core.plugin['keepMessage'].loadMessage = function(key, options) {
    var MsgId = Core.config['MsgId'];
    document.getElementById('replyMsg' + MsgId).value = Core.plugin['keepMessage'].lastMessage;
}

Core.plugin['keepMessage'].recordMessage = function(str) {
    console.log('recored:' + str);
    Core.plugin['keepMessage'].lastMessage = str;
    return [str];
}

Core.pages.get('singlePost').events.register('checkReplyFix_pre', Core.plugin['keepMessage'].recordMessage);