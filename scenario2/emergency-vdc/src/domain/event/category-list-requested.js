/* jshint node: true, esversion: 6 */
'use strict';

class CategoryListRequested {
    
    constructor(token, patientId) {
        this.token = token;
        this.patientId = patientId;
    }
}

module.exports = CategoryListRequested;
