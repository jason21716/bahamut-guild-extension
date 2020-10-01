Core.plugin['CuttingMsg'] = {};

Core.plugin['CuttingMsg'].countLimitFixOnlyNum = function(a) {
    var c = a,
        c = c.replace(/&/g, "&amp;"),
        c = c.replace(/'/g, "&#039;"),
        c = c.replace(/"/g, "&quot;"),
        c = c.replace(/</g, "&lt;"),
        c = c.replace(/>/g, "&gt;"),
        c = c.replace(/\r/g, ""),
        c = c.replace(/\n/g, "<br />");
    return utf8LengthFix(c);
}

Core.plugin['CuttingMsg'].cuttingMsg = function(str) {
    var length = Core.config['cuttMsgLimit'];
    var targetLength = length * 3;
    var strArr = str.match(/[^\r\n]{0,}[\r\n]{0,}/gm);

    var resultArr = [];
    var tempCount = 0;
    var tempStr = "";
    while (strArr.length > 0) {
        var tempPatten = strArr.shift();
        var leng = Core.plugin['CuttingMsg'].countLimitFixOnlyNum(tempPatten);
        if (tempCount + leng <= targetLength) {
            tempStr += tempPatten;
            tempCount += leng;
        } else if (leng <= targetLength) {
            resultArr.push(tempStr);
            tempStr = tempPatten;
            tempCount = leng;
        } else {
            if (tempStr.length > 0) {
                resultArr.push(tempStr);
                tempStr = "";
                tempCount = 0;
            }
            var strSpiltArr = tempPatten.match(/[^，、。\s]{0,}[，、。\s]{0,1}/gm);
            for (var i = strSpiltArr.length - 1; i >= 0; i--) {
                if (Core.plugin['CuttingMsg'].countLimitFixOnlyNum(strSpiltArr[i]) <= targetLength)
                    strArr.unshift(strSpiltArr[i]);
                else {
                    strArr.unshift(strSpiltArr[i].substr(strSpiltArr[i].length / 2 + 1));
                    strArr.unshift(strSpiltArr[i].substr(0, strSpiltArr[i].length / 2));
                }
            }
        }
    }
    resultArr.push(tempStr);
    resultArr.forEach(function(element, index, array) {
        resultArr[index] = element.replace(/[\r\n]{1,}$/g, '');
    });
    return resultArr;
}

Core.pages.get('singlePost').events.register('checkReplyFix', Core.plugin['CuttingMsg'].cuttingMsg);