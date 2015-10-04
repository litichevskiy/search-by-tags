
function EventManager (doDebug) {
    this._events = {};
    this._debug = !!doDebug;
}


EventManager.fn = EventManager.prototype;



EventManager.fn._getListeners = function (eventName) {
    return this._events[eventName] || ( this._events[eventName] = [] );
};



EventManager.fn.subscribe = function (eventName, listener){
    this._getListeners(eventName).push(listener);
};



EventManager.fn.publish = function (eventName, data) {
    var _this = this,
        listeners = this._getListeners(eventName);
    
    for (var i = 0, l = listeners.length; i < l; ) try {
        listeners[i++].call(_this, {name:eventName, target:_this}, data);
    } catch (error) {
        if ( _this._debug && console && console.error ) {
            console.error(
                '\nERROR [EventManager]:\nEVENT NAME: "%s"\nSTACK: %s',
                eventName,
                error.stack
            );
        }
    };
};



EventManager.fn.unsubscribe = function (eventName, listener) {
    var listeners = this._getListeners(eventName),
        index = listeners.indexOf(listener);

    if ( ~index ) listeners.splice(index, 1);
};