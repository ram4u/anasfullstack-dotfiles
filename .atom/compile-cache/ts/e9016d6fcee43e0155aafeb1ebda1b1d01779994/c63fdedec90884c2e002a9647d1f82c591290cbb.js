//   Copyright 2013-2014 François de Campredon
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.
'use strict';
var path = require('path');
function mapValues(map) {
    return Object.keys(map).reduce(function (result, key) {
        result.push(map[key]);
        return result;
    }, []);
}
exports.mapValues = mapValues;
/**
 * assign all properties of a list of object to an object
 * @param target the object that will receive properties
 * @param items items which properties will be assigned to a target
 */
function assign(target) {
    var items = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        items[_i - 1] = arguments[_i];
    }
    return items.reduce(function (target, source) {
        return Object.keys(source).reduce(function (target, key) {
            target[key] = source[key];
            return target;
        }, target);
    }, target);
}
exports.assign = assign;
/**
 * clone an object (shallow)
 * @param target the object to clone
 */
function clone(target) {
    return assign(Array.isArray(target) ? [] : {}, target);
}
exports.clone = clone;
/**
 * Create a quick lookup map from list
 */
function createMap(arr) {
    return arr.reduce(function (result, key) {
        result[key] = true;
        return result;
    }, {});
}
exports.createMap = createMap;
/**
 * browserify path.resolve is buggy on windows
 */
