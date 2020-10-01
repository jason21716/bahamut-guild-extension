Core.plugin['Timer'] = {};

Core.plugin['Timer'].addRightTimer = function() {
    var domRightTitle = document.createElement("h5");
    domRightTitle.innerHTML = '計時器';
    domRightTitle.id = 'baha-rightTimerTitle';

    var domRightContent = document.createElement("div");
    domRightContent.className = 'BH-rbox MSG-list5';
    domRightContent.id = 'baha-rightTimerContent';

    var rightContentHeader = document.createElement("p");
    rightContentHeader.innerHTML = '計時器預備中...';
    rightContentHeader.id = 'baha-rightTimerTimeStr';

    var rightContentHeader2 = document.createElement("p");
    rightContentHeader2.innerHTML = '';
    rightContentHeader2.id = 'baha-rightTimerTimeStr2';

    var domRightContentBtnDiv = document.createElement("div");
    domRightContentBtnDiv.className = 'BH-slave_more';

    var rightContentBtnStart = document.createElement("button");
    rightContentBtnStart.innerHTML = '開始';
    rightContentBtnStart.id = 'baha-rightTimerTimeBtnStart';

    var rightContentBtnStop = document.createElement("button");
    rightContentBtnStop.innerHTML = '停止';
    rightContentBtnStop.disabled = true;
    rightContentBtnStop.id = 'baha-rightTimerTimeBtnStop';

    BAHA_TIMER_COUNTI = new Date().getTime();
    BAHA_TIMER_ID = 0;
    rightContentBtnStart.addEventListener("click", function(e) {
        Core.plugin['Timer'].timerControl('start', -1, '');
    });

    rightContentBtnStop.addEventListener("click", function(e) {
        Core.plugin['Timer'].timerControl('stop', -1, '');
    });

    domRightContent.appendChild(rightContentHeader);
    domRightContent.appendChild(rightContentHeader2);
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
                    Core.pages.get('singlePost').subFunt['commentNewFix'](Core.config['guildId'], Core.config['MsgId'])
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

Core.pages.get('singlePost').events.register('common', Core.plugin['Timer'].addRightTimer);

Core.pages.get('singlePost').events.register('checkReplyFix_pre', function(str) {
    str = str.replace(/\[\[\s*t\s*(\d*)\s*([^\]]*)\s*\]\]/i, function(match, var_time, var_reason, offset, string) {
        Core.plugin['Timer'].timerControl('start', var_time, var_reason);
        return '(' + var_time + '秒判定)';
    });

    return [str];
});