function Page(mainEvent, eventList) {
    this.mainEvent = mainEvent;
    this.subFunt = [];
    this.events = new EventStore(eventList);
}

function PageContainer() {
    this.storage = {};
}

PageContainer.prototype.get = function(pagename) {
    if (!pagename)
        return false;
    return this.storage[pagename] || false;
};

PageContainer.prototype.register = function(pagename, eventList, mainEvent) {
    this.storage[pagename] = new Page(mainEvent, eventList);
};