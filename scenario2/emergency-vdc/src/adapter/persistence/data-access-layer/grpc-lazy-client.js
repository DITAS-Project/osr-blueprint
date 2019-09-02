/* jshint node: true, esversion: 6 */
'use strict';

const grpc = require('grpc'),
    Result = require('@fcsr/base/ext/folktale/result'),
    protoLoader = require('@grpc/proto-loader'),
    { promisify } = require('bluebird'),
    PromiseResult = require('@fcsr/base/ext/folktale/promise-result');

const { UnreachableDAL, InvalidDALToken, UnexpectedDALError } = require('../../../domain/error');

class GrpcLazyClient {
    constructor(DAL_HOSTNAME, DAL_PORT) {
        let packageDefinition = protoLoader.loadSync(`${__dirname}/EHealthService.proto`, { keepCase: true, defaults: true }),
            protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

        this.SERVICE = protoDescriptor.com.ditas.ehealth.EHealthQueryService;
        this.DAL_URI = `${DAL_HOSTNAME}:${DAL_PORT}`;

        this.query = this.query.bind(this);
    }

    query(message) {
        const SERVICE = this.SERVICE,
            DAL_URI = this.DAL_URI;

        let client = new SERVICE(DAL_URI, grpc.credentials.createInsecure()),
            method = promisify(client.query.bind(client));

        return new PromiseResult(
            method(message)
                .then(Result.Ok)
                .catch((error) => {
                    switch (error.code) {
                        case grpc.status.UNAVAILABLE:
                            return Result.Error(new UnreachableDAL());
                        case grpc.status.UNAUTHENTICATED:
                            return Result.Error(new InvalidDALToken());
                        default:
                            return Result.Error(new UnexpectedDALError());
                    }
                })
        );
    }
}

module.exports = GrpcLazyClient;