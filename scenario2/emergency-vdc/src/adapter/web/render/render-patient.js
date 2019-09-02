/*jshint node: true, esversion: 6 */
'use strict';

const URI = require('urijs'),
    { toCallback } = require('@fcsr/base/control');

function renderPatient(res, patient) {
    toCallback(patient)
        .onJust(function (patient) {
            let representation = makePatientRepresentation(patient);
            res.json(representation);
        })
        .onNothing(function () {
            res.sendStatus(404);
        });
}

function makePatientRepresentation(patient) {
    return {
        addressCity: patient.addressCity,
        addressRoad: patient.addressRoad,
        addressRoadNumber: patient.addressRoadNumber,
        addressPostalCode: patient.addressPostalCode,
        addressTelephoneNumber: patient.addressTelephoneNumber,
        birthCity: patient.birthCity,
        nationality: patient.nationality,
        job: patient.job,
        schoolYears: patient.schoolYears,
        birthDate: patient.birthDate,
        gender: patient.gender,
        name: patient.name,
        patientId: patient.patientId,
        socialId: patient.socialId,
        surname: patient.surname,
        familyDoctorId: patient.familyDoctorId,
        _links: {
            self: {
                href: patientURI(patient)
            },
            categories: {
                href: categoriesURI(patient)
            },
            documents: {
                href: documentsURI(patient)
            }
        }
    };
}

function patientURI(patient) {
    return URI.joinPaths('/patient', patient.socialId).toString();
}

function categoriesURI(patient) {
    return URI.joinPaths('/categories', patient.patientId).toString();
}

function documentsURI(patient) {
    return URI.joinPaths('/documents', patient.patientId).toString();
}

module.exports = renderPatient;