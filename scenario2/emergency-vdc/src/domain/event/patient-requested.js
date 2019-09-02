/* jshint node: true, esversion: 6 */
'use strict';

class PatientRequested {
    
    constructor(token, socialId) {
        this.token = token;
        this.socialId = socialId;
    }
}

module.exports = PatientRequested;
