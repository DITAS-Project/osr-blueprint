/*jshint node: true, esversion: 6 */
'use strict';

const URI = require('urijs'),
    { toCallback } = require('@fcsr/base/control');

function renderDocument(res, documentRequested, iterator) {
    toCallback(iterator)
        .onJust(function (iterator) {
            let self = iterator.value,
                next = iterator.next,
                prev = iterator.prev,
                representation = makeDocumentRepresentation(prev, self, next, documentRequested);
            res.json(representation);
        })
        .onNothing(function () {
            res.sendStatus(404);
        });
}

function makeDocumentRepresentation(prev, self, next, documentRequested) {
    return {
        category: self.category.labels,
        date: self.date,
        payload: self.payload,
        _links: {
            self: {
                href: documentURI(documentRequested)
            },
            collection: {
                href: documentListURI(documentRequested)
            },
            prev: prev.map((value) => ({ href: previousDocumentURI(documentRequested, value) })).getOrElse(),
            next: next.map((value) => ({ href: nextDocumentURI(documentRequested, value) })).getOrElse()
        }
    };
}

function documentListURI({ patientId, category, timePeriod, limit, tags }) {
    return URI.joinPaths('/documents', patientId, category.labels.join('-'))
        .search({
            since: timePeriod.since.getOrElse(),
            until: timePeriod.until.getOrElse(),
            limit: limit.getOrElse(),
            tags: tags
        }).toString();
}

function documentURI(documentRequested) {
    return documentAtPositionURI(documentRequested, documentRequested.position);

}

function nextDocumentURI(documentRequested, next) {
    return documentAtPositionURI(documentRequested, next.pos);
}

function previousDocumentURI(documentRequested, prev) {
    return documentAtPositionURI(documentRequested, prev.pos);
}

function documentAtPositionURI({ patientId, category, timePeriod, limit, tags }, position) {
    return URI.joinPaths('/documents', patientId, category.labels.join('-'), 'item', position.toString())
        .search({
            since: timePeriod.since.getOrElse(),
            until: timePeriod.until.getOrElse(),
            limit: limit.getOrElse(),
            tags: tags
        }).toString();
}

module.exports = renderDocument;