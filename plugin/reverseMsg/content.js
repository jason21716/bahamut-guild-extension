Core.plugin['ReverseMsg'] = {};

Core.plugin['ReverseMsg'].reverseReply = function(arr, id) {
    arr.reverse();
    //清空reply內部
    document.getElementById('allReply' + id).innerHTML = '';
    //貼入reply陣列
    arr.forEach(function(entry) {
        document.getElementById('allReply' + id).appendChild(entry);
    });
    //調整allReply位置
    var allReplyDOM = document.getElementById('allReply' + id);
    var replyDivDOM = document.getElementById('replyDiv' + id);
    document.getElementsByClassName('msgright')[0].removeChild(allReplyDOM);
    document.getElementsByClassName('msgright')[0].appendChild(allReplyDOM);
}

Core.plugin['ReverseMsg'].copyReply = function(id) {
    var replyDOM = document.getElementById('allReply' + id);

    var replyObj = replyDOM.children;
    var replyArr = Array.prototype.slice.call(replyObj);

    return replyArr;
}

Core.pages.get('singlePost').events.register('before_rebuild', function() {
    if (Core.config['singlePostReverse'] === true) {
        var replyArr = Core.plugin['ReverseMsg'].copyReply(Core.config['MsgId']);
        Core.plugin['ReverseMsg'].reverseReply(replyArr, Core.config['MsgId']);
    }
}, 10);

Core.pages.get('singlePost').events.register('reGenerateReply_beforeRender', function(replyArr) {
    if (Core.config['singlePostReverse']) {
        replyArr.reverse();
    }

    var arr = [];
    arr[0] = replyArr;
    return arr;
}, 10);