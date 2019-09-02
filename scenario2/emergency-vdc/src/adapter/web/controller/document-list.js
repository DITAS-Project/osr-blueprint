/* jshint node: true, esversion: 6 */
'use strict';

const bindDocumentListRequested = require('../binder/bind-document-list-requested'),
    renderDocumentList = require('../render/render-document-list'),
    renderError = require('../render/render-error'),
    { Forbidden, ServiceUnavailable } = require('../error');

const { matchWith } = require('@fcsr/base/ext/folktale'),
    express = require('express');

class DocumentListController {
    constructor(onDocumentListRequested) {
        let router = express.Router();
        router.get('/documents/:patientId/:category?', function (req, res) {

            bindDocumentListRequested(req)
                .onSuccess(function (event) {
                    onDocumentListRequested(event, matchWith({
                        Ok: ({ value: docList }) => renderDocumentList(res, event, docList),
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

module.exports = DocumentListController;
