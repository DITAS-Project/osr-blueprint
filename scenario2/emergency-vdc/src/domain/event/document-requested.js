/* jshint node: true, esversion: 6 */
'use strict';

class DocumentRequested {
    
    constructor(token, patientId, category, timePeriod, limit, tags, position) {
        this.token = token;
        this.patientId = patientId;
        this.category = category;
        this.timePeriod = timePeriod;
        this.limit = limit;
        this.tags = tags;
        this.position = position;
    }
}

module.exports = DocumentRequested;
