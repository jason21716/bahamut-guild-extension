'use strict';
/**
 * 
 * @param {*} typeList 
 */
function EventStore(typeList) {
    this.store = {};
    this.typeList = typeList;
}

EventStore.prototype.list = function(type) {
    if (!type) return this.store;
    return this.store[type] || [];
};

EventStore.prototype.register = function(type, fn, priority) {
    if (!priority) {
        if (typeof type === 'function') {
            priority = fn;
            fn = type;
            type = this.typeList[0];
        }
    }

    if (typeof fn !== 'function') throw new TypeError('fn must be a function');

    type = this.typeList[type] || type;
    priority = priority == null ? 10 : priority;

    var store = this.store[type] = this.store[type] || [];

    fn.priority = priority;
    store.push(fn);

    store.sort(function(a, b) {
        return a.priority - b.priority;
    });
};

EventStore.prototype.exec = function(type) {
    var events = this.list(type);
    for (var i = 0, len = events.length; i < len; i++) {
        events[i]();
    }
};

EventStore.prototype.execArgs = function(type, args) {
    var events = this.list(type);
    for (var i = 0, len = events.length; i < len; i++) {
        args = events[i].apply(this, args);
    }
    return args;
};