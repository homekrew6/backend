'use strict';

module.exports = function (Userpromocode) {
    Userpromocode.addUserPromo = function (data, cb) {
        var response = {};

        Userpromocode.app.models.promotions.find({ where: { promo_code: data.promoCode } }, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }

            else {
                console.log("res", res);
                if (res.length && res.length > 0) {
                    Userpromocode.find({ where: { promotionsId: res[0].id, customerId: data.customerId } }, (finalError, finalSuccess) => {
                        if (finalError) {
                            response.type = "Error";
                            response.message = finalError;
                            cb(null, response);
                        }
                        else {
                            if (finalSuccess.length > 0) {
                                response.type = "Error";
                                response.message = "Promo Code already exists.";
                                cb(null, response);
                            }
                            else {
                                const toInsertData = { promotionsId: res[0].id, customerId: data.customerId, addedDate: data.addedDate };
                                Userpromocode.create(toInsertData, (err1, res1) => {
                                    if (err1) {
                                        response.type = "Error";
                                        response.message = err1;
                                        cb(null, response);
                                    }
                                    else {
                                        response.type = "Success";
                                        response.message = res1;
                                        cb(null, response);
                                    }
                                })
                            }
                        }
                    })

                }
                else {
                    response.type = "Error";
                    response.message = "No Promo code available.";
                    cb(null, response);
                }

            }
        })
    }

    Userpromocode.remoteMethod('addUserPromo', {
        http: { path: '/addUserPromo', verb: 'post' },
        accepts: [
            {
                arg: 'data',
                type: 'object',
                http: { source: 'body' }
            }
        ],
        returns: { arg: 'response', type: 'object' }
    });
};
