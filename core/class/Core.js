/**
 * 主核心類別
 */
function Core() {
    /**
     * 主事件儲存庫，用以儲存非屬各頁面的事件
     */
    this.events = new EventStore({
        before_page_action: 'before_page_action' //在進入各頁面事件前觸發
    });

    /**
     * 使用者設定檔
     */
    this.config = [];

    /**
     * 各頁面事件儲存庫
     */
    this.pages = new PageContainer();

    this.plugin = [];
    this.background = [];
}

var Core = new Core();