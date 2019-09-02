/* jshint node: true, esversion: 6 */
'use strict';

class Patient {

    constructor(addressCity, addressRoad, addressRoadNumber, addressPostalCode,
        addressTelephoneNumber, birthCity, nationality, job,
        schoolYears, birthDate, gender, name, patientId, socialId,
        surname, familyDoctorId) {
        this.addressCity = addressCity;
        this.addressRoad = addressRoad;
        this.addressRoadNumber = addressRoadNumber;
        this.addressPostalCode = addressPostalCode;
        this.addressTelephoneNumber = addressTelephoneNumber;
        this.birthCity = birthCity;
        this.nationality = nationality;
        this.job = job;
        this.schoolYears = schoolYears;
        this.birthDate = birthDate;
        this.gender = gender;
        this.name = name;
        this.patientId = patientId;
        this.socialId = socialId;
        this.surname = surname;
        this.familyDoctorId = familyDoctorId;
    }
}

module.exports = Patient;
