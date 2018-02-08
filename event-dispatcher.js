'use strict';
var EventsDispatcher = (function () {
    function EventsDispatcher() {
        this.eventListeners = {};
        this.eventListeners = {};
    }
    EventsDispatcher.prototype.on = function (eventName, eventListener, scope) {
        var _self = this;
        var off, unregisterScopeDestroyFn;
        var namedEventListeners = _self.eventListeners[eventName];
        // if there is no entry for this event yet (no listener was registered to this event yet) then add a new empty entry
        if (!namedEventListeners) {
            _self.eventListeners[eventName] = namedEventListeners = [];
        }
        // add the new listener to the array of listeners of the specified event
        namedEventListeners.push(eventListener);
        // if a scope was provided register to the destroy event -> when the scope is destroyed we will unregister the event
        if (scope) {
            unregisterScopeDestroyFn = scope.$on('$destroy', function () {
                unregisterScopeDestroyFn = null; // reset the value so that it won't be called from `off`
                off();
            });
        }
        // the unregister function returned to the called -> he will be able to use it in order to explicitly unregister the event listener
        off = function () {
            // iterate all listeners registered for this event
            namedEventListeners.forEach(function (currentEventListener, index) {
                if (currentEventListener === eventListener) {
                    // found our listener -> remove it from the list
                    namedEventListeners.splice(index, 1);
                }
            });
            // since we already unregistered the eventListener we don't need to unregister again in scope.$destroy ->
            // so unregister from scope.destroy
            if (unregisterScopeDestroyFn) {
                unregisterScopeDestroyFn();
            }
        };
        return off;
    };
    EventsDispatcher.prototype.dispatch = function (eventName) {
        var _self = this;
        var stopPropagation = false, event = {
            name: eventName,
            stopPropagation: function () {
                stopPropagation = true;
            }
        }, listenerArgs = [event].concat(Array.prototype.slice.call(arguments, 1)), 
        // NOTE: copy the original listeners array since one of the listeners might unregister from the event in the callback
        // and that will change the original array in the middle of the iteration
        namedEventListeners = _.cloneDeep(_self.eventListeners[eventName]), i;
        if (!namedEventListeners) {
            return;
        }
        // iterate the listeners and dispatch the event
        for (i = 0; i < namedEventListeners.length; i++) {
            namedEventListeners[i].apply(null, listenerArgs);
            if (stopPropagation) {
                return;
            }
        }
    };
    EventsDispatcher.prototype.hasListeners = function (eventName) {
        var _self = this;
        return (_self.eventListeners[eventName] !== undefined);
    };
    return EventsDispatcher;
}());
//# sourceMappingURL=events-dispatcher.js.map