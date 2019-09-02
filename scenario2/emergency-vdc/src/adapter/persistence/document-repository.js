/* jshint node: true, esversion: 6 */
'use strict';

const Document = require('../../domain/model/document'),
    DocumentList = require('../../domain/model/document-list'),
    Category = require('../../domain/model/category');

const R = require('ramda'),
    PromiseResult = require('@fcsr/base/ext/folktale/promise-result');

class GrpcDocumentRepository {
    constructor(query) {
        this.query = query;
    }

    findDocumentList(token, patientId, category, timePeriod, limit, tags) {
        let query = `SELECT patientId, category, date, tags, payload
                     FROM document
                     WHERE `;
        let queryParameters = [patientId];

        let whereAndClauses = [`patientId = '?'`];

        category.labels.forEach((label, index) => {
            whereAndClauses.push(`category[${index}] = '?'`);
            queryParameters.push(label);
        });

        ifPresent(timePeriod.since, function (since) {
            whereAndClauses.push(`date >= '?'`);
            queryParameters.push(since);
        });

        ifPresent(timePeriod.until, function (until) {
            whereAndClauses.push(`date <= '?'`);
            queryParameters.push(until);
        });

        let whereOrClauses = [];
        tags.forEach(tag => {
            whereOrClauses.push(`array_contains(tags, '?')`);
            queryParameters.push(tag);
        });
        if (whereOrClauses.length) {
            whereAndClauses.push(whereOrClauses.join(' OR '));
        }
        query = query.concat(whereAndClauses.join(' AND '));
        query = query.concat(' ORDER BY date DESC ');

        ifPresent(limit, function (limit) {
            query = query.concat('LIMIT ? ');
            queryParameters.push(limit);
        });

        let emptyDocumentList = DocumentList.empty(patientId, category),
            eHealthQueryRequest = {
                dalMessageProperties: {
                    purpose: '',
                    requesterId: '',
                    authorization: token.value
                },
                dalPrivacyProperties: {
                    privacyZone: 0
                },
                query,
                queryParameters
            };

        return this.query(eHealthQueryRequest)
            .chain(function (message) {

                let documentList = message.values
                    .map(JSON.parse)
                    .reduce(function (documentList, obj) {
                        let document = makeDocument(obj);
                        documentList.add(document);
                        return documentList;
                    }, emptyDocumentList);

                return PromiseResult.of(documentList);
            });
    }
}

function makeDocument(obj) {
    let category = new Category(obj.category);
    return new Document(obj.patientId, category, obj.date, obj.tags, obj.payload);
}

function ifPresent(maybe, fn) {
    maybe.matchWith({
        Just: ({ value }) => fn(value),
        Nothing: () => undefined
    });
}

module.exports = GrpcDocumentRepository;
