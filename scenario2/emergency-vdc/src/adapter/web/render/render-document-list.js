/*jshint node: true, esversion: 6 */
'use strict';

const URI = require('urijs'),
    R = require('ramda');

function renderDocumentList(res, documentListRequested, documentList) {
    if (documentList.total == 0) {
        return res.sendStatus(404);
    }
    let representation = makeDocumentListRepresentation(documentList, documentListRequested);
    res.json(representation);
}

function makeDocumentListRepresentation(documentList, documentListRequested) {
    let queryFilters = {
        since: documentListRequested.timePeriod.since.getOrElse(),
        until: documentListRequested.timePeriod.until.getOrElse(),
        limit: documentListRequested.limit.getOrElse(),
        tags: documentListRequested.tags
    };

    let documentListSince = documentList.timePeriod.since.getOrElse(),
        documentListUntil = documentList.timePeriod.until.getOrElse(),
        addTags = documentList.tags.filter(tag => !R.includes(tag, documentListRequested.tags)),
        removeTags = documentList.tags.filter(tag => R.includes(tag, documentListRequested.tags));

    return {
        since: documentListSince,
        until: documentListUntil,
        total: documentList.total,
        _embedded: {
            subcollection: documentList.children
                .map(makeSubcollectionRepresentation(documentListRequested.patientId, queryFilters)),
            item: documentList.documents
                .map(makeDocumentRepresentation(documentListRequested.patientId, documentListRequested.category, queryFilters)),
            addTag: addTags
                .map(makeAddTagRepresentation(documentListRequested.patientId, documentListRequested.category, queryFilters)),
            removeTag: removeTags
                .map(makeRemoveTagRepresentation(documentListRequested.patientId, documentListRequested.category, queryFilters))
        },
        _links: {
            self: {
                href: documentListURI(documentListRequested.patientId, documentListRequested.category, queryFilters)
            },
            select: {
                href: selectDocumentListURI(documentListRequested.patientId, documentListRequested.category),
                templated: true
            },
            collection: documentList.category.parent
                .map(parentCategory => ({ href: documentListURI(documentListRequested.patientId, parentCategory, queryFilters) }))
                .getOrElse()
        }
    };
}

function makeDocumentRepresentation(patientId, category, queryFilters) {
    return function (document, position) {
        return {
            category: document.category.labels,
            date: document.date,
            _links: {
                self: {
                    href: documentURI(patientId, category, queryFilters, position)
                }
            }
        };
    };
}

function makeAddTagRepresentation(patientId, category, queryFilters) {
    return function (tag) {
        let tags = [...queryFilters.tags, tag];
        return {
            name: tag,
            _links: {
                self: {
                    href: documentListURI(patientId, category, { since: queryFilters.since, until: queryFilters.until, limit: queryFilters.limit, tags })
                }
            }
        };
    };
}

function makeRemoveTagRepresentation(patientId, category, queryFilters) {
    return function (tag) {
        let tags = queryFilters.tags.filter(t => t != tag);
        return {
            name: tag,
            _links: {
                self: {
                    href: documentListURI(patientId, category, { since: queryFilters.since, until: queryFilters.until, limit: queryFilters.limit, tags })
                }
            }
        };
    };
}

function makeSubcollectionRepresentation(patientId, queryFilters) {
    return function (collection) {
        return {
            category: collection.category.labels,
            since: collection.timePeriod.since.getOrElse(),
            until: collection.timePeriod.until.getOrElse(),
            total: collection.total,
            _links: {
                self: {
                    href: documentListURI(patientId, collection.category, queryFilters)
                },
                select: {
                    href: selectDocumentListURI(patientId, collection.category),
                    templated: true
                }
            }
        };
    };
}

function documentListURI(patientId, category, { since, until, limit, tags }) {
    return URI.joinPaths('/documents', patientId, category.labels.join('-'))
        .search({ since, until, limit, tags }).toString();
}

function documentURI(patientId, category, { since, until, limit, tags }, position) {
    return URI.joinPaths('/documents', patientId, category.labels.join('-'), 'item', position.toString())
        .search({ since, until, limit, tags }).toString();
}

function selectDocumentListURI(patientId, category) {
    return URI.joinPaths('/documents', patientId, category.labels.join('-'))
        .toString().concat('{&since,until,limit,tags}');
}

module.exports = renderDocumentList;