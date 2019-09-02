/*jshint node: true, esversion: 6 */
'use strict';

const { curry } = require('@fcsr/base/function');

function renderError(res, error) {
    error.matchWith({
        Forbidden: ({ message }) => res.status(401).json({ message }),
        BadRequest: ({ errors }) => res.status(400).json(errors),
        ServiceUnavailable: ({ message }) => res.status(503).json({ message })
    });
}

module.exports = curry(renderError);
