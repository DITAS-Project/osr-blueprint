/* jshint node: true, esversion: 6 */
'use strict';

let bindDocumentRequested = require('../binder/bind-document-requested'),
    renderDocument = require('../render/render-document'),
    renderError = require('../render/render-error'),
    { Forbidden, ServiceUnavailable } = require('../error');

const { matchWith } = require('@fcsr/base/ext/folktale'),
    express = require('express');

class DocumentController {
    constructor(handleDocumentRequest) {
        let router = express.Router();
        router.get('/documents/:patientId/:category?/item/:position', function (req, res) {

            bindDocumentRequested(req)
                .onSuccess(function (event) {
                    handleDocumentRequest(event, matchWith({
                        Ok: ({ value: document }) => renderDocument(res, event, document),
                        Error: ({ value }) => value.matchWith({
                            AuthorizationFailed: ({ message }) => renderError(res, new Forbidden(message)),
                            ServiceUnavailable: ({ message }) => renderError(res, new ServiceUnavailable(message)),
                        })
                    }));
                })
                .onFailure(renderError(res));
        });

        this.router = router;
    }
}


module.exports = DocumentController;
