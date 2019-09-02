/* jshint node: true, esversion: 6 */
'use strict';

let bindPatientRequested = require('../binder/bind-patient-requested'),
    renderError = require('../render/render-error'),
    renderPatient = require('../render/render-patient'),
    { Forbidden, ServiceUnavailable } = require('../error');

const { matchWith } = require('@fcsr/base/ext/folktale'),
    express = require('express');

class PatientController {
    constructor(handlePatientRequested) {
        let router = express.Router();
        router.get('/patient/:socialId', function (req, res) {
            bindPatientRequested(req)
                .onSuccess(function (event) {
                    handlePatientRequested(event,
                        matchWith({
                            Ok: ({ value: patient }) => renderPatient(res, patient),
                            Error: ({ value }) => value.matchWith({
                                AuthorizationFailed: ({ message }) => renderError(res, new Forbidden(message)),
                                ServiceUnavailable: ({ message }) => renderError(res, new ServiceUnavailable(message)),
                            })
                        })
                    );
                })
                .onFailure(renderError(res));
        });

        this.router = router;
    }
}

module.exports = PatientController;
