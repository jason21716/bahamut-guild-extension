function countLimit(txt, limit) {
    var value = txt.value;

    value = value.replace(/&/g, "&amp;");
    value = value.replace(/'/g, "&#039;");
    value = value.replace(/"/g, "&quot;");
    value = value.replace(/</g, "&lt;");
    value = value.replace(/>/g, "&gt;");
    value = value.replace(/\r/g, "");
    value = value.replace(/\n/g, "<br />");

    if (value.utf8Length() > limit * 3) {
        alert('字數超過' + limit + '個字了喔～');
        return ture;
    }

    return false;
}

function commentListLayout(gsn, messageId, comments, page) {
    let htmlCode = '';
    let commentNum = (page - 1) * 15 + 1;
    comments.forEach(comment => {
        htmlCode += commentLayout(gsn, messageId, comment, commentNum++);
    });
    return htmlCode;
}

function commentLayout(gsn, postId, comment, num) {
    let htmlcode = '<div id="r-' + comment.id + '" name="r-' + comment.id + '" class="msgreport BC2">';

    let isPoster = comment.userid.toLowerCase() === getCookie('BAHAID').toLowerCase();
    if (globalConfig.perm.delete || isPoster) {
        htmlcode += '<a href="javascript:commentDelete(' + gsn + ',' + postId + ',' + comment.id + ')" class="msgdel AB1">刪除</a>';
    }

    htmlcode += '<a href="https://home.gamer.com.tw/home.php?owner=' + comment.userid + '" target="_blank"><img data-gamercard-userid="' + comment.userid + '" data-src="' + getAvatarPic(comment.userid) + '" class="msghead lazyload gamercard" /></a>'
    htmlcode += '<div><a href="http://home.gamer.com.tw/home.php?owner=' + comment.userid + '" class="msgname AT1">' + comment.name + '</a>：';
    htmlcode += balaUrlTransform(balaMentionTransform(comment.text, comment.mentions));
    htmlcode += '<span><a href="javascript:void(0)" onclick="iWantReply(' + postId + ',1,\'' + comment.userid + '\',\'' + comment.name + '\')" title="回覆他"><img src="https://i2.bahamut.com.tw/spacer.gif" class="IMG-E26" /></a></span><span class="ST1">' + comment.time + '</span><span class="ST1">#' + num + '</span></div>';
    htmlcode += '</div>';

    return htmlcode;
}

function balaUrlTransform(balaText) {
    str = balaText;
    attrSrc = 'data-src';
    attrClass = 'class="lazyload" ';
    attrStyle = 'style="max-width:120px;max-height:120px;" '
    lineBreak = '<br>';

    // tag 內本身的 url (https:// 都會先被換成 bttps:// 避免重複被替換)
    str = str.replace(/(<[^>]*)h(ttp[s]{0,1}:\/\/[^>]*>)/gi, '$1b$2');

    // 轉換 youtube 參數
    str = str.replace(/&amp;start/g, '&start');
    str = str.replace(/&amp;list/g, '&list');

    // 替換 youtube
    str = str.replace(/\[https?:\/\/www\.youtube\.com\/watch\?v=([0-9a-zA-Z_-]{11})(&start=[\d]+)?\]\(https?:\/\/www\.youtube\.com\/watch\?v=[0-9a-zA-Z_-]{11}(?:&start=[\d]+)?\)/gi, '<p style=" display:block; width:138px; height:77px; position:relative; background:url(bttps://i1.ytimg.com/vi/$1/default.jpg) no-repeat center center;" onclick="$(this).html(\'<iframe width=450 height=253 src=bttps://www.youtube.com/embed/$1?autoplay=1&$2 frameborder=0 allowfullscreen></iframe>\');$(this).css(\'width\',\'450px\');$(this).css(\'height\',\'253px\');"><img src="bttps://i2.bahamut.com.tw/icon_videoplayer.svg" style="cursor: pointer; position: absolute; top:50%; left: 50%; width: 30%; max-height: 50%; transform: translate(-50%, -50%);"></p>');
    str = str.replace(/\[https?:\/\/youtu\.be\/([0-9a-zA-Z_-]{11})(?:\?(start=[\d]+))?\]\(https?:\/\/youtu\.be\/[0-9a-zA-Z_-]{11}(?:\?(start=[\d]+))?\)/gi, '<p style=" display:block; width:138px; height:77px; position: relative; background:url(bttps://i1.ytimg.com/vi/$1/default.jpg) no-repeat center center;" onclick="$(this).html(\'<iframe width=450 height=253 src=bttps://www.youtube.com/embed/$1?autoplay=1&$2 frameborder=0 allowfullscreen></iframe>\');$(this).css(\'width\',\'450px\');$(this).css(\'height\',\'253px\');"><img src="bttps://i2.bahamut.com.tw/icon_videoplayer.svg" style="cursor: pointer; position: absolute; top:50%; left: 50%; width: 30%; max-height: 50%; transform: translate(-50%, -50%);"></p>');

    // 替換 facebook
    str = str.replace(/\[h(ttps?:\/\/www\.facebook\.com\/(\w+)\/videos\/(\d+)\/)\]\(https?:\/\/www\.facebook\.com\/\w+\/videos\/\d+\/\)/gi, '<p style=" display:block; width:138px; height:77px; position: relative; background:url(bttps://graph.facebook.com/$3/picture) no-repeat center center;" onclick="$(this).html(\'<iframe src=bttps://www.facebook.com/plugins/video.php?autoplay=true&href=b$1&width=450&show_text=false&height=253&appId width=450 height=253 style=border:none;overflow:hidden scrolling=no frameborder=0 allowTransparency=true allow=encrypted-media allowFullScreen=true></iframe>\');$(this).css(\'width\',\'450px\');$(this).css(\'height\',\'253px\');"><img src="bttps://i2.bahamut.com.tw/icon_videoplayer.svg" style="cursor: pointer; position: absolute; top:50%; left: 50%; width: 30%; max-height: 50%; transform: translate(-50%, -50%);"></p>');

    // 替換 nico
    str = str.replace(/\[https?:\/\/(?:www|tw)\.nicovideo\.jp\/watch\/((?:sm|nm|ca|cd|ax|yo|nl|ig|na|cw|za|zb|zc|zd|ze|om|sk|yk|so|am|fz)[0-9]{1,14}|[0-9]{10})\]\(https?:\/\/(?:www|tw)\.nicovideo\.jp\/watch\/(?:(?:sm|nm|ca|cd|ax|yo|nl|ig|na|cw|za|zb|zc|zd|ze|om|sk|yk|so|am|fz)[0-9]{1,14}|[0-9]{10})\)/g, function(match, m1) {
        return '<p style=" display:block; width:138px; height:77px; position: relative; background:url(bttp://tn-skr3.smilevideo.jp/smile?i=' + m1.replace(/sm|nm|ca|cd|ax|yo|nl|ig|na|cw|za|zb|zc|zd|ze|om|sk|yk|so|am|fz/, "") + ') no-repeat center center;" onclick="$(this).html(\'<iframe width=450 height=253 src=bttps://embed.nicovideo.jp/watch/' + m1 + ' frameborder=0 allowfullscreen></iframe>\');$(this).css(\'width\',\'450px\');$(this).css(\'height\',\'253px\');"><img src="bttps://i2.bahamut.com.tw/icon_videoplayer.svg" style="width: 30px; cursor: pointer; position: absolute; top:50%; left: 50%; width: 30%; max-height: 50%; transform: translate(-50%, -50%);"></p>'
    });

    // 替換站上表情圖
    str = str.replace(/!\[\]\(h(ttps:\/\/i2\.bahamut\.com\.tw\/editor\/emotion\/[0-9]{1,2}\.gif)\)/gi, function(match, subMatch) {
        return `<img ${attrClass}${attrSrc}="b${subMatch}">`;
    });

    // 替換公會表情圖
    str = str.replace(/!\[\]\(h(ttps:\/\/p2\.bahamut\.com\.tw\/B\/GUILD\/e\/[0-9]\/[0-9]+_[a-fA-F0-9]{4}\.(?:GIF|JPG|PNG))\)/gi, function(match, subMatch) {
        return `<img ${attrClass}${attrSrc}="b${subMatch}">`;
    });

    // 替換其他圖片
    str = str.replace(/!\[\]\(h(ttps?:\/\/.*?\.(?:jpe?g|png|gif))(?:\?w=[0-9]+)?\)/gi, function(match, subMatch) {
        if (subMatch.indexOf('im.bahamut.com.tw') !== -1) {
            subMatch += '?alt=media';
        }
        return `${lineBreak}<a href="b${subMatch}" target="_blank" onclick="urlRedirect(this);"><img ${attrStyle}${attrClass}${attrSrc}="b${subMatch}"></a>`;
    });

    // 替換連結
    str = str.replace(/\[(.*?)\]\(h(ttps?:\/\/(?:[!#-&(-;=?-Z\^-~]+))\)/gi, lineBreak + '<a href="b$2" target="_blank" style="color: #0055aa;" onclick="urlRedirect(this);">$1</a>');

    // 替換回應某人 TODO
    str = str.replace(/a>：\[([0-9a-zA-Z]*):([^\]]*)\]/gi, 'a> &gt; <a class="msgname AT1" href="http://home.gamer.com.tw/bahawall.php?owner=$1" target="_blank">$2</a>');
    str = str.replace(/：\[([0-9a-zA-Z]*):([^\]]*)\]/gi, '、<a class="msgname AT1" href="http://home.gamer.com.tw/bahawall.php?owner=$1" target="_blank">$2</a>');
    str = str.replace(/\[([0-9a-zA-Z]*):([^\]]*)\]/gi, '<a class="msgname AT1" href="http://home.gamer.com.tw/bahawall.php?owner=$1" target="_blank">$2</a>');

    // bttp 換回 http
    str = str.replace(/b(ttp[s]{0,1}:\/\/)/gi, 'h$1');

    // lineBreak
    str = str.replace(/\n/g, lineBreak);
    return str;
}

function balaMentionTransform(balaText, mentions) {
    if (mentions.length === 0) {
        return balaText;
    }

    let pointer = 0;
    let newBalaText = '';
    balaText = htmlDecode(balaText);

    mentions.forEach(mention => {
        let nickname = htmlEncode(balaText.substr(mention.offset, mention.length));
        newBalaText += htmlEncode(balaText.substr(pointer, Number(mention.offset) - pointer));
        newBalaText += `<a class="msgname AT1" href="http://home.gamer.com.tw/bahawall.php?owner=${mention.id}" target="_blank">${nickname}</a>`;
        pointer = Number(mention.offset) + Number(mention.length);
    });
    return newBalaText + htmlEncode(balaText.substr(pointer));
}

function getAvatarPic(uid, ver) {
    ver = ver ? '?v=' + ver : '';
    uidlow = uid.toLowerCase();
    if ('#' != uid.substr(0, 1)) {
        return 'https://avatar2.bahamut.com.tw/avataruserpic/' + uidlow.substr(0, 1) + '/' + uidlow.substr(1, 1) + '/' + uidlow + '/' + uidlow + '_s.png' + ver;
    } else if ('#acg' == uidlow.substr(0, 4)) {
        var tmp = uid.split('_');
        var typeArr = new Array();
        var machineArr = new Array();
        typeArr[1] = 'acg-game.gif';
        typeArr[2] = 'acg-comic.gif';
        typeArr[4] = 'acg-anime.gif';
        typeArr[8] = 'acg-novel.gif';
        machineArr[1] = 'acg-olg.gif';
        machineArr[8] = 'acg-ps3.gif';
        machineArr[32] = 'acg-xbox360.gif';
        machineArr[128] = 'acg-wii.gif';
        machineArr[512] = 'acg-psp.gif';
        machineArr[1024] = 'acg-nds.gif';
        machineArr[262144] = 'acg-pc.gif';
        machineArr[524288] = 'acg-web.gif';
        if (tmp[1] & (2 | 4 | 8)) return 'https://i2.bahamut.com.tw/acg/' + typeArr[tmp[1]];
        else {
            if (undefined == machineArr[tmp[2]]) return 'https://i2.bahamut.com.tw/acg/' + typeArr[tmp[1]];
            else return 'https://i2.bahamut.com.tw/acg/' + machineArr[tmp[2]];
        }
    } else if ('#gid' == uidlow.substr(0, 4)) {
        return 'https://p2.bahamut.com.tw/S/GUILD/c/' + (uid.substr(4) % 10) + '/' + $.sprintf("%010d", uid.substr(4)) + '.PNG';
    } else return 'https://i2.bahamut.com.tw/none.gif';
}