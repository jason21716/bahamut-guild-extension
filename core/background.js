/**
 * @file 核心的background事件，用以確認插件按鈕是否該啟用
 * @author YUNG-HUNG TSAI
 * @license GPL-3.0
 */

/** 確認該分頁網址是否為公會區網站，是則顯示插件按鈕
 * 
 * @param {*} tabId 
 * @param {*} changeInfo 
 * @param {*} tab 
 */
function checkForValidUrl(tabId, changeInfo, tab) {
    var urls = getDomainFromUrl(tab.url);
    console.log(urls)
    if(urls == null){
        return
    }
    if (urls[0].toLowerCase() == "guild.gamer.com.tw") {
        chrome.pageAction.show(tabId);
    }else{
        chrome.pageAction.hide(tabId);
    }
};

//將事件註冊到tabs.onUpdated事件中
chrome.tabs.onUpdated.addListener(checkForValidUrl);