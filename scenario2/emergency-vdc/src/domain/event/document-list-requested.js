/* jshint node: true, esversion: 6 */
'use strict';

class DocumentListRequested {
    
    constructor(token, patientId, category, timePeriod, limit, tags) {
        this.token = token;
        this.patientId = patientId;
        this.category = category;
        this.timePeriod = timePeriod;
        this.limit = limit;
        this.tags = tags;
    }
}

module.exports = DocumentListRequested;
