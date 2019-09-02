/* jshint node: true, esversion: 6 */
'use strict';

const R = require('ramda'),
    Maybe = require('folktale/maybe');

const CategoryList = require('./category-list'),
    TimePeriod = require('./time-period');

class DocumentList {

    constructor(patientId, category) {
        this.patientId = patientId;
        this.category = category;
        this.documents = [];
    }

    add(document) {
        this.documents.push(document);
    }

    get total() {
        return this.documents.length;
    }

    get tags() {
        return R.uniq(
            R.flatten(
                this.documents
                    .map(document => document.tags)
            )
        );
    }

    get timePeriod() {
        if (this.documents.length == 0) return Maybe.Nothing();
        let unbuondedTimePeriod = TimePeriod.unbounded();
        return this.documents
            .map(doc => doc.date)
            .reduce(function (timePeriod, date) {
                return timePeriod.include(date);
            }, unbuondedTimePeriod);
    }

    get categoryList() {
        let emptyCategoryList = new CategoryList(this.patientId);
        return this.documents
            .map(document => document.category)
            .reduce(function (categoryList, category) {
                categoryList.include(category);
                return categoryList;
            }, emptyCategoryList);
    }

    get children() {
        let children = this.categoryList.childrenOf(this.category)
            .map(category => new DocumentList(this.patientId, category));

        for (let child of children) {
            for (let document of this.documents) {
                if (child.category.equals(document.category) ||
                    child.category.isAncestorOf(document.category)) {
                    child.add(document);
                }
            }
        }
        return children;
    }

    at(position) {
        if (position >= 0 && position < this.documents.length) {
            return Maybe.of(new Iterator(this, position));
        }
        return Maybe.Nothing();
    }
}

class Iterator {
    constructor(documentList, position) {
        this.documentList = documentList;
        this.position = position;
    }

    get value() {
        return this.documentList.documents[this.position];
    }

    get pos() {
        return this.position;
    }

    get next() {
        return this.documentList.at(this.position + 1);
    }

    get prev() {
        return this.documentList.at(this.position - 1);
    }
}

exports.empty = function (patientId, category, timePeriod, limit) {
    return new DocumentList(patientId, category, timePeriod, limit);
};
