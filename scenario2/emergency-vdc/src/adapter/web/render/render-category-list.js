/*jshint node: true, esversion: 6 */
'use strict';

const URI = require('urijs');

function renderCategoryList(res, categoryList) {
    if (categoryList.isEmpty()) {
        return res.sendStatus(404);
    }
    let representation = makeCategoryListRepresentation(categoryList);
    res.json(representation);
}

function makeCategoryListRepresentation(categoryList) {
    return {
        _embedded: {
            item: categoryList.items()
                .map(category => makeCategoryRepresentation(categoryList.patientId, category))
        },
        _links: {
            self: {
                href: categoryListURI(categoryList)
            }
        }
    };
}

function makeCategoryRepresentation(patientId, category) {
    return {
        category: category.labels,
        _links: {
            self: {
                href: categoryURI(patientId, category)
            },
            select: {
                href: selectCategoryURI(patientId, category),
                templated: true
            }
        }
    };
}

function categoryListURI(categoryList) {
    return URI.joinPaths('/categories', categoryList.patientId).toString();
}

function categoryURI(patientId, category) {
    return URI.joinPaths('/documents', patientId, category.labels.join('-')).toString();
}

function selectCategoryURI(patientId,category) {
    return URI.joinPaths('/documents', patientId, category.labels.join('-')).toString().concat('{?since,until,limit,tags}');
}

module.exports = renderCategoryList;
