"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event1 = exports.Event = void 0;
/**
 * A type-safe event handling class that multiple functions to be registered to be called when events are emitted.
 */
class Event {
    constructor() {
        this._funcs = [];
    }
    /**
     * Bind new handler function.
     * @param f - The callback function to be bound.
     */
    bind(f) {
        this._funcs.push(f);
    }
    /**
     * Unbind an existing handler function.
     * @param f - The callback function to be unbound.
     */
    unbind(f) {
        const indx = this._funcs.indexOf(f);
        if (indx > -1) {
            this._funcs.splice(indx, 1);
        }
    }
    /**
     * Emit an event, calling the bound handler functions.
     */
    emit() {
        for (let i = 0, total = this._funcs.length; i < total; i++) {
            this._funcs[i]();
        }
    }
}
exports.Event = Event;
/**
 * A type-safe event handling class that multiple functions to be registered to be called when events are emitted.
 * This class will pass a single argument supplied to [[emit]] to the handler functions.
 *
 * @typeparam A - The type of the argument passed to the handler functions through [[emit]].
 */
class Event1 {
    constructor() {
        this._funcs = [];
    }
    /**
     * Bind new handler function.
     * @param f - The callback function to be bound.
    */
    bind(f) {
        this._funcs.push(f);
    }
    /**
     * Unbind an existing function.
     * @param f - The callback function to be unbound.
     */
    unbind(f) {
        const indx = this._funcs.indexOf(f);
        if (indx > -1) {
            this._funcs.splice(indx, 1);
        }
    }
    /**
     * Emit an event.
     *
     * @param a - The argument to pass to handler functions.
     */
    emit(a) {
        for (let i = 0, total = this._funcs.length; i < total; i++) {
            this._funcs[i](a);
        }
    }
}
exports.Event1 = Event1;
