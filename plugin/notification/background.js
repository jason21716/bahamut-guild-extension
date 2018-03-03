/*
 * @file 自動更新桌面提示功能的background事件
 * @author YUNG-HUNG TSAI
 * @license GPL-3.0
 */

function Background_Notification() {

}

/** 接收tab的新回應通知，並觸發桌面通知
 * 
 * 
 * @param {*} request 
 * @param {*} sender 
 * @param {*} sendResponse 
 */
Background_Notification.prototype.main = function(request, sender, sendResponse) {
    if (request.greeting == "nofity") {
        chrome.notifications.create(
            request.rid, {
                type: 'basic',
                iconUrl: 'icon/baha128.png',
                title: '有串更新了！!',
                message: request.text + '(#' + request.num + ')'
            },
            function(notificationId) {}
        );
        if (request.sound) {
            var yourSound = new Audio('sounds/iphonenoti.mp3');
            yourSound.play();
        }

    }
}

//將事件註冊到onMessage事件中
chrome.runtime.onMessage.addListener(new Background_Notification().main);