function changeCheckBoxState(str, choose) {
    document.getElementById(str).checked = choose;
}

function changeInputState(str, text) {
    document.getElementById(str).value = text;
}

function save_options() {
    var tn = document.getElementById('titleNumbers').checked;
    var tncn = document.getElementById('titleNumbersCheckNotice').checked;
    var tncs = document.getElementById('titleNumbersCheckSubscript').checked;
    var tncr = document.getElementById('titleNumbersCheckRecommend').checked;
    var sar = document.getElementById('singlePostReverse').checked;
    var rwc = document.getElementById('replyDivWordCount').checked;
    var rc = document.getElementById('replyDivCutting').checked;
    var bmb = document.getElementById('bookMarkBtn').checked;
    var ns = document.getElementById('notifiSound').checked;
    var jsk = document.getElementById('uploadJsonKey').value;
    var fs1 = document.getElementById('fastResponse1').value;
    var fs2 = document.getElementById('fastResponse2').value;
    var fs3 = document.getElementById('fastResponse3').value;
    var fs4 = document.getElementById('fastResponse4').value;
    var fs5 = document.getElementById('fastResponse5').value;
    var fs6 = document.getElementById('fastResponse6').value;
    var fs7 = document.getElementById('fastResponse7').value;
    var fs8 = document.getElementById('fastResponse8').value;
    var fs1n = document.getElementById('fastResponse1name').value;
    var fs2n = document.getElementById('fastResponse2name').value;
    var fs3n = document.getElementById('fastResponse3name').value;
    var fs4n = document.getElementById('fastResponse4name').value;
    var fs5n = document.getElementById('fastResponse5name').value;
    var fs6n = document.getElementById('fastResponse6name').value;
    var fs7n = document.getElementById('fastResponse7name').value;
    var fs8n = document.getElementById('fastResponse8name').value;
    chrome.storage.local.set({
        titleNumbers: tn,
        titleNumbersCheckNotice: tncn,
        titleNumbersCheckSubscript: tncs,
        titleNumbersCheckRecommend: tncr,
        singlePostReverse: sar,
        replyDivWordCount: rwc,
        replyDivCutting: rc,
        bookMarkBtn: bmb,
        notifiSound: ns,
        uploadJsonKey: jsk,
        fastResponse1: fs1,
        fastResponse2: fs2,
        fastResponse3: fs3,
        fastResponse4: fs4,
        fastResponse5: fs5,
        fastResponse6: fs6,
        fastResponse7: fs7,
        fastResponse8: fs8,
        fastResponse1name: fs1n,
        fastResponse2name: fs2n,
        fastResponse3name: fs3n,
        fastResponse4name: fs4n,
        fastResponse5name: fs5n,
        fastResponse6name: fs6n,
        fastResponse7name: fs7n,
        fastResponse8name: fs8n
    }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = '選項已儲存，請重整所有網頁';
        setTimeout(function() {
            status.textContent = '';
        }, 3000);
        var status2 = document.getElementById('status2');
        status2.textContent = '選項已儲存，請重整所有網頁';
        setTimeout(function() {
            status2.textContent = '';
        }, 3000);
    });
}

function restore_options() {
    chrome.storage.local.get({
            titleNumbers: false,
            titleNumbersCheckNotice: false,
            titleNumbersCheckSubscript: false,
            titleNumbersCheckRecommend: false,
            singlePostReverse: false,
            replyDivWordCount: false,
            replyDivCutting: false,
            uploadJsonKey: null,
            bookMarkBtn: false,
            notifiSound: false,
            bookMarkIndex: new Array(),
            fastResponse1: '',
            fastResponse2: '',
            fastResponse3: '',
            fastResponse4: '',
            fastResponse5: '',
            fastResponse6: '',
            fastResponse7: '',
            fastResponse8: '',
            fastResponse1name: '回覆1',
            fastResponse2name: '回覆2',
            fastResponse3name: '回覆3',
            fastResponse4name: '回覆4',
            fastResponse5name: '回覆5',
            fastResponse6name: '回覆6',
            fastResponse7name: '回覆7',
            fastResponse8name: '回覆8'
        }, function(item) {
            changeCheckBoxState('titleNumbers', item['titleNumbers']);
            changeCheckBoxState('singlePostReverse', item['singlePostReverse']);
            changeCheckBoxState('replyDivWordCount', item['replyDivWordCount']);
            changeCheckBoxState('replyDivCutting', item['replyDivCutting']);
            changeCheckBoxState('bookMarkBtn', item['bookMarkBtn']);
            changeCheckBoxState('notifiSound', item['notifiSound']);
            changeCheckBoxState('titleNumbersCheckNotice', item['titleNumbersCheckNotice']);
            changeCheckBoxState('titleNumbersCheckSubscript', item['titleNumbersCheckSubscript']);
            changeCheckBoxState('titleNumbersCheckRecommend', item['titleNumbersCheckRecommend']);
            changeInputState('uploadJsonKey', item['uploadJsonKey']);
            changeInputState('fastResponse1', item['fastResponse1']);
            changeInputState('fastResponse2', item['fastResponse2']);
            changeInputState('fastResponse3', item['fastResponse3']);
            changeInputState('fastResponse4', item['fastResponse4']);
            changeInputState('fastResponse5', item['fastResponse5']);
            changeInputState('fastResponse6', item['fastResponse6']);
            changeInputState('fastResponse7', item['fastResponse7']);
            changeInputState('fastResponse8', item['fastResponse8']);
            changeInputState('fastResponse1name', item['fastResponse1name']);
            changeInputState('fastResponse2name', item['fastResponse2name']);
            changeInputState('fastResponse3name', item['fastResponse3name']);
            changeInputState('fastResponse4name', item['fastResponse4name']);
            changeInputState('fastResponse5name', item['fastResponse5name']);
            changeInputState('fastResponse6name', item['fastResponse6name']);
            changeInputState('fastResponse7name', item['fastResponse7name']);
            changeInputState('fastResponse8name', item['fastResponse8name']);
        }

    );
}
document.addEventListener('DOMContentLoaded', restore_options);
window.onload = function() {
    document.getElementById('save').addEventListener('click', save_options);
    document.getElementById('save2').addEventListener('click', save_options);
};