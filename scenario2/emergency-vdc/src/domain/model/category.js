/* jshint node: true, esversion: 6 */
'use strict';

const R = require('ramda'),
    Maybe = require('folktale/maybe');

class Category {

    constructor(labels) {
        this.labels = labels;
    }

    get parent() {
        return this.labels.length ?
            Maybe.of(new Category(this.labels.slice(0, this.labels.length - 1))) :
            Maybe.Nothing();
    }

    isAncestorOf(that) {
        return !this.equals(that) &&
            R.equals(this.labels, that.labels.slice(0, this.labels.length));
    }

    isDescendantOf(that) {
        return that.isAnchestorOf(this);
    }

    equals(that) {
        return R.equals(this.labels, that.labels);
    }
}

module.exports = Category;
