'use strict';

module.exports = function(Customer) {
  Customer.editCustomer = function(id,customer,cb){
    customer.id = id;
    Customer.upsert( customer, function (err, res) {
        cb(null, res);
    });
  }
  Customer.remoteMethod('editCustomer', {
          http: {path: '/editCustomer/:id', verb: 'put'},
           accepts: [
            {arg: 'id', type: 'number',required:true},
            {
              arg: 'customer',
              type: 'object',
              http:{source:'body'}
            }
          ],
            returns: {arg: 'customer', type: 'object'}
    });
};
