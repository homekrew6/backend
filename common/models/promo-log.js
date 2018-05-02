'use strict';

module.exports = function (Promolog) {


    Promolog.removePromo = function (data, cb) {
        var response = {};

        Promolog.app.models.promotions.findById(data.promotionsId, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {
                const toUpdateData = { id: data.promotionsId, NoOfUsed: res.NoOfUsed - 1 };
                Promolog.app.models.promotions.upsert(toUpdateData, (err1, res1) => {
                    if (err1) {
                        response.type = "Error";
                        response.message = err1;
                        cb(null, response);
                    }
                    else {
                        Promolog.find({ where: { customerId: data.customerId, promotionsId: data.promotionsId } }, (err2, res2) => {
                            if (err2) {
                                response.type = "Error";
                                response.message = err2;
                                cb(null, response);
                            }
                            else {
                                const price = res2[0].price;
                                console.log("pragati", res2[0]);
                                Promolog.destroyById(res2[0].id, (err4, res4) => {
                                    if (err4) {
                                        response.type = "Error";
                                        response.message = err4;
                                        cb(null, response);
                                    }
                                    else {
                                        response.type = "Success";
                                        response.message = "Promo removed successfully";
                                        response.price = price;
                                        cb(null, response);
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }

    Promolog.remoteMethod('removePromo', {
        http: {
            path: '/removePromo',
            verb: 'POST'
        },
        accepts: [
            {
                arg: 'data',
                type: 'object',
                http: { source: 'body' }
            }
        ],
        returns: { arg: 'response', type: 'object' }
    })
};
