/* jshint node: true, esversion: 6 */
'use strict';

class Document {

    constructor(patientId, category, date, tags, payload) {
        this.patientId = patientId;
        this.category = category;
        this.date = date;
        this.tags = tags;
        this.payload = payload;
    }
}

module.exports = Document;
