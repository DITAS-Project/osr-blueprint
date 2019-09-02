/* jshint node: true, esversion: 9 */
'use strict';

const GrpcLazyClient = require('./adapter/persistence/data-access-layer/grpc-lazy-client');

const PatientRepository = require('./adapter/persistence/patient-repository'),
    CategoryRepository = require('./adapter/persistence/category-repository'),
    DocumentRepository = require('./adapter/persistence/document-repository');

const FindPatientService = require('./application/service/find-patient'),
    FindCategoryListService = require('./application/service/find-category-list'),
    FindDocumentListService = require('./application/service/find-document-list'),
    FindDocumentService = require('./application/service/find-document');

const PatientController = require('./adapter/web/controller/patient'),
    CategoryListController = require('./adapter/web/controller/category-list'),
    DocumentListController = require('./adapter/web/controller/document-list'),
    DocumentController = require('./adapter/web/controller/document');

function apply(app, {DAL_HOSTNAME, DAL_PORT}) {

    let grpcLazyClient = new GrpcLazyClient(DAL_HOSTNAME, DAL_PORT);

    let patientRepository = new PatientRepository(grpcLazyClient.query),
        categoryRepository = new CategoryRepository(grpcLazyClient.query),
        documentRepository = new DocumentRepository(grpcLazyClient.query);

    let findPatientService = new FindPatientService(patientRepository),
        findCategoryListService = new FindCategoryListService(categoryRepository),
        findDocumentListService = new FindDocumentListService(documentRepository),
        findDocumentService = new FindDocumentService(documentRepository);

    async function onPatientRequested(patientRequested, next) {
        let patient = findPatientService.handle(patientRequested.token, patientRequested.socialId);
        next(patient);
    }

    async function onCategoryListRequested(categoryListRequested, next) {
        let categoryList = findCategoryListService.handle(categoryListRequested.token, categoryListRequested.patientId);
        next(categoryList);
    }

    async function onDocumentListRequested(documentListRequested, next) {
        let documentList = findDocumentListService.handle(
            documentListRequested.token,
            documentListRequested.patientId,
            documentListRequested.category,
            documentListRequested.timePeriod,
            documentListRequested.limit,
            documentListRequested.tags
        );
        next(documentList);
    }

    async function onDocumentRequested(documentRequested, next) {
        let document = findDocumentService.handle(
            documentRequested.token,
            documentRequested.patientId,
            documentRequested.category,
            documentRequested.timePeriod,
            documentRequested.limit,
            documentRequested.tags,
            documentRequested.position
        );
        next(document);
    }

    let patientController = new PatientController(onPatientRequested),
        categoryListController = new CategoryListController(onCategoryListRequested),
        documentListController = new DocumentListController(onDocumentListRequested),
        documentController = new DocumentController(onDocumentRequested);

    app.use('/', patientController.router);
    app.use('/', categoryListController.router);
    app.use('/', documentListController.router);
    app.use('/', documentController.router);
}

module.exports = apply;
