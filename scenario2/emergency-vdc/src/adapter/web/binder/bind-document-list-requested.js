/* jshint node: true, esversion: 6 */
'use strict';

const { Validation } = require('@fcsr/base/ext/folktale'),
    { Maybe } = require('@fcsr/base/ext/folktale'),
    moment = require('moment'),
    R = require('ramda'),
    { toCallback } = require('@fcsr/base/control');

const TimePeriod = require('../../../domain/model/time-period'),
    DALToken = require('../../../domain/model/dal-token'),
    Category = require('../../../domain/model/category'),
    DocumentListRequested = require('../../../domain/event/document-list-requested');

function bindDocumentListRequested(req) {
    let validated = R.lift(R.construct(DocumentListRequested))(
        validateDALToken(req.headers.authorization),
        validatePatientId(req.params.patientId),
        validateCategory(req.params.category),
        validateTimePeriod(req.query.since, req.query.until),
        validateLimit(req.query.limit),
        validateTags(req.query.tags)
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

function validateCategory(category) {
    let CategoryL = R.lift(R.construct(Category));
    return CategoryL(validateLabels(category));
}

function validateLabels(labels) {
    if (!labels || labels.length == 0) return Validation.Success([]);
    return Validation.Success(labels.split('-'));
}

function validateTimePeriod(since, until) {
    let TimePeriodL = R.lift(R.construct(TimePeriod));
    return TimePeriodL(validateTimestamp(since), validateTimestamp(until));
}

function validateTimestamp(timestamp) {
    if (!timestamp) return Validation.Success(Maybe.Nothing());
    if (moment(timestamp, moment.ISO_8601, true).isValid()) return Validation.Success(Maybe.of(timestamp));
    return Validation.Failure(['timestamp should be a valid ISO date string']);
}

function validateLimit(limit) {
    if (!limit) return Validation.Success(Maybe.Nothing());
    if (isNaN(limit)) return Validation.Failure(['limit should be a positive integer']);
    let intLimit = parseInt(limit);
    if (intLimit < 0) return Validation.Failure(['limit should be a positive integer']);
    return Validation.Success(Maybe.of(intLimit));
}

function validateTags(tags) {
    if (!tags || tags.length == 0) return Validation.Success([]);
    if (Array.isArray(tags)) return Validation.Success(tags);
    return Validation.Success(Array.of(tags));
}

module.exports = bindDocumentListRequested;
