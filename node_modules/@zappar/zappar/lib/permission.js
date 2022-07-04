"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionDeniedUI = exports.permissionRequestUI = exports.permissionRequest = exports.permissionDenied = exports.permissionGranted = exports.Permission = void 0;
const zappar_1 = require("./zappar");
/**
 * The permissions that may be requested.
*/
var Permission;
(function (Permission) {
    /**
    * Permission to access camera images.
    */
    Permission[Permission["CAMERA"] = 0] = "CAMERA";
    /**
     * Permission to access device motion data (e.g. accelerometer and gyro). Some tracking algorithms require this data to operate.
     */
    Permission[Permission["MOTION"] = 1] = "MOTION";
})(Permission = exports.Permission || (exports.Permission = {}));
/**
 * Checks if the browser has currently granted relevant permissions.
 * @param onlyPermsission - The exclusive permission to query, otherwise all are queried.
 * @returns The permission granted state. 'true' if permission is granted.
*/
function permissionGranted(onlyPermsission) {
    switch (onlyPermsission) {
        case Permission.CAMERA: return zappar_1.z().permission_granted_camera();
        case Permission.MOTION: return zappar_1.z().permission_granted_motion();
        default: return zappar_1.z().permission_granted_all();
    }
}
exports.permissionGranted = permissionGranted;
/**
 * Checks if the browser has currently denied relevant permissions.
 * @param onlyPermsission - The exclusive permission to query, otherwise all are queried.
 * @returns The permission granted state. 'true' if permission is denied.
*/
function permissionDenied(onlyPermission) {
    switch (onlyPermission) {
        case Permission.CAMERA: return zappar_1.z().permission_denied_camera();
        case Permission.MOTION: return zappar_1.z().permission_denied_motion();
        default: return zappar_1.z().permission_denied_any();
    }
}
exports.permissionDenied = permissionDenied;
/**
 * Requests the browser to grant relevant permissions.
 *
 * This may or may not trigger a browser-provided user dialog prompting a permission choice.
 *
 * @param onlyPermission - The exclusive permission to query, otherwise all are requested.
 * @returns A Promise containing granted status. 'true' if granted.
*/
function permissionRequest(onlyPermission) {
    switch (onlyPermission) {
        case Permission.CAMERA:
            zappar_1.z().permission_request_camera();
            break;
        case Permission.MOTION:
            zappar_1.z().permission_request_motion();
            break;
        default:
            zappar_1.z().permission_request_all();
            break;
    }
    // eslint-disable-next-line no-async-promise-executor
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line no-constant-condition
        while (true) {
            yield _nextFrame();
            switch (onlyPermission) {
                case Permission.CAMERA:
                    if (zappar_1.z().permission_granted_camera()) {
                        resolve(true);
                        return;
                    }
                    if (zappar_1.z().permission_denied_camera()) {
                        resolve(false);
                        return;
                    }
                    break;
                case Permission.MOTION:
                    if (zappar_1.z().permission_granted_motion()) {
                        resolve(true);
                        return;
                    }
                    if (zappar_1.z().permission_denied_motion()) {
                        resolve(false);
                        return;
                    }
                    break;
                default:
                    if (zappar_1.z().permission_granted_camera() && zappar_1.z().permission_granted_motion()) {
                        resolve(true);
                        return;
                    }
                    if (zappar_1.z().permission_denied_camera() || zappar_1.z().permission_denied_motion()) {
                        resolve(false);
                        return;
                    }
                    break;
            }
        }
    }));
}
exports.permissionRequest = permissionRequest;
/**
 * Shows Zappar's built-in UI to request camera and motion data permissions
 * @returns A promise containing granted status.
*/
function permissionRequestUI() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield zappar_1.z().permission_request_ui_promise();
    });
}
exports.permissionRequestUI = permissionRequestUI;
/**
 * Shows Zappar's built-in permission denied UI.
*/
function permissionDeniedUI() {
    return zappar_1.z().permission_denied_ui();
}
exports.permissionDeniedUI = permissionDeniedUI;
function _nextFrame() {
    return new Promise(resolve => requestAnimationFrame(() => resolve()));
}
