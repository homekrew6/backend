'use strict';

module.exports = function (Userlocation) {
    Userlocation.searchLocation = function (keyword, cb) {
        console.log(keyword);
        Userlocation.find({ where: { "buildingName": keyword } }, function (err, res) {
            if (!err) {
                cb(null, res);

            } else {
                cb(err);
            }
        });
    }
    Userlocation.remoteMethod('searchLocation', {
        http: { path: '/searchLocation', verb: 'post' },
        accepts: [
            {
                arg: 'keyword',
                type: 'object',
                http: { source: 'body' }
            }
        ],
        returns: { arg: 'response', type: 'object' }
    });
};
