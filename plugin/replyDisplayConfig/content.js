Core.plugin['ReplyDisplayConfig'] = {};

Core.plugin['ReplyDisplayConfig'].bookMarkLocation = -1;

Core.plugin['ReplyDisplayConfig'].resetUserList = function(arr) {
    console.log(arr)
    var userArr = new Array();
    var userNameArr = new Array();
    $.each(arr, function(i, item) {
        if (userArr.indexOf(item.userid) == -1) {
            userArr.push(item.userid);
            userNameArr.push(item.name);
        }
    });

    var rightContentUserDiv = document.getElementById('baha-rightContentUserDiv');
    rightContentUserDiv.innerHTML = '';
    $.each(userArr, function(i, item) {
        var userInput = document.createElement('input');
        userInput.type = 'checkbox';
        userInput.name = 'baha-userList';
        userInput.value = item;
        var userInputLabel = document.createElement('span');
        userInputLabel.innerHTML = userNameArr[i];
        userInputLabel.id = 'baha-userList-' + item;
        userInputLabel.className = 'baha-userlist-Label';
        $(userInput).prop("checked", true);

        rightContentUserDiv.appendChild(userInput);
        rightContentUserDiv.appendChild(userInputLabel);
        rightContentUserDiv.appendChild(document.createElement('br'));
    });
}

Core.plugin['ReplyDisplayConfig'].addRightContent = function() {
    var domRightTitle = document.createElement("h5");
    domRightTitle.innerHTML = '部分顯示選項';
    domRightTitle.id = 'baha-rightTitle';

    var domRightContent = document.createElement("div");
    domRightContent.className = 'BH-rbox MSG-list5';
    domRightContent.id = 'baha-rightContent';

    var rightContentHeader = document.createElement("p");
    rightContentHeader.innerHTML = '目前狀態：正常';
    rightContentHeader.id = 'baha-rightContentStatus';

    var rightContentDiv = document.createElement("div");

    var rightContentlabel1 = document.createElement("span");
    rightContentlabel1.innerHTML = '只顯示書籤後的訊息：';

    var rightContentChoose1 = document.createElement("select");
    rightContentChoose1.id = 'baha-rightContentChoosebookMark';
    var option01 = document.createElement("option");
    option01.text = "關閉";
    rightContentChoose1.add(option01);
    var option02 = document.createElement("option");
    option02.text = "開啟";
    rightContentChoose1.add(option02);

    var rightContentlabel2 = document.createElement("span");
    rightContentlabel2.innerHTML = '顯示選項：';

    var rightContentChoose2 = document.createElement("select");
    rightContentChoose2.id = 'baha-rightContentChooseType';
    var option1 = document.createElement("option");
    option1.text = "全部顯示";
    rightContentChoose2.add(option1);
    var option2 = document.createElement("option");
    option2.text = "顯示部分對象";
    rightContentChoose2.add(option2);
    rightContentChoose2.addEventListener("change", function(e) {
        if (document.getElementById('baha-rightContentChooseType').selectedIndex == 0) {
            var nameList = document.getElementsByName("baha-userList");
            $.each(nameList, function(i, item) {
                $(item).prop("checked", true);
            });
        }
    });

    var rightContentUserDiv = document.createElement("div");
    rightContentUserDiv.id = 'baha-rightContentUserDiv';

    var rightContentBtn = document.createElement("button");
    rightContentBtn.innerHTML = '套用';

    var rightContentBtnClean = document.createElement("button");
    rightContentBtnClean.innerHTML = '全部清除';

    var domRightContentBtnDiv = document.createElement("div");
    domRightContentBtnDiv.className = 'BH-slave_more';


    var pageSetting = new Array();
    pageSetting.onlyAfterBookMrak = 0;
    pageSetting.showType = 0;
    pageSetting.showUser = new Array();
    Core.config['displaySetting'] = pageSetting;

    rightContentBtn.addEventListener("click", function(e) {

        var pageSetting = new Array();
        pageSetting.onlyAfterBookMrak = document.getElementById('baha-rightContentChoosebookMark').selectedIndex;
        pageSetting.showType = document.getElementById('baha-rightContentChooseType').selectedIndex;

        if (pageSetting.onlyAfterBookMrak + pageSetting.showType !== 0) {
            document.getElementById('baha-rightContentStatus').innerHTML = '目前狀態：部分顯示中';
        } else {
            document.getElementById('baha-rightContentStatus').innerHTML = '目前狀態：正常';
        }
        pageSetting.showUser = new Array();
        if (pageSetting.showType == 1) {
            var nameList = document.getElementsByName("baha-userList");
            $.each(nameList, function(i, item) {
                if ($(item).prop("checked"))
                    pageSetting.showUser.push(item.value);
            });
        }

        Core.config['displaySetting'] = pageSetting;

        Core.pages.get('singlePost').subFunt['reGenerateReply'](true,[],[]);
    });

    rightContentBtnClean.addEventListener("click", function(e) {
        var nameList = document.getElementsByName("baha-userList");
        $.each(nameList, function(i, item) {
            $(item).prop("checked", false);
        });
    });

    domRightContent.appendChild(rightContentHeader);
    domRightContent.appendChild(rightContentlabel1);
    domRightContent.appendChild(rightContentChoose1);
    domRightContent.appendChild(document.createElement('br'));
    domRightContent.appendChild(rightContentlabel2);
    domRightContent.appendChild(rightContentChoose2);
    domRightContent.appendChild(rightContentUserDiv);
    domRightContentBtnDiv.appendChild(rightContentBtn);
    domRightContentBtnDiv.appendChild(rightContentBtnClean);
    domRightContent.appendChild(domRightContentBtnDiv)
    $(document.getElementById('BH-slave')).prepend(domRightContent);
    $(document.getElementById('BH-slave')).prepend(domRightTitle);
    Core.plugin['ReplyDisplayConfig'].resetUserList(Core.config['lastReplyArr']);
}

Core.pages.get('singlePost').events.register('common', Core.plugin['ReplyDisplayConfig'].addRightContent);

Core.pages.get('singlePost').events.register('reGenerateReply_pre', function() {
    if (Core.config['bookmark-' + Core.config['MsgId']] !== undefined && Core.config['displaySetting'].onlyAfterBookMrak != 0) {
        for (var i = 0; i < Core.config['lastReplyArr'].length; i++) {
            if (('r-' + Core.config['lastReplyArr'][i].snID) === Core.config['bookmark-' + Core.config['MsgId']]) {
                Core.plugin['ReplyDisplayConfig'].bookMarkLocation = i;
                break;
            }
        }
    }

    var domUserList = document.getElementsByClassName('baha-userlist-Label');
    $.each(domUserList, function(i, item) {
        item.style.fontWeight = 'regular';
        item.style.color = 'black';
    });
}, 10);

Core.pages.get('singlePost').events.register('reGenerateReply_decideOutput', function(printFlag, i, item) {
    if (i < Core.plugin['ReplyDisplayConfig'].bookMarkLocation)
        printFlag = false;

    if (printFlag && Core.config['displaySetting'].showType == 1)
        if (Core.config['displaySetting'].showUser.indexOf(item.userid) == -1)
            printFlag = false;

    var arr = [];
    arr[0] = printFlag;
    arr[1] = i;
    arr[2] = item;
    return arr;
}, 10);