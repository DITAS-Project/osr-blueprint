/* jshint node: true, esversion: 6 */
'use strict';

const { Validation } = require('@fcsr/base/ext/folktale'),
    R = require('ramda'),
    { toCallback } = require('@fcsr/base/control');

const DALToken = require('../../../domain/model/dal-token'),
    CategoryListRequested = require('../../../domain/event/category-list-requested');

function bindCategoryListRequested(req) {
    let validated = R.lift(R.construct(CategoryListRequested))(
        validateDALToken(req.headers.authorization),
        validatePatientId(req.params.patientId)
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

function validatePatientId(patientId) {
    if (!patientId || patientId.length == 0) return Validation.Failure(['patientId should be a string with at least 1 char']);
    return Validation.Success(patientId);
}

module.exports = bindCategoryListRequested;
