function utf8LengthFix(txt) {
    var value = txt;

    value = value.replace(/&/g, "&amp;");
    value = value.replace(/'/g, "&#039;");
    value = value.replace(/"/g, "&quot;");
    value = value.replace(/</g, "&lt;");
    value = value.replace(/>/g, "&gt;");
    value = value.replace(/\r/g, "");
    value = value.replace(/\n/g, "<br />");

    return value.utf8Length();
}

String.prototype.utf8Length = function() {
    var e = this.match(/[^\x00-\xff]/gi);
    return null === e ? this.length : this.length + 2 * e.length
}

function isIE() {
    return "Microsoft Internet Explorer" == navigator.appName
}

function getDomainFromUrl(url) {
    var host = null;

    if (typeof url == "undefined" || null == url)
        url = window.location.href;
    var regex = /.*\:\/\/([^\/]*)\/([^\/]*).*/;
    var match = url.match(regex);
    if (typeof match != "undefined" && null != match) {
        host = new Array(match[1], match[2]);
    }
    return host;
}

function getPHPFileNameString(s) {
    var host = null;

    var regex = /([^\/]*)\.php([^\/]*)/;
    var match = s.match(regex);
    if (typeof match != "undefined" && null != match) {
        host = new Array(match[1], match[2]);
    }
    return host;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(obj) {
    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

function htmlToElement(html) {
    var template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstChild;
}

function getCookie(e) {
    e = "; " + e + "=";
    var t = "; " + document.cookie;
    return start = t.indexOf(e, 0), -1 == start ? "" : (end = t.indexOf(";", start + 1), -1 == end && (end = t.length),
        isIE() ? unescape(t.substring(start + e.length, end)) : t.substring(start + e.length, end))
}