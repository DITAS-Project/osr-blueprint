/* jshint node: true, esversion: 6 */
'use strict';

const union = require('folktale/adt/union/union');

const DomainError = union('DomainError', {

    UnreachableDAL() {
        return {name: 'unreachable DAL'}
    },

    InvalidDALToken() {
        return {name: 'invalid doctor token'};
    },

    UnexpectedDALError() {
        return {name: 'unexpected DAL error'};
    }
});

module.exports = DomainError;
