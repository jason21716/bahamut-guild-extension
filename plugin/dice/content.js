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
            Core.pages.get('singleACMsg').subFunt['cuttingReply'](Core.config['MsgId'], '#GID' + Core.config['guildId'])
        }
    });
    return '';
}

Core.pages.get('singleACMsg').events.register('cuttingReply_pre', function(str) {
    str_after = str.replace(/\[\[\s*(\d*)\s*d\s*(\d*)\s*([+-]*)\s*(\d*)\s*\(*([^\)]*)\)*\s*\]\]/i, Core.plugin['Dice'].filterRollDice);
    return (str_after !== str) ? ["[[[cuttingReply_pre_stop]]]"] : [str];
});
domRightContentBtnDiv.appendChild(rightContentBtnStart);
domRightContentBtnDiv.appendChild(rightContentBtnStop);
domRightContent.appendChild(domRightContentBtnDiv);
$(document.getElementById('BH-slave')).prepend(domRightContent);
$(document.getElementById('BH-slave')).prepend(domRightTitle);
}

Core.plugin['Timer'].timerControl = function(str, limitTime, responseText) {
    switch (str) {
        case 'start':
            document.getElementById('baha-rightTimerTimeBtnStart').disabled = true;
            document.getElementById('baha-rightTimerTimeBtnStop').disabled = false;
            BAHA_TIMER_COUNTI = new Date().getTime();
            BAHA_TIMER_LIMIT_TIME = (!isNaN(parseInt(limitTime))) ? parseInt(limitTime) : -1;
            BAHA_TIMER_TEXT = (responseText.length > 0) ? responseText : '(判定)';

            if (BAHA_TIMER_LIMIT_TIME != -1) {
                document.getElementById('baha-rightTimerTimeStr2').innerHTML = '自動秒判，時間：' + BAHA_TIMER_LIMIT_TIME + '秒';
            } else {
                document.getElementById('baha-rightTimerTimeStr2').innerHTML = '';
            }

            BAHA_TIMER_ID = window.setInterval(function() {
                var time = new Date().getTime() - BAHA_TIMER_COUNTI;

                var elapsed = Math.floor(time / 100) / 10;

                if (BAHA_TIMER_LIMIT_TIME != -1 && elapsed > BAHA_TIMER_LIMIT_TIME) {
                    Core.plugin['Timer'].timerControl('stop');
                    document.getElementById('replyMsg' + Core.config['MsgId']).value = BAHA_TIMER_TEXT;
                    Core.pages.get('singleACMsg').subFunt['cuttingReply'](Core.config['MsgId'], '#GID' + Core.config['guildId'])
                } else {
                    if (Math.round(elapsed) == elapsed) {
                        elapsed += '.0';
                    }
                    document.getElementById('baha-rightTimerTimeStr').innerHTML = '計時中： ' + elapsed + '秒';
                }

            }, 100);
            break;
        case 'stop':
            window.clearInterval(BAHA_TIMER_ID);
            document.getElementById('baha-rightTimerTimeStr').innerHTML = '停止計時';
            document.getElementById('baha-rightTimerTimeStr2').innerHTML = '';
            document.getElementById('baha-rightTimerTimeBtnStart').disabled = false;
            document.getElementById('baha-rightTimerTimeBtnStop').disabled = true;
            break;
    }

}

Core.pages.get('singleACMsg').events.register('common', Core.plugin['Timer'].addRightTimer);

Core.pages.get('singleACMsg').events.register('cuttingReply_pre', function(str) {
    str = str.replace(/\[\[\s*t\s*(\d*)\s*([^\]]*)\s*\]\]/i, function(match, var_time, var_reason, offset, string) {
        Core.plugin['Timer'].timerControl('start', var_time, var_reason);
        return '(' + var_time + '秒判定)';
    });

    return [str];
});