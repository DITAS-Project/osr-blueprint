/* jshint node: true, esversion: 6 */
'use strict';

const bindCategoryListRequested = require('../binder/bind-category-list-requested'),
    renderCategoryList = require('../render/render-category-list'),
    renderError = require('../render/render-error'),
    { Forbidden, ServiceUnavailable } = require('../error');

const { matchWith } = require('@fcsr/base/ext/folktale'),
    express = require('express');

class CategoryController {
    constructor(handleCategoryListRequested) {
        let router = express.Router();
        router.get('/categories/:patientId?', function (req, res) {
            bindCategoryListRequested(req)
                .onSuccess(function (event) {
                    handleCategoryListRequested(event, matchWith({
                        Ok: ({ value: categoryList }) => renderCategoryList(res, categoryList),
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

module.exports = CategoryController;
