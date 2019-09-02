/* jshint node: true, esversion: 6 */
'use strict';

const { Validation } = require('@fcsr/base/ext/folktale'),
    R = require('ramda'),
    { toCallback } = require('@fcsr/base/control');

let PatientRequested = require('../../../domain/event/patient-requested'),
    DALToken = require('../../../domain/model/dal-token');

function bindPatientRequested(req) {
    let validated = R.lift(R.construct(PatientRequested))(
        validateDALToken(req.headers.authorization),
        validateSocialId(req.params.socialId)
    );
    return toCallback(validated);
}

function validateDALToken(header) {
    if (!header || header.length == 0) return Validation.Failure(['missing authorization header']);
    let DALTokenL = R.lift(R.construct(DALToken));
    return DALTokenL(validateDALTokenValue(header));
}

function validateDALTokenValue(string) {
    let [type, value, ...others] = string.split(' ');
    if (type !== 'Bearer') return Validation.Failure(['authorization header should be a Bearer token']);
    return Validation.Success(value);
}

function validateSocialId(string) {
    if (!string || string.length == 0) return Validation.Failure(['patient ssn should be a string with at least 1 char']);
    return Validation.Success(string);
}

module.exports = bindPatientRequested;
