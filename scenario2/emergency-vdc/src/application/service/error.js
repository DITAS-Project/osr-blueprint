/* jshint node: true, esversion: 6 */
'use strict';

const union = require('folktale/adt/union/union');

const ApplicationError = union('ApplicationError', {

    ServiceUnavailable(message) {
        return {message};
    },

    AuthorizationFailed(message) {
        return {message};
    }
});

module.exports = ApplicationError;
