const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('proto/coupon.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

const couponProto = grpc.loadPackageDefinition(packageDefinition);

// Cupons válidos cadastrados no serviço
const coupons = {
    LIVRO10: 10,
    DEV20: 20,
    ALAGOAS15: 15,
};

const server = new grpc.Server();

// Implementa os métodos do CouponService
server.addService(couponProto.CouponService.service, {
    ValidateCoupon: (payload, callback) => {
        const code = (payload.request.code || '').toUpperCase().trim();
        const discount = coupons[code];

        if (discount) {
            callback(null, {
                code,
                valid: true,
                discount,
                message: `Cupom ${code} aplicado com ${discount}% de desconto!`,
            });
        } else {
            callback(null, {
                code,
                valid: false,
                discount: 0,
                message: 'Cupom inválido ou expirado.',
            });
        }
    },
});

server.bindAsync('0.0.0.0:3003', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Coupon Service running at http://127.0.0.1:3003');
    server.start();
});