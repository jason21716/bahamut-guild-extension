var Util = Util || {};
(function(k) {
    var b = function(l, f) {
        /*$("iframe").each(function(a) {
            0 <= a.src.indexOf("?autoplay=1") && (a.src = a.src.replace(/\?autoplay=1/gi, ""))
        });*/
        var g = document.getElementById(l),
            a = g.innerHTML,
            c = "src",
            d = "",
            h = "",
            e = "";
        f & b.FLAG_LAZYLOAD && (c = "data-src",
            d = 'class="lazyload" ');
        f & b.FLAG_MAX_SIZE && (h = 'style="max-width:120px;max-height:120px;" ');
        f & b.FLAG_LINE_BREAK && (e = "<br>");
        a = a.replace(/(<[^>]*)h(ttp[s]{0,1}:\/\/[^>]*>)/gi, "$1b$2");
        f & b.FLAG_BALA_PLAYER ? (a = a.replace(/https?:\/\/(m|www|jp|tw).youtube.com\/watch\?v=([0-9a-zA-Z_-]{11})[^ <\u2E80-\u9FFF]*/gi, "<p style=\" display:block; width:138px; height:77px; background:url(bttp://i1.ytimg.com/vi/$2/default.jpg) no-repeat center center;\" onclick=\"$(this).html('<iframe width=450 height=253 src=bttp://www.youtube.com/embed/$2?autoplay=1 frameborder=0 allowfullscreen></iframe>');$(this).css('width','450px');$(this).css('height','253px');\"><img src=\"bttp://i2.bahamut.com.tw/PLAY2.png\" style=\"cursor: Pointer;\"></p>"),
            a = a.replace(/https?:\/\/youtu.be\/([0-9a-zA-Z_-]{11})[^ <\u2E80-\u9FFF]*/gi, "<p style=\" display:block; width:138px; height:77px; background:url(bttp://i1.ytimg.com/vi/$1/default.jpg) no-repeat center center;\" onclick=\"$(this).html('<iframe width=450 height=253 src=bttp://www.youtube.com/embed/$1?autoplay=1 frameborder=0 allowfullscreen></iframe>');$(this).css('width','450px');$(this).css('height','253px');\"><img src=\"bttp://i2.bahamut.com.tw/PLAY2.png\" style=\"cursor: Pointer;\"></p>"),
            a = a.replace(/http:\/\/(?:www|tw)\.nicovideo\.jp\/watch\/((?:sm|nm|ca|cd|ax|yo|nl|ig|na|cw|za|zb|zc|zd|ze|om|sk|yk|so|am|fz)[0-9]{1,14}|[0-9]{10})/g,
                '<p><iframe src="bttp://ext.nicovideo.jp/thumb_watch/$1?thumb_mode=html" style="width:450px; height:253px; border:none;"></iframe></p>')) : (a = a.replace(/https?:\/\/(m|www|jp|tw).youtube.com\/watch\?v=([0-9a-zA-Z_-]{11})[^ <\u2E80-\u9FFF]*/gi, e + "<iframe " + d + c + '="bttp://www.youtube.com/embed/$2" frameborder="0" allowfullscreen></iframe>'),
            a = a.replace(/https?:\/\/youtu.be\/([0-9a-zA-Z_-]{11})[^ <\u2E80-\u9FFF]*/gi, e + "<iframe " + d + c + '="bttp://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>'),
            a = a.replace(/http:\/\/(?:www|tw)\.nicovideo\.jp\/watch\/((?:sm|nm|ca|cd|ax|yo|nl|ig|na|cw|za|zb|zc|zd|ze|om|sk|yk|so|am|fz)[0-9]{1,14}|[0-9]{10})/g, e + "<iframe " + d + c + '="bttp://ext.nicovideo.jp/thumb_watch/$1?thumb_mode=html"></iframe>'));
        a = a.replace(/h(ttp[s]{0,1}:\/\/[^:]+\.(jpg|png|gif))/gi, e + '<a href="b$1" target="_blank" onclick="return Util.ChangeText.refurl(this);"><img ' + h + d + c + '="b$1"></a>');
        a = a.replace(/h(ttp[s]{0,1}:\/\/([^ <\[\u2E80-\u9FFF]+))/gi, e + '<a href="b$1" target="_blank" onclick="return Util.ChangeText.refurl(this);">$2</a>');
        a = a.replace(/\[e(\d*)\]/gi, "<img " + d + c + '="http://i2.bahamut.com.tw/editor/emotion/$1.gif">');
        "undefined" != typeof gsn && (a = a.replace(/\[G(1[a-z0-9]{3})\]/gi, "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/' + gsn % 10 + "/" + gsn + '_$1.GIF">'),
            a = a.replace(/\[G(2[a-z0-9]{3})\]/gi, "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/' + gsn % 10 + "/" + gsn + '_$1.JPG">'),
            a = a.replace(/\[G(3[a-z0-9]{3})\]/gi, "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/' + gsn % 10 + "/" + gsn + '_$1.PNG">'));
        a = a.replace(/\[G([0-9]{1}\/\d*_1[a-z0-9]{3})\]/gi,
            "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/$1.GIF">');
        a = a.replace(/\[G([0-9]{1}\/\d*_2[a-z0-9]{3})\]/gi, "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/$1.JPG">');
        a = a.replace(/\[G([0-9]{1}\/\d*_3[a-z0-9]{3})\]/gi, "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/$1.PNG">');
        a = a.replace(/a>\uff1a\[([0-9a-zA-Z]*):([^\]]*)\]/gi, 'a> &gt; <a class="msgname AT1" href="http://home.gamer.com.tw/bahawall.php?owner=$1" target="_blank">$2</a>');
        a = a.replace(/\uff1a\[([0-9a-zA-Z]*):([^\]]*)\]/gi, '\u3001<a class="msgname AT1" href="http://home.gamer.com.tw/bahawall.php?owner=$1" target="_blank">$2</a>');
        a = a.replace(/\[([0-9a-zA-Z]*):([^\]]*)\]/gi, '<a class="msgname AT1" href="http://home.gamer.com.tw/bahawall.php?owner=$1" target="_blank">$2</a>');
        a = a.replace(/b(ttp[s]{0,1}:\/\/)/gi, "h$1");
        g.innerHTML = a
    };
    b.refurl = function(b) {
        "http://ref.gamer" != b.href.substr(0, 16) && (b.href = "http://ref.gamer.com.tw/redir.php?url=" + encodeURIComponent(b.href));
        return !0
    };
    b.FLAG_LAZYLOAD = 1;
    b.FLAG_MAX_SIZE = 2;
    b.FLAG_LINE_BREAK = 4;
    b.FLAG_BALA_PLAYER = 8;
    b.FLAG_BALA = b.FLAG_LAZYLOAD | b.FLAG_MAX_SIZE | b.FLAG_LINE_BREAK | b.FLAG_BALA_PLAYER;
    k.ChangeText = b
})(Util);

var Util_fix = Util_fix || {};
(function(k) {
    var b = function(l, f) {
        /*$("iframe").each(function(a) {
            0 <= a.src.indexOf("?autoplay=1") && (a.src = a.src.replace(/\?autoplay=1/gi, ""))
        });*/
        var g = document.getElementById(l),
            a = g.innerHTML,
            c = "src",
            d = "",
            h = "",
            e = "";
        f & b.FLAG_LAZYLOAD && (c = "data-src",
            d = 'class="lazyload" ');
        f & b.FLAG_MAX_SIZE && (h = 'style="max-width:120px;max-height:120px;" ');
        f & b.FLAG_LINE_BREAK && (e = "<br>");
        a = a.replace(/(<[^>]*)h(ttp[s]{0,1}:\/\/[^>]*>)/gi, "$1b$2");
        //a = a.replace(/h(ttp[s]{0,1}:\/\/[^:]+\.(jpg|png|gif))/gi, e + '<a href="b$1" target="_blank" onclick="return Util.ChangeText.refurl(this);"><img ' + h + d + c + '="b$1"></a>');
        a = a.replace(/h(ttp[s]{0,1}:\/\/([^ <\[\u2E80-\u9FFF]+))/gi, e + '<a href="b$1" target="_blank" onclick="return Util.ChangeText.refurl(this);">$2</a>');
        a = a.replace(/\[e(\d*)\]/gi, "<img " + d + c + '="http://i2.bahamut.com.tw/editor/emotion/$1.gif">');
        "undefined" != typeof gsn && (a = a.replace(/\[G(1[a-z0-9]{3})\]/gi, "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/' + gsn % 10 + "/" + gsn + '_$1.GIF">'),
            a = a.replace(/\[G(2[a-z0-9]{3})\]/gi, "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/' + gsn % 10 + "/" + gsn + '_$1.JPG">'),
            a = a.replace(/\[G(3[a-z0-9]{3})\]/gi, "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/' + gsn % 10 + "/" + gsn + '_$1.PNG">'));
        a = a.replace(/\[G([0-9]{1}\/\d*_1[a-z0-9]{3})\]/gi,
            "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/$1.GIF">');
        a = a.replace(/\[G([0-9]{1}\/\d*_2[a-z0-9]{3})\]/gi, "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/$1.JPG">');
        a = a.replace(/\[G([0-9]{1}\/\d*_3[a-z0-9]{3})\]/gi, "<img " + d + c + '="http://p2.bahamut.com.tw/B/GUILD/e/$1.PNG">');
        a = a.replace(/a>\uff1a\[([0-9a-zA-Z]*):([^\]]*)\]/gi, 'a> &gt; <a class="msgname AT1" href="http://home.gamer.com.tw/bahawall.php?owner=$1" target="_blank">$2</a>');
        a = a.replace(/\uff1a\[([0-9a-zA-Z]*):([^\]]*)\]/gi, '\u3001<a class="msgname AT1" href="http://home.gamer.com.tw/bahawall.php?owner=$1" target="_blank">$2</a>');
        a = a.replace(/\[([0-9a-zA-Z]*):([^\]]*)\]/gi, '<a class="msgname AT1" href="http://home.gamer.com.tw/bahawall.php?owner=$1" target="_blank">$2</a>');
        a = a.replace(/b(ttp[s]{0,1}:\/\/)/gi, "h$1");
        g.innerHTML = a
    };
    b.refurl = function(b) {
        "http://ref.gamer" != b.href.substr(0, 16) && (b.href = "http://ref.gamer.com.tw/redir.php?url=" + encodeURIComponent(b.href));
        return !0
    };
    b.FLAG_LAZYLOAD = 1;
    b.FLAG_MAX_SIZE = 2;
    b.FLAG_LINE_BREAK = 4;
    b.FLAG_BALA_PLAYER = 8;
    b.FLAG_BALA = b.FLAG_LAZYLOAD | b.FLAG_MAX_SIZE | b.FLAG_LINE_BREAK | b.FLAG_BALA_PLAYER;
    k.ChangeText = b
})(Util_fix);

function buildReplyFix(a, b, c, d, f, g, e, n, l) {
    var h = "",
        h = '<div id="r-' + a + '" name="r-' + a + '" class="msgreport BC2">';
    1 == g ? h += '<a href="javascript:delReplyMsg(' + a + ')" class="msgdel AB1">\u522a\u9664</a>' : 3 == g && (h += '<a href="javascript:" onClick="delMsg_guild(3,' + a + '); return false;" class="msgdel AB1">\u522a\u9664</a>');
    h += '<a href="http://home.gamer.com.tw/home.php?owner=' + b + '" target="_blank"><img src="' + getAvatarPic(b, l) + '" class="msghead" /></a><div><a href="http://home.gamer.com.tw/home.php?owner=' + b +
        '" class="msgname AT1">' + c + "</a>\uff1a" + d + '<span><a href="javascript:void(0)" onclick="iWantReply(' + e + ",1,'" + b + "','" + c + '\')" title="\u56de\u8986\u4ed6"><img src="https://i2.bahamut.com.tw/spacer.gif" class="IMG-E26" /></a></span><span class="ST1">' + f + '</span><span class="ST1">#' + n + "</span></div>";
    return h + "</div>"
}

function getAvatarPic(e, t) {
    if (t = t ? "?v=" + t : "",
        uidlow = e.toLowerCase(),
        "#" != e.substr(0, 1))
        return "https://avatar2.bahamut.com.tw/avataruserpic/" + uidlow.substr(0, 1) + "/" + uidlow.substr(1, 1) + "/" + uidlow + "/" + uidlow + "_s.png" + t;
    if ("#acg" == uidlow.substr(0, 4)) {
        var o = e.split("_"),
            a = new Array,
            n = new Array;
        return a[1] = "acg-game.gif",
            a[2] = "acg-comic.gif",
            a[4] = "acg-anime.gif",
            a[8] = "acg-novel.gif",
            n[1] = "acg-olg.gif",
            n[8] = "acg-ps3.gif",
            n[32] = "acg-xbox360.gif",
            n[128] = "acg-wii.gif",
            n[512] = "acg-psp.gif",
            n[1024] = "acg-nds.gif",
            n[262144] = "acg-pc.gif",
            n[524288] = "acg-web.gif",
            14 & o[1] ? "http://i2.bahamut.com.tw/acg/" + a[o[1]] : void 0 == n[o[2]] ? "http://i2.bahamut.com.tw/acg/" + a[o[1]] : "http://i2.bahamut.com.tw/acg/" + n[o[2]]
    }
    return "#gid" == uidlow.substr(0, 4) ? "http://p2.bahamut.com.tw/S/GUILD/c/" + e.substr(4) % 10 + "/" + $.sprintf("%010d", e.substr(4)) + ".PNG" : "http://i2.bahamut.com.tw/none.gif"
}

function showActiveDivFix(a, b) {
    if ("allReply" == a.substr(0, 8) || "MSG-box2" == a || "readMore" == a)
        var d = b.getElementsByTagName("sn")[0].textContent,
            f = b.getElementsByTagName("author")[0].textContent,
            g = b.getElementsByTagName("nick")[0].textContent,
            e = b.getElementsByTagName("date")[0].textContent,
            n = b.getElementsByTagName("content")[0].textContent,
            l = "undefined" !== typeof avatarUpdate ? avatarUpdate : "";
    if ("allReply" == a.substr(0, 8)) {
        c = "" == document.getElementById(a).innerHTML ? c = 1 : parseInt(document.getElementById(a).firstChild.lastChild.lastChild.innerHTML.substr(1)) + 1;
        if (Core.config['singleACMsgReverse'] === true)
            document.getElementById(a).innerHTML = buildReplyFix(d, f, g, n, e, 1, a.substr(8), c, l) + document.getElementById(a).innerHTML;
        else {
            document.getElementById(a).innerHTML = document.getElementById(a).innerHTML + buildReplyFix(d, f, g, n, e, 1, a.substr(8), c, l);
        }
        document.getElementById("replyMsg" + a.substr(8)).value = "";
        Util.ChangeText("r-" + d, Util.ChangeText.FLAG_BALA);
        document.getElementById("bahaext-replyBtn" + a.substr(8)).disabled = !1;
    }

}

function countLimitFix(a, b) {
    var c = a.value,
        c = c.replace(/&/g, "&amp;"),
        c = c.replace(/'/g, "&#039;"),
        c = c.replace(/"/g, "&quot;"),
        c = c.replace(/</g, "&lt;"),
        c = c.replace(/>/g, "&gt;"),
        c = c.replace(/\r/g, ""),
        c = c.replace(/\n/g, "<br />");
    return utf8LengthFix(c) > 3 * b ? -1 : utf8LengthFix(c);
}

function countLimitFix2(a, b) {
    var c = a.value,
        c = c.replace(/&/g, "&amp;"),
        c = c.replace(/'/g, "&#039;"),
        c = c.replace(/"/g, "&quot;"),
        c = c.replace(/</g, "&lt;"),
        c = c.replace(/>/g, "&gt;"),
        c = c.replace(/\r/g, ""),
        c = c.replace(/\n/g, "<br />");
    return utf8LengthFix(c) > 3 * b ? true : false;
}

function utf8LengthFix(letter) {
    var b = letter.match(/[^\x00-\xff]/ig);
    return null === b ? letter.length : letter.length + 2 * b.length;
}