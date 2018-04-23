'use strict';

module.exports = function (Materials) {

    Materials.updateupdateMaterialPrice = function (data, cb) {
      
        var response = {};
        const toUpdateData={id:data.id, price:data.price};
        Materials.upsert(toUpdateData, (err, res)=>{
            if(err)
            {
                response.type="Error";
                response.message=err;
                cb(null, response);
            }
            else
            {
              
                const toUpdateData1 = { id: data.jobMaterialId, price: data.price };
                Materials.app.models.jobMaterial.upsert(toUpdateData1, (err1, res1)=>{
                    if(err1)
                    {
                        response.type = "Error";
                        response.message = err1;
                        cb(null, response);
                    }
                    else
                    {
                        response.type = "Success";
                        response.message = res;
                        cb(null, response);
                    }
                })
               
                
            }
        })







    }
    
    Materials.remoteMethod('updateupdateMaterialPrice', {
        http: { path: '/updateupdateMaterialPrice', verb: 'post' },
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
