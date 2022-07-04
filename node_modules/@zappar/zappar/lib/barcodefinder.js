"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarcodeFinder = void 0;
const event_1 = require("./event");
const zappar_cv_1 = require("@zappar/zappar-cv");
const zappar_1 = require("./zappar");
/**
 * Detects barcodes in the images from the camera.
 */
class BarcodeFinder {
    /**
     * Constructs a new BarcodeFinder.
     * @param _pipeline - The pipeline that this BarcodeFinder will operate within.
    */
    constructor(_pipeline) {
        this._pipeline = _pipeline;
        /**
        * Emitted when a barcode becomes visible in a camera frame.
        */
        this.onDetection = new event_1.Event1();
        this._lastDetected = [];
        this._found = [];
        this._formats = [];
        this._frameUpdate = () => {
            this._found = [];
            const num = this._z.barcode_finder_found_number(this._impl);
            for (let i = 0; i < num; i++) {
                this._found.push({
                    text: this._z.barcode_finder_found_text(this._impl, i),
                    format: this._z.barcode_finder_found_format(this._impl, i)
                });
            }
            if (this._found.length === 0)
                return;
            outerloop: for (const entry of this._found) {
                for (const previous of this._lastDetected) {
                    if (previous.text === entry.text)
                        continue outerloop;
                }
                this.onDetection.emit(entry);
            }
            this._lastDetected = this._found;
        };
        this._pipeline._onFrameUpdateInternal.bind(this._frameUpdate);
        this._z = zappar_1.z();
        this._impl = this._z.barcode_finder_create(this._pipeline._getImpl());
        this._formats.push.apply(this._formats, [
            zappar_cv_1.barcode_format_t.AZTEC,
            zappar_cv_1.barcode_format_t.CODABAR,
            zappar_cv_1.barcode_format_t.CODE_39,
            zappar_cv_1.barcode_format_t.CODE_93,
            zappar_cv_1.barcode_format_t.CODE_128,
            zappar_cv_1.barcode_format_t.DATA_MATRIX,
            zappar_cv_1.barcode_format_t.EAN_8,
            zappar_cv_1.barcode_format_t.EAN_13,
            zappar_cv_1.barcode_format_t.ITF,
            zappar_cv_1.barcode_format_t.MAXICODE,
            zappar_cv_1.barcode_format_t.PDF_417,
            zappar_cv_1.barcode_format_t.QR_CODE,
            zappar_cv_1.barcode_format_t.RSS_14,
            zappar_cv_1.barcode_format_t.RSS_EXPANDED,
            zappar_cv_1.barcode_format_t.UPC_A,
            zappar_cv_1.barcode_format_t.UPC_E,
            zappar_cv_1.barcode_format_t.UPC_EAN_EXTENSION
        ]);
    }
    /**
     * Destroys the barcode finder.
     */
    destroy() {
        this._pipeline._onFrameUpdateInternal.unbind(this._frameUpdate);
        this._found = [];
        this._lastDetected = [];
        this._z.barcode_finder_destroy(this._impl);
    }
    /**
      * Returns an array of discovered barcodes
      */
    get found() {
        return this._found;
    }
    /**
     * Gets/sets the enabled state of the barcode finder.
     * Disable when not in use to save computational resources during frame processing.
    */
    get enabled() {
        return this._z.barcode_finder_enabled(this._impl);
    }
    set enabled(e) {
        this._z.barcode_finder_enabled_set(this._impl, e);
    }
    /**
      * Gets/sets the barcode formats to scan for.
      */
    get formats() {
        return this._formats;
    }
    set formats(f) {
        this._formats = f.slice();
        let underlying = 0;
        for (const format of this._formats) {
            underlying |= format;
        }
        this._z.barcode_finder_formats_set(this._impl, underlying);
    }
}
exports.BarcodeFinder = BarcodeFinder;
