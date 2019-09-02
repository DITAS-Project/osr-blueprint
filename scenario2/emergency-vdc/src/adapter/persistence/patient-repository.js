/* jshint node: true, esversion: 6 */
'use strict';

const Patient = require('../../domain/model/patient');

const Maybe = require('folktale/maybe'),
    PromiseResult = require('@fcsr/base/ext/folktale/promise-result');

class GrpcPatientRepository {
    constructor(query) {
        this.query = query;
    }

    findBySocialId(token, socialId) {
        let eHealthQueryRequest = {
            dalMessageProperties: {
                purpose: '',
                requesterId: '',
                authorization: token.value
            },
            dalPrivacyProperties: {
                privacyZone: 0
            },
            query: `SELECT addressCity,
                           addressRoad,
                           addressRoadNumber,
                           addressPostalCode,
                           addressTelephoneNumber,
                           birthCity,
                           nationality,
                           job,
                           schoolYears,
                           birthDate,
                           gender,
                           name,
                           patientId,
                           socialId,
                           surname
                    FROM patient 
                    WHERE socialId = '?'`,
            queryParameters: [socialId]
        };

        return this.query(eHealthQueryRequest)
            .chain(function (message) {
                return PromiseResult.of(
                    Maybe.fromNullable(message.values[0])
                        .map(JSON.parse)
                        .map(makePatient)
                );
            });
    }
}

function makePatient(tuple) {
    return new Patient(
        tuple.addressCity,
        tuple.addressRoad,
        tuple.addressRoadNumber,
        tuple.addressPostalCode,
        tuple.addressTelephoneNumber,
        tuple.birthCity,
        tuple.nationality,
        tuple.job,
        tuple.schoolYears,
        tuple.birthDate,
        tuple.gender,
        tuple.name,
        tuple.patientId,
        tuple.socialId,
        tuple.surname,
        tuple.familyDoctorId);
}

module.exports = GrpcPatientRepository;
