"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaceLandmark = exports.FaceLandmarkName = void 0;
const zappar_1 = require("./zappar");
const gl_matrix_1 = require("gl-matrix");
var zappar_cv_1 = require("@zappar/zappar-cv");
Object.defineProperty(exports, "FaceLandmarkName", { enumerable: true, get: function () { return zappar_cv_1.face_landmark_name_t; } });
/**
 * Attaches content to a known point (landmark) on a face as it moves around in the camera view.
 * Landmarks will remain accurate, even as the user's expression changes.
 * @see https://docs.zap.works/universal-ar/javascript/face-tracking/
 */
class FaceLandmark {
    /**
     * Constructs a new FaceLanmdmark.
     * @param _name - The name of the landmark to track.
     * @see https://docs.zap.works/universal-ar/javascript/face-tracking/
    */
    constructor(_name) {
        this._name = _name;
        /**
         * The most recent pose of this landmark, relative to the [[FaceAnchor]] used to update it.
         * A 4x4 column-major transformation matrix.
         */
        this.pose = gl_matrix_1.mat4.create();
        this._z = zappar_1.z();
        this._impl = this._z.face_landmark_create(this._name);
    }
    /**
     * Destroys the face landmark.
     */
    destroy() {
        this._z.face_landmark_destroy(this._impl);
    }
    /**
     * Updates pose directly from the expression and identity in a [[FaceAnchor]].
     * @param f - The anchor to derive the expression and identity from.
     * @param mirror - Pass `true` to mirror the location in the X-axis.
    */
    updateFromFaceAnchor(f, mirror) {
        this._z.face_landmark_update(this._impl, f.identity, f.expression, mirror || false);
        this.pose = this._z.face_landmark_anchor_pose(this._impl);
    }
    /**
     * Updates pose directly from identity and expression coefficients.
     * @param identity  - The identity coefficients.
     * @param expression - The expression coefficients.
     * @param mirror - Pass `true` to mirror the location in the X-axis.
    */
    updateFromIdentityExpression(identity, expression, mirror) {
        this._z.face_landmark_update(this._impl, identity, expression, mirror || false);
        this.pose = this._z.face_landmark_anchor_pose(this._impl);
    }
    /**
     * @ignore
    */
    _getImpl() {
        return this._impl;
    }
}
exports.FaceLandmark = FaceLandmark;