function pathResolve(from, to) {
    var result = path.resolve(from, to);
    var index = result.indexOf(from[0]);
    return result.slice(index);
}
exports.pathResolve = pathResolve;
var Signal = (function () {
    function Signal() {
        /**
         * list of listeners that have been suscribed to this signal
         */
        this.listeners = [];
        /**
         * Priorities corresponding to the listeners
         */
        this.priorities = [];
    }
    /**
     * Subscribes a listener for the signal.
     *
     * @params listener the callback to call when events are dispatched
     * @params priority an optional priority for this signal
     */
    Signal.prototype.add = function (listener, priority) {
        if (priority === void 0) { priority = 0; }
        var index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.priorities[index] = priority;
            return;
        }
        for (var i = 0, l = this.priorities.length; i < l; i++) {
            if (this.priorities[i] < priority) {
                this.priorities.splice(i, 0, priority);
                this.listeners.splice(i, 0, listener);
                return;
            }
        }
        this.priorities.push(priority);
        this.listeners.push(listener);
    };
    /**
     * unsubscribe a listener for the signal
     *
     * @params listener the previously subscribed listener
     */
    Signal.prototype.remove = function (listener) {
        var index = this.listeners.indexOf(listener);
        if (index >= 0) {
            this.priorities.splice(index, 1);
            this.listeners.splice(index, 1);
        }
    };
    /**
     * dispatch an event
     *
     * @params parameter the parameter attached to the event dispatching
     */
    Signal.prototype.dispatch = function (parameter) {
        var hasBeenCanceled = this.listeners.every(function (listener) {
            var result = listener(parameter);
            return result !== false;
        });
        return hasBeenCanceled;
    };
    /**
     * Remove all listener from the signal
     */
    Signal.prototype.clear = function () {
        this.listeners = [];
        this.priorities = [];
    };
    /**
     * @return true if the listener has been subsribed to this signal
     */
    Signal.prototype.hasListeners = function () {
        return this.listeners.length > 0;
    };
    return Signal;
})();
exports.Signal = Signal;
function binarySearch(array, value) {
    var low = 0;
    var high = array.length - 1;
    while (low <= high) {
        var middle = low + ((high - low) >> 1);
        var midValue = array[middle];
        if (midValue === value) {
            return middle;
        }
        else if (midValue > value) {
            high = middle - 1;
        }
        else {
            low = middle + 1;
        }
    }
    return ~low;
}
exports.binarySearch = binarySearch;
// Not optimized
function selectMany(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            result.push(arr[i][j]);
        }
    }
    return result;
}
exports.selectMany = selectMany;
// Not particularly awesome e.g. '/..foo' will pass
function pathIsRelative(str) {
    if (!str.length)
        return false;
    return str[0] == '.' || str.substring(0, 2) == "./" || str.substring(0, 3) == "../";
}
exports.pathIsRelative = pathIsRelative;
/** Key is string. Note: this data structure might have been a bad idea. Sorry. */
var Dict = (function () {
    function Dict() {
        this.table = Object.create(null);
    }
    Dict.prototype.setValue = function (key, item) {
        this.table[key] = item;
    };
    Dict.prototype.getValue = function (key) {
        return this.table[key];
    };
    Dict.prototype.clearValue = function (key) {
        delete this.table[key];
    };
    Dict.prototype.clearAll = function () {
        this.table = Object.create(null);
    };
    Dict.prototype.keys = function () {
        return Object.keys(this.table);
    };
    Dict.prototype.values = function () {
        var array = [];
        for (var key in this.table) {
            array.push(this.table[key]);
        }
        return array;
    };
    return Dict;
})();
exports.Dict = Dict;
/** for testing ui lags only */
function delay(seconds) {
    if (seconds === void 0) { seconds = 2; }
    delayMilliseconds(seconds * 1000);
}
exports.delay = delay;
;
function delayMilliseconds(milliseconds) {
    if (milliseconds === void 0) { milliseconds = 100; }
    // Delay the thread
    var d1 = new Date();
    var d2 = new Date();
    while (d2.valueOf() < d1.valueOf() + milliseconds) {
        d2 = new Date();
    }
}
exports.delayMilliseconds = delayMilliseconds;
;
var now = function () { return new Date().getTime(); };
function debounce(func, milliseconds, immediate) {
    if (immediate === void 0) { immediate = false; }
    var timeout, args, context, timestamp, result;
    var wait = milliseconds;
    var later = function () {
        var last = now() - timestamp;
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last);
        }
        else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout)
                    context = args = null;
            }
        }
    };
    return function () {
        context = this;
        args = arguments;
        timestamp = now();
        var callNow = immediate && !timeout;
        if (!timeout)
            timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }
        return result;
    };
}
exports.debounce = debounce;
;
var punctuations = createMap([';', '{', '}', '(', ')', '.', ':', '<', '>', "'", '"']);
exports.prefixEndsInPunctuation = function (prefix) { return prefix.length && prefix.trim().length && punctuations[prefix.trim()[prefix.trim().length - 1]]; };
var nameExtractorRegex = /return (.*);/;
/** Get the name using a lambda so that you don't have magic strings */
function getName(nameLambda) {
    var m = nameExtractorRegex.exec(nameLambda + "");
    if (m == null)
        throw new Error("The function does not contain a statement matching 'return variableName;'");
    var access = m[1].split('.');
    return access[access.length - 1];
}
exports.getName = getName;
/** Sloppy but effective code to find distinct */
function distinct(arr) {
    var map = createMap(arr);
    return Object.keys(map);
}
exports.distinct = distinct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL1VzZXJzL2FuYXMvLmF0b20vcGFja2FnZXMvYXRvbS10eXBlc2NyaXB0L2xpYi9tYWluL2xhbmcvdXRpbHMudHMiLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbmFzLy5hdG9tL3BhY2thZ2VzL2F0b20tdHlwZXNjcmlwdC9saWIvbWFpbi9sYW5nL3V0aWxzLnRzIl0sIm5hbWVzIjpbIm1hcFZhbHVlcyIsImFzc2lnbiIsImNsb25lIiwiY3JlYXRlTWFwIiwicGF0aFJlc29sdmUiLCJTaWduYWwiLCJTaWduYWwuY29uc3RydWN0b3IiLCJTaWduYWwuYWRkIiwiU2lnbmFsLnJlbW92ZSIsIlNpZ25hbC5kaXNwYXRjaCIsIlNpZ25hbC5jbGVhciIsIlNpZ25hbC5oYXNMaXN0ZW5lcnMiLCJiaW5hcnlTZWFyY2giLCJzZWxlY3RNYW55IiwicGF0aElzUmVsYXRpdmUiLCJEaWN0IiwiRGljdC5jb25zdHJ1Y3RvciIsIkRpY3Quc2V0VmFsdWUiLCJEaWN0LmdldFZhbHVlIiwiRGljdC5jbGVhclZhbHVlIiwiRGljdC5jbGVhckFsbCIsIkRpY3Qua2V5cyIsIkRpY3QudmFsdWVzIiwiZGVsYXkiLCJkZWxheU1pbGxpc2Vjb25kcyIsImRlYm91bmNlIiwiZ2V0TmFtZSIsImRpc3RpbmN0Il0sIm1hcHBpbmdzIjoiQUFBQSw4Q0FBOEM7QUFDOUMsRUFBRTtBQUNGLG9FQUFvRTtBQUNwRSxxRUFBcUU7QUFDckUsNENBQTRDO0FBQzVDLEVBQUU7QUFDRixtREFBbUQ7QUFDbkQsRUFBRTtBQUNGLHdFQUF3RTtBQUN4RSxzRUFBc0U7QUFDdEUsNkVBQTZFO0FBQzdFLHdFQUF3RTtBQUN4RSxtQ0FBbUM7QUFFbkMsWUFBWSxDQUFDO0FBRWIsSUFBTyxJQUFJLFdBQVcsTUFBTSxDQUFDLENBQUM7QUFFOUIsU0FBZ0IsU0FBUyxDQUFJLEdBQTJCO0lBQ3BEQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFDQSxN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QSxRQUFRQSxDQUFDQTtZQUNsQ0EsTUFBTUEsQ0FBQ0E7UUFDWEEsQ0FBQ0E7UUFDREEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7WUFDckRBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO2dCQUNoQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsUUFBUUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ3ZDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxRQUFRQSxDQUFDQSxDQUFDQTtnQkFDdENBLE1BQU1BLENBQUNBO1lBQ1hBLENBQUNBO1FBQ0xBLENBQUNBO1FBQ0RBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO1FBQy9CQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtJQUNsQ0EsQ0FBQ0E7SUFFREY7Ozs7T0FJR0E7SUFDSEEsdUJBQU1BLEdBQU5BLFVBQU9BLFFBQStCQTtRQUNsQ0csSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7UUFDN0NBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ2JBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBLENBQUNBLENBQUNB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O0FBRXhDLEFBREEsdUVBQXVFO1NBQ3ZELE9BQU8sQ0FBQyxVQUFxQjtJQUN6Q0MsSUFBSUEsQ0FBQ0EsR0FBR0Esa0JBQWtCQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQTtJQUNqREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsQ0FBQ0E7UUFDVkEsTUFBTUEsSUFBSUEsS0FBS0EsQ0FBQ0EsMkVBQTJFQSxDQUFDQSxDQUFDQTtJQUNqR0EsSUFBSUEsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7SUFDN0JBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO0FBQ3JDQSxDQUFDQTtBQU5lLGVBQU8sR0FBUCxPQU1mLENBQUE7QUFHRCxBQURBLGlEQUFpRDtTQUNqQyxRQUFRLENBQUMsR0FBYTtJQUNsQ0MsSUFBSUEsR0FBR0EsR0FBR0EsU0FBU0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7SUFDekJBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO0FBQzVCQSxDQUFDQTtBQUhlLGdCQUFRLEdBQVIsUUFHZixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gICBDb3B5cmlnaHQgMjAxMy0yMDE0IEZyYW7Dp29pcyBkZSBDYW1wcmVkb25cbi8vXG4vLyAgIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4vLyAgIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbi8vICAgWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4vL1xuLy8gICAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4vL1xuLy8gICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4vLyAgIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbi8vICAgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4vLyAgIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbi8vICAgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG5cbid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYXBWYWx1ZXM8VD4obWFwOiB7IFtpbmRleDogc3RyaW5nXTogVCB9KTogVFtdIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMobWFwKS5yZWR1Y2UoKHJlc3VsdDogVFtdLCBrZXk6IHN0cmluZykgPT4ge1xuICAgICAgICByZXN1bHQucHVzaChtYXBba2V5XSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSwgW10pO1xufVxuXG4vKipcbiAqIGFzc2lnbiBhbGwgcHJvcGVydGllcyBvZiBhIGxpc3Qgb2Ygb2JqZWN0IHRvIGFuIG9iamVjdFxuICogQHBhcmFtIHRhcmdldCB0aGUgb2JqZWN0IHRoYXQgd2lsbCByZWNlaXZlIHByb3BlcnRpZXNcbiAqIEBwYXJhbSBpdGVtcyBpdGVtcyB3aGljaCBwcm9wZXJ0aWVzIHdpbGwgYmUgYXNzaWduZWQgdG8gYSB0YXJnZXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQ6IGFueSwgLi4uaXRlbXM6IGFueVtdKTogYW55IHtcbiAgICByZXR1cm4gaXRlbXMucmVkdWNlKGZ1bmN0aW9uKHRhcmdldDogYW55LCBzb3VyY2U6IGFueSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoc291cmNlKS5yZWR1Y2UoKHRhcmdldDogYW55LCBrZXk6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgIH0sIHRhcmdldCk7XG4gICAgfSwgdGFyZ2V0KTtcbn1cblxuLyoqXG4gKiBjbG9uZSBhbiBvYmplY3QgKHNoYWxsb3cpXG4gKiBAcGFyYW0gdGFyZ2V0IHRoZSBvYmplY3QgdG8gY2xvbmVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsb25lPFQ+KHRhcmdldDogVCk6IFQge1xuICAgIHJldHVybiBhc3NpZ24oQXJyYXkuaXNBcnJheSh0YXJnZXQpID8gW10gOiB7fSwgdGFyZ2V0KTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBxdWljayBsb29rdXAgbWFwIGZyb20gbGlzdFxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTWFwKGFycjogKHN0cmluZ3xudW1iZXIpW10pOiB7IFtzdHJpbmc6IHN0cmluZ106IGJvb2xlYW47W251bWJlcjogbnVtYmVyXTogYm9vbGVhbiB9IHtcbiAgICByZXR1cm4gYXJyLnJlZHVjZSgocmVzdWx0OiB7IFtzdHJpbmc6IHN0cmluZ106IGJvb2xlYW4gfSwga2V5OiBzdHJpbmcpID0+IHtcbiAgICAgICAgcmVzdWx0W2tleV0gPSB0cnVlO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sIDx7IFtzdHJpbmc6IHN0cmluZ106IGJvb2xlYW4gfT57fSk7XG59XG5cblxuLyoqXG4gKiBicm93c2VyaWZ5IHBhdGgucmVzb2x2ZSBpcyBidWdneSBvbiB3aW5kb3dzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXRoUmVzb2x2ZShmcm9tOiBzdHJpbmcsIHRvOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHZhciByZXN1bHQgPSBwYXRoLnJlc29sdmUoZnJvbSwgdG8pO1xuICAgIHZhciBpbmRleCA9IHJlc3VsdC5pbmRleE9mKGZyb21bMF0pO1xuICAgIHJldHVybiByZXN1bHQuc2xpY2UoaW5kZXgpO1xufVxuXG5cbi8qKlxuICogQyMgbGlrZSBldmVudHMgYW5kIGRlbGVnYXRlcyBmb3IgdHlwZWQgZXZlbnRzXG4gKiBkaXNwYXRjaGluZ1xuICovXG5leHBvcnQgaW50ZXJmYWNlIElTaWduYWw8VD4ge1xuICAgIC8qKlxuICAgICAqIFN1YnNjcmliZXMgYSBsaXN0ZW5lciBmb3IgdGhlIHNpZ25hbC5cbiAgICAgKlxuICAgICAqIEBwYXJhbXMgbGlzdGVuZXIgdGhlIGNhbGxiYWNrIHRvIGNhbGwgd2hlbiBldmVudHMgYXJlIGRpc3BhdGNoZWRcbiAgICAgKiBAcGFyYW1zIHByaW9yaXR5IGFuIG9wdGlvbmFsIHByaW9yaXR5IGZvciB0aGlzIHNpZ25hbFxuICAgICAqL1xuICAgIGFkZChsaXN0ZW5lcjogKHBhcmFtZXRlcjogVCkgPT4gYW55LCBwcmlvcml0eT86IG51bWJlcik6IHZvaWQ7XG5cbiAgICAvKipcbiAgICAgKiB1bnN1YnNjcmliZSBhIGxpc3RlbmVyIGZvciB0aGUgc2lnbmFsXG4gICAgICpcbiAgICAgKiBAcGFyYW1zIGxpc3RlbmVyIHRoZSBwcmV2aW91c2x5IHN1YnNjcmliZWQgbGlzdGVuZXJcbiAgICAgKi9cbiAgICByZW1vdmUobGlzdGVuZXI6IChwYXJhbWV0ZXI6IFQpID0+IGFueSk6IHZvaWQ7XG5cbiAgICAvKipcbiAgICAgKiBkaXNwYXRjaCBhbiBldmVudFxuICAgICAqXG4gICAgICogQHBhcmFtcyBwYXJhbWV0ZXIgdGhlIHBhcmFtZXRlciBhdHRhY2hlZCB0byB0aGUgZXZlbnQgZGlzcGF0Y2hpbmdcbiAgICAgKi9cbiAgICBkaXNwYXRjaChwYXJhbWV0ZXI/OiBUKTogYm9vbGVhbjtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbGwgbGlzdGVuZXIgZnJvbSB0aGUgc2lnbmFsXG4gICAgICovXG4gICAgY2xlYXIoKTogdm9pZDtcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgbGlzdGVuZXIgaGFzIGJlZW4gc3Vic3JpYmVkIHRvIHRoaXMgc2lnbmFsXG4gICAgICovXG4gICAgaGFzTGlzdGVuZXJzKCk6IGJvb2xlYW47XG59XG5cblxuZXhwb3J0IGNsYXNzIFNpZ25hbDxUPiBpbXBsZW1lbnRzIElTaWduYWw8VD4ge1xuXG4gICAgLyoqXG4gICAgICogbGlzdCBvZiBsaXN0ZW5lcnMgdGhhdCBoYXZlIGJlZW4gc3VzY3JpYmVkIHRvIHRoaXMgc2lnbmFsXG4gICAgICovXG4gICAgcHJpdmF0ZSBsaXN0ZW5lcnM6IHsgKHBhcmFtZXRlcjogVCk6IGFueSB9W10gPSBbXTtcblxuICAgIC8qKlxuICAgICAqIFByaW9yaXRpZXMgY29ycmVzcG9uZGluZyB0byB0aGUgbGlzdGVuZXJzXG4gICAgICovXG4gICAgcHJpdmF0ZSBwcmlvcml0aWVzOiBudW1iZXJbXSA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogU3Vic2NyaWJlcyBhIGxpc3RlbmVyIGZvciB0aGUgc2lnbmFsLlxuICAgICAqXG4gICAgICogQHBhcmFtcyBsaXN0ZW5lciB0aGUgY2FsbGJhY2sgdG8gY2FsbCB3aGVuIGV2ZW50cyBhcmUgZGlzcGF0Y2hlZFxuICAgICAqIEBwYXJhbXMgcHJpb3JpdHkgYW4gb3B0aW9uYWwgcHJpb3JpdHkgZm9yIHRoaXMgc2lnbmFsXG4gICAgICovXG4gICAgYWRkKGxpc3RlbmVyOiAocGFyYW1ldGVyOiBUKSA9PiBhbnksIHByaW9yaXR5ID0gMCk6IHZvaWQge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgdGhpcy5wcmlvcml0aWVzW2luZGV4XSA9IHByaW9yaXR5O1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5wcmlvcml0aWVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJpb3JpdGllc1tpXSA8IHByaW9yaXR5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcmlvcml0aWVzLnNwbGljZShpLCAwLCBwcmlvcml0eSk7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnMuc3BsaWNlKGksIDAsIGxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcmlvcml0aWVzLnB1c2gocHJpb3JpdHkpO1xuICAgICAgICB0aGlzLmxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB1bnN1YnNjcmliZSBhIGxpc3RlbmVyIGZvciB0aGUgc2lnbmFsXG4gICAgICpcbiAgICAgKiBAcGFyYW1zIGxpc3RlbmVyIHRoZSBwcmV2aW91c2x5IHN1YnNjcmliZWQgbGlzdGVuZXJcbiAgICAgKi9cbiAgICByZW1vdmUobGlzdGVuZXI6IChwYXJhbWV0ZXI6IFQpID0+IGFueSk6IHZvaWQge1xuICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmxpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICAgIHRoaXMucHJpb3JpdGllcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGRpc3BhdGNoIGFuIGV2ZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW1zIHBhcmFtZXRlciB0aGUgcGFyYW1ldGVyIGF0dGFjaGVkIHRvIHRoZSBldmVudCBkaXNwYXRjaGluZ1xuICAgICAqL1xuICAgIGRpc3BhdGNoKHBhcmFtZXRlcj86IFQpOiBib29sZWFuIHtcbiAgICAgICAgdmFyIGhhc0JlZW5DYW5jZWxlZCA9IHRoaXMubGlzdGVuZXJzLmV2ZXJ5KChsaXN0ZW5lcjogKHBhcmFtZXRlcjogVCkgPT4gYW55KSA9PiB7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbGlzdGVuZXIocGFyYW1ldGVyKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQgIT09IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gaGFzQmVlbkNhbmNlbGVkO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbGwgbGlzdGVuZXIgZnJvbSB0aGUgc2lnbmFsXG4gICAgICovXG4gICAgY2xlYXIoKTogdm9pZCB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgICAgIHRoaXMucHJpb3JpdGllcyA9IFtdO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4gdHJ1ZSBpZiB0aGUgbGlzdGVuZXIgaGFzIGJlZW4gc3Vic3JpYmVkIHRvIHRoaXMgc2lnbmFsXG4gICAgICovXG4gICAgaGFzTGlzdGVuZXJzKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5saXN0ZW5lcnMubGVuZ3RoID4gMDtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5hcnlTZWFyY2goYXJyYXk6IG51bWJlcltdLCB2YWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICB2YXIgbG93ID0gMDtcbiAgICB2YXIgaGlnaCA9IGFycmF5Lmxlbmd0aCAtIDE7XG5cbiAgICB3aGlsZSAobG93IDw9IGhpZ2gpIHtcbiAgICAgICAgdmFyIG1pZGRsZSA9IGxvdyArICgoaGlnaCAtIGxvdykgPj4gMSk7XG4gICAgICAgIHZhciBtaWRWYWx1ZSA9IGFycmF5W21pZGRsZV07XG5cbiAgICAgICAgaWYgKG1pZFZhbHVlID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIG1pZGRsZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChtaWRWYWx1ZSA+IHZhbHVlKSB7XG4gICAgICAgICAgICBoaWdoID0gbWlkZGxlIC0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxvdyA9IG1pZGRsZSArIDE7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gfmxvdztcbn1cblxuLy8gTm90IG9wdGltaXplZFxuZXhwb3J0IGZ1bmN0aW9uIHNlbGVjdE1hbnk8VD4oYXJyOiBUW11bXSk6IFRbXSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYXJyW2ldLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChhcnJbaV1bal0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbi8vIE5vdCBwYXJ0aWN1bGFybHkgYXdlc29tZSBlLmcuICcvLi5mb28nIHdpbGwgcGFzc1xuZXhwb3J0IGZ1bmN0aW9uIHBhdGhJc1JlbGF0aXZlKHN0cjogc3RyaW5nKSB7XG4gICAgaWYgKCFzdHIubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHN0clswXSA9PSAnLicgfHwgc3RyLnN1YnN0cmluZygwLCAyKSA9PSBcIi4vXCIgfHwgc3RyLnN1YnN0cmluZygwLCAzKSA9PSBcIi4uL1wiO1xufVxuXG4vKiogS2V5IGlzIHN0cmluZy4gTm90ZTogdGhpcyBkYXRhIHN0cnVjdHVyZSBtaWdodCBoYXZlIGJlZW4gYSBiYWQgaWRlYS4gU29ycnkuICovXG5leHBvcnQgY2xhc3MgRGljdDxUPntcbiAgICBwdWJsaWMgdGFibGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIGNvbnN0cnVjdG9yKCkgeyB9XG4gICAgc2V0VmFsdWUoa2V5OiBzdHJpbmcsIGl0ZW06IFQpIHtcbiAgICAgICAgdGhpcy50YWJsZVtrZXldID0gaXRlbTtcbiAgICB9XG4gICAgZ2V0VmFsdWUoa2V5OiBzdHJpbmcpIHsgcmV0dXJuIHRoaXMudGFibGVba2V5XTsgfVxuICAgIGNsZWFyVmFsdWUoa2V5OiBzdHJpbmcpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMudGFibGVba2V5XTtcbiAgICB9XG4gICAgY2xlYXJBbGwoKSB7IHRoaXMudGFibGUgPSBPYmplY3QuY3JlYXRlKG51bGwpOyB9XG4gICAga2V5cygpIHsgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMudGFibGUpOyB9XG4gICAgdmFsdWVzKCk6IFRbXSB7XG4gICAgICAgIHZhciBhcnJheSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy50YWJsZSkge1xuICAgICAgICAgICAgYXJyYXkucHVzaCh0aGlzLnRhYmxlW2tleV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcnJheTtcbiAgICB9XG59XG5cbi8qKiBmb3IgdGVzdGluZyB1aSBsYWdzIG9ubHkgKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWxheShzZWNvbmRzOiBudW1iZXIgPSAyKSB7XG4gICAgZGVsYXlNaWxsaXNlY29uZHMoc2Vjb25kcyAqIDEwMDApO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRlbGF5TWlsbGlzZWNvbmRzKG1pbGxpc2Vjb25kczogbnVtYmVyID0gMTAwKSB7XG4gICAgLy8gRGVsYXkgdGhlIHRocmVhZFxuICAgIHZhciBkMSA9IG5ldyBEYXRlKCk7XG4gICAgdmFyIGQyID0gbmV3IERhdGUoKTtcbiAgICB3aGlsZSAoZDIudmFsdWVPZigpIDwgZDEudmFsdWVPZigpICsgbWlsbGlzZWNvbmRzKSB7XG4gICAgICAgIGQyID0gbmV3IERhdGUoKTtcbiAgICB9XG59O1xuXG52YXIgbm93ID0gKCkgPT4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZTxUIGV4dGVuZHMgRnVuY3Rpb24+KGZ1bmM6IFQsIG1pbGxpc2Vjb25kczogbnVtYmVyLCBpbW1lZGlhdGUgPSBmYWxzZSk6IFQge1xuICAgIHZhciB0aW1lb3V0LCBhcmdzLCBjb250ZXh0LCB0aW1lc3RhbXAsIHJlc3VsdDtcblxuICAgIHZhciB3YWl0ID0gbWlsbGlzZWNvbmRzO1xuXG4gICAgdmFyIGxhdGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBsYXN0ID0gbm93KCkgLSB0aW1lc3RhbXA7XG5cbiAgICAgICAgaWYgKGxhc3QgPCB3YWl0ICYmIGxhc3QgPiAwKSB7XG4gICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCAtIGxhc3QpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICBpZiAoIWltbWVkaWF0ZSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIDxhbnk+ZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICB0aW1lc3RhbXAgPSBub3coKTtcbiAgICAgICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgICAgIGlmICghdGltZW91dCkgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgICAgICBpZiAoY2FsbE5vdykge1xuICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICAgIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbn07XG5cbnZhciBwdW5jdHVhdGlvbnMgPSBjcmVhdGVNYXAoWyc7JywgJ3snLCAnfScsICcoJywgJyknLCAnLicsICc6JywgJzwnLCAnPicsIFwiJ1wiLCAnXCInXSk7XG5leHBvcnQgdmFyIHByZWZpeEVuZHNJblB1bmN0dWF0aW9uID0gKHByZWZpeCkgPT4gcHJlZml4Lmxlbmd0aCAmJiBwcmVmaXgudHJpbSgpLmxlbmd0aCAmJiBwdW5jdHVhdGlvbnNbcHJlZml4LnRyaW0oKVtwcmVmaXgudHJpbSgpLmxlbmd0aCAtIDFdXTtcblxudmFyIG5hbWVFeHRyYWN0b3JSZWdleCA9IC9yZXR1cm4gKC4qKTsvO1xuLyoqIEdldCB0aGUgbmFtZSB1c2luZyBhIGxhbWJkYSBzbyB0aGF0IHlvdSBkb24ndCBoYXZlIG1hZ2ljIHN0cmluZ3MgKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lKG5hbWVMYW1iZGE6ICgpID0+IGFueSkge1xuICAgIHZhciBtID0gbmFtZUV4dHJhY3RvclJlZ2V4LmV4ZWMobmFtZUxhbWJkYSArIFwiXCIpO1xuICAgIGlmIChtID09IG51bGwpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBmdW5jdGlvbiBkb2VzIG5vdCBjb250YWluIGEgc3RhdGVtZW50IG1hdGNoaW5nICdyZXR1cm4gdmFyaWFibGVOYW1lOydcIik7XG4gICAgdmFyIGFjY2VzcyA9IG1bMV0uc3BsaXQoJy4nKTtcbiAgICByZXR1cm4gYWNjZXNzW2FjY2Vzcy5sZW5ndGggLSAxXTtcbn1cblxuLyoqIFNsb3BweSBidXQgZWZmZWN0aXZlIGNvZGUgdG8gZmluZCBkaXN0aW5jdCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3RpbmN0KGFycjogc3RyaW5nW10pOiBzdHJpbmdbXSB7XG4gICAgdmFyIG1hcCA9IGNyZWF0ZU1hcChhcnIpO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufSJdfQ==
//# sourceURL=/Users/anas/.atom/packages/atom-typescript/lib/main/lang/utils.ts
