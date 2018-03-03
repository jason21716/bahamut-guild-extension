Core.plugin['Dice'] = {};

Core.plugin['Dice'].filterRollDice = function(match, var_count, var_size, var_symbol, var_addnum, var_reason, offset, string) {
    var addnumber = (!isNaN(parseInt(var_addnum))) ? parseInt(var_addnum) : 0;
    addnumber *= (var_symbol === '-') ? -1 : 1;

    var dice = {
        user: Core.config['controller'],
        nickname: Core.config['controller'],
        reason: (var_reason.length > 0) ? var_reason : '',
        channel: "Baha_extansion",
        size: (!isNaN(parseInt(var_size))) ? parseInt(var_size) : 1,
        addnumber: addnumber,
        count: (!isNaN(parseInt(var_count))) ? parseInt(var_count) : 1,
        ispool: false,
        isrepeat: true,
        pool: ['']
    }
    $.ajax({
        type: "POST",
        url: "https://www.isaka.idv.tw/dice-api/dice",
        dataType: 'json',
        data: dice,
        success: function(bb) {
            var req = bb.requestData;
            var res = bb.result;
            var str = req.nickname + '(' + req.user + ')的「' + req.reason + '」擲了「' + req.count + ' d ' + req.size + ' ' + ((req.addnumber >= 0) ? ('+ ') : ('')) + req.addnumber + '」 ，擲出「';
            res.record.forEach(function(v, i) {
                str += v;
                if (i < res.record.length - 1)
                    str += '、';
            })
            str += '」，總合為「' + res.total + '」。 (' + new Date().toLocaleString() + ' #' + res.hashcode + ')。';
            document.getElementById('replyMsg' + Core.config['MsgId']).value = str;
            Core.pages.get('singleACMsg').subFunt['checkReplyFix'](Core.config['MsgId'], '#GID' + Core.config['guildId'])
        }
    });
    return '';
}

Core.pages.get('singleACMsg').events.register('checkReplyFix_pre', function(str) {
    str_after = str.replace(/\[\[\s*(\d*)\s*d\s*(\d*)\s*([+-]*)\s*(\d*)\s*\(*([^\)]*)\)*\s*\]\]/i, Core.plugin['Dice'].filterRollDice);
    return (str_after !== str) ? ["[[[checkReplyFix_pre_stop]]]"] : [str];
});