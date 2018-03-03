/*
 * @file 快速鍵功能的background事件
 * @author YUNG-HUNG TSAI
 * @license GPL-3.0
 */


function Background_FastResponse() {

}

/** 接收onCommand事件的回應編號，以呼叫正確的sendFastResponse事件
 * 事件依據chrome extansion api，只接受最多4個輸入，因此設定為fastResponce_1~4
 * 
 * @param {string} command 基於onCommand事件的回應編號
 */
Background_FastResponse.prototype.main = function(command) {
    switch (command) {
        case 'fastResponce_1':
            new Background_FastResponse().sendFastResponse(1);
            break;
        case 'fastResponce_2':
            new Background_FastResponse().sendFastResponse(2);
            break;
        case 'fastResponce_3':
            new Background_FastResponse().sendFastResponse(3);
            break;
        case 'fastResponce_4':
            new Background_FastResponse().sendFastResponse(4);
            break;
    }

}

/**
 * 將正確的回應以chrome.tabs.sendMessage回送至tab中加以觸發
 * @param {number} num 設定檔中對應的回應編號(1-4)
 */
Background_FastResponse.prototype.sendFastResponse = function(num) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.storage.local.get({ fastResponse1: '', fastResponse2: '', fastResponse3: '', fastResponse4: '' }, function(item) {
                var responseText = new Array();
                responseText[1] = item['fastResponse1'];
                responseText[2] = item['fastResponse2'];
                responseText[3] = item['fastResponse3'];
                responseText[4] = item['fastResponse4'];
                chrome.tabs.sendMessage(tabs[0].id, { message: 'fastResponse', text: responseText[num] }, function(response) {
                    console.log('message send.');
                });
            });
        });
    }
    //將事件註冊到onCommand事件中
chrome.commands.onCommand.addListener(new Background_FastResponse().main);