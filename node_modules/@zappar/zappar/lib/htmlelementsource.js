"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLElementSource = void 0;
const zappar_1 = require("./zappar");
/**
 * Creates a source of frames from a HTML <video> or <img> element.
 * @see https://docs.zap.works/universal-ar/javascript/pipelines-and-camera-processing/
 */
class HTMLElementSource {
    /**
     * Constructs a new HTMLElementSource.
     * @param pipeline - The pipeline that this tracker will operate within.
     * @param element -  The HTML source element.
    */
    constructor(pipeline, element) {
        this._z = zappar_1.z();
        this._impl = this._z.html_element_source_create(pipeline._getImpl(), element);
    }
    /**
    * Destroys the source.
    */
    destroy() {
        this._z.html_element_source_destroy(this._impl);
    }
    /**
    * Starts the source sending frames into the pipeline.
    *
    * Starting a given source pauses any other sources within the same pipeline.
    */
    start() {
        this._z.html_element_source_start(this._impl);
    }
    /**
    * Pauses the source.
    */
    pause() {
        this._z.html_element_source_pause(this._impl);
    }
}
exports.HTMLElementSource = HTMLElementSource;
