Core.plugin['WordCount'] = {};

Core.plugin['WordCount'].panelSet = function() {
    //增加字數提示訊息，新增監聽事件
    if (Core.config['replyDivWordCount'] === true) {
        var MsgId = Core.config['MsgId'];
        var wordCountDOM = document.createElement("span");
        wordCountDOM.id = 'bahaext-wordCount';
        wordCountDOM.style.color = 'red';
        if (Core.config['singlePostReverse'] === true)
            document.getElementsByClassName('msgitembar')[0].appendChild(wordCountDOM);
        else
            document.getElementById('replyDiv' + MsgId).appendChild(wordCountDOM);
        $("#replyDiv" + MsgId).delegate('#replyMsg' + MsgId, "input", function() {
            var msgBox = document.getElementById('replyMsg' + Core.config['MsgId']);
            var currentWord = Math.round(utf8LengthFix(msgBox.value) / 3)
            if ( currentWord > Core.config['cuttMsgLimit']) {
                if (Core.config['replyDivCutting'] === false) {
                    msgBox.style.borderColor = 'red';
                    msgBox.style.borderWidths = '2pt';
                    msgBox.style.backgroundColor = '#D2B7B7';
                    document.getElementById('bahaext-wordCount').innerHTML = '  已超過字數限制';
                } else {
                    msgBox.style.borderColor = 'red';
                    msgBox.style.borderWidths = '2pt';
                    document.getElementById('bahaext-wordCount').innerHTML = '  已超過一串之字數，將會切串後發送';
                }

            } else {
                msgBox.style.borderColor = '';
                msgBox.style.borderWidths = '';
                msgBox.style.backgroundColor = '';
                var leftWord = Core.config['cuttMsgLimit'] - currentWord;
                document.getElementById('bahaext-wordCount').innerHTML = '  剩餘' + leftWord + '字元';
            }
        });
    }
}

Core.pages.get('singlePost').events.register('common', Core.plugin['WordCount'].panelSet);