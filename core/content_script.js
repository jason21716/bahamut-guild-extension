/*
 * @file content_scripts所有事件的觸發點
 * @author YUNG-HUNG TSAI
 * @license GPL-3.0
 */

/**
 * content_scripts主觸發點
 */
main = function(item) {
    //載入使用者設定
    Core.config = item;

    //確認用戶身分
    var selfDOM = document.getElementsByClassName('TOP-my')[0].getElementsByTagName('li')[3].childNodes[0];
    var selfDOMMatch = selfDOM.href.match(/https\:\/\/home\.gamer\.com\.tw\/([a-z A-Z 0-9]*)/);
    Core.config['controller'] = selfDOMMatch[1];
    console.log("使用者：" + Core.config['controller']);

    //網址解析
    var urls = getDomainFromUrl(window.location.href);
    var pageName = getPHPFileNameString(urls[1]);
    console.log("目前URI前綴:" + urls[0] + " 目前URI後綴:" + urls[1]);
    console.log("目前網頁檔名:" + pageName[0] + " 相關參數:" + pageName[1]);
    Core.config['pageName'] = pageName;

    //plugin事件觸發：before_page_action
    Core.events.exec('before_page_action');

    //尋找頁面主函式並設法觸發
    var pageEvent = Core.pages.get(pageName[0]);
    if (pageEvent != false) {
        console.log("執行頁面主函式:" + pageName[0]);
        pageEvent.mainEvent();
    } else {
        console.log("頁面主函式沒有觸發");
    }
};

chrome.storage.local.get(null, main);