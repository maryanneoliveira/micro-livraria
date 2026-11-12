const path = require('path');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(
    path.resolve(__dirname, '../../proto/coupon.proto'),
    {
        keepCase: true,
        longs: String,
        enums: String,
        arrays: true,
    }
);

const CouponService = grpc.loadPackageDefinition(packageDefinition).CouponService;
const client = new CouponService(
    process.env.COUPON_HOST || '127.0.0.1:3003',
    grpc.credentials.createInsecure()
);

module.exports = client;