/* jshint node: true, esversion: 6 */
'use strict';

const { matchWith } = require('@fcsr/base/ext/folktale');

const { AuthorizationFailed, ServiceUnavailable } = require('./error');

class FindCategoryListService {
    constructor(repository) {
        this.repository = repository;
    }

    handle(token, patientId) {
        return this.repository.findByPatientId(token, patientId)
            .mapError(matchWith({
                InvalidDALToken: () => new AuthorizationFailed('The provided DAL token is not valid'),
                UnexpectedDALError: () => new ServiceUnavailable('The DAL returned an unexpected error'),
                UnreachableDAL: () => new ServiceUnavailable('Cannot retrieve patient info since the DAL is unavailable'),
            }));
    }
}

module.exports = FindCategoryListService;
