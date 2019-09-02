/* jshint node: true, esversion: 6 */
'use strict';

const PromiseResult = require('@fcsr/base/ext/folktale/promise-result');

const Category = require('../../domain/model/category'),
    CategoryList = require('../../domain/model/category-list');

class GrpcCategoryRepository {
    constructor(query) {
        this.query = query;
    }

    findByPatientId(token, patientId) {
        let eHealthQueryRequest = {
            dalMessageProperties: {
                purpose: '',
                requesterId: '',
                authorization: token.value
            },
            dalPrivacyProperties: {
                privacyZone: 0
            },
            query: `SELECT DISTINCT category
                    FROM document
                    WHERE patientId = '?'`,
            queryParameters: [patientId]
        };

        return this.query(eHealthQueryRequest)
            .chain(function (message) {

                let emptyCategoryList = new CategoryList(patientId),
                    categoryList = message.values
                        .map(JSON.parse)
                        .reduce(function (categoryList, obj) {
                            let category = new Category(obj.category);
                            categoryList.include(category);
                            return categoryList;
                        }, emptyCategoryList);

                return PromiseResult.of(categoryList);
            });
    }
}

module.exports = GrpcCategoryRepository;
