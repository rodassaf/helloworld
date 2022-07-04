"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLogLevel = exports.logLevel = exports.LogLevel = void 0;
const zappar_1 = require("./zappar");
var zappar_cv_1 = require("@zappar/zappar-cv");
Object.defineProperty(exports, "LogLevel", { enumerable: true, get: function () { return zappar_cv_1.log_level_t; } });
/**
 * @returns The granularity of logging emitted by the library.
*/
function logLevel() {
    return zappar_1.z().log_level();
}
exports.logLevel = logLevel;
/**
 * Sets the granularity of logging emitted by the library.
*/
function setLogLevel(l) {
    zappar_1.z().log_level_set(l);
}
exports.setLogLevel = setLogLevel;
