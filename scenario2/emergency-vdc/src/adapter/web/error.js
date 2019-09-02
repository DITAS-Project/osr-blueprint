/* jshint node: true, esversion: 6 */
'use strict';

const union = require('folktale/adt/union/union');

const HttpError = union('HttpError', {

    Forbidden(message) {
        return {message};
    },

    BadRequest(errors) {
        return {errors};
    },

    ServiceUnavailable(message) {
        return {message};
    }

});

module.exports = HttpError;
