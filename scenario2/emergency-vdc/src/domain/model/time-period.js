/* jshint node: true, esversion: 6 */
'use strict';

const R = require('ramda'),
    Maybe = require('folktale/maybe');

class TimePeriod {

    constructor(since, until) {
        this.since = since;
        this.until = until;
    }

    static of(since, until) {
        return new TimePeriod(
            Maybe.of(since),
            Maybe.of(until)
        );
    }

    static moment(timestamp) {
        return TimePeriod.of(timestamp, timestamp);
    }

    static since(timestamp) {
        return new TimePeriod(
            Maybe.of(timestamp),
            Maybe.Nothing()
        );
    }

    static until(timestamp) {
        return new TimePeriod(
            Maybe.Nothing(),
            Maybe.of(timestamp)
        );
    }

    static unbounded() {
        return new TimePeriod(
            Maybe.Nothing(),
            Maybe.Nothing()
        );
    }

    include(timestamp) {
        const since = R.lift(R.min)(this.since, Maybe.of(timestamp));
        const until = R.lift(R.max)(this.until, Maybe.of(timestamp));
        return new TimePeriod(
            since.orElse(() => Maybe.of(timestamp)),
            until.orElse(() => Maybe.of(timestamp))
        );
    }

    isIncluded(timestamp) {
        const isLeftIncluded = this.since.map(R.gte(timestamp)).getOrElse(true);
        const isRightIncluded = this.until.map(R.lte(timestamp)).getOrElse(true);
        return isLeftIncluded && isRightIncluded;
    }
}

module.exports = TimePeriod;
