'use strict';

module.exports = function (Admin) {
    Admin.editAdmin = function (id, admin, cb) {
        admin.id = id;
        Admin.upsert(admin, function (err, res) {
            cb(null, res);
        });
    }
    Admin.remoteMethod('editAdmin', {
        http: { path: '/editAdmin/:id', verb: 'put' },
        accepts: [
            { arg: 'id', type: 'number', required: true },
            {
                arg: 'admin',
                type: 'object',
                http: { source: 'body' }
            }
        ],
        returns: { arg: 'admin', type: 'object' }
    });



    Admin.editAgent = function (id, agent, cb) {
        agent.id = id;
        Admin.upsert(agent, function (err, res) {
            cb(null, res);
        });
    }
    Admin.remoteMethod('editAgent', {
        http: { path: '/editAgent/:id', verb: 'put' },
        accepts: [
            { arg: 'id', type: 'number', required: true },
            {
                arg: 'agent',
                type: 'object',
                http: { source: 'body' }
            }
        ],
        returns: { arg: 'agent', type: 'object' }
    });


    Admin.getAgentDetailsById = function (id, cb) {
        var response = {};
        Admin.findById(id, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {
                if (res) {
                    Admin.app.models.adminZone.find({ where: { adminId: id } }, (err1, res1) => {
                        if (err1) {
                            response.type = "Success";
                            res.zones = [];
                            response.message = res;
                            cb(null, response);
                        }
                        else {
                            res.zones = [];
                            for (let i = 0; i < res1.length; i++) {
                                res.zones.push(res1[i].zoneId);
                            }
                            response.type = "Success";
                            response.message = res;
                            cb(null, response);
                        }
                    })
                }
                else {
                    response.type = "Error";
                    response.message = "No record found.";
                    cb(null, response);
                }

            }
        })

    }
    Admin.remoteMethod('getAgentDetailsById', {
        http: { path: '/getAgentDetailsById/:id', verb: 'get' },
        accepts: [
            { arg: 'id', type: 'number', required: true }
        ],
        returns: { arg: 'response', type: 'object' }
    });
    Admin.on('resetPasswordRequest', function (info) {

        console.log("Hello");
        var to = info.email;
        var acces_token = info.accessToken.id;
        var subject = 'OTP for reset password';
        var text = 'text';
        var otp = Math.floor(1000 + Math.random() * 9000);
        var html = 'Hi,<br>OTP : ' + otp + '<br><br>Regards,<br>Krew Team';
        var temp = {
            otp: otp,
            email: to,
            access_token: acces_token
        }
        Admin.app.models.UserTemp.upsert(temp, function (err, res) {
            Admin.sendEmail(to, subject, text, html, function (cb) {

            });
        });
    });
    Admin.emailChecking = function (admin, cb) {
        Admin.findOne({ where: { email: admin.email } }, function (err, res) {
            if (res) {
                cb(null, { "message": "Email exist" });
            } else {
                cb({ "message": "Email does not exist" });
            }
        });
    }
    Admin.remoteMethod('emailChecking', {
        http: { path: '/emailChecking', verb: 'post' },
        accepts: [
            {
                arg: 'admin',
                type: 'object',
                http: { source: 'body' }
            }
        ],
        returns: { arg: 'response', type: 'object' }
    });
    Admin.otpChecking = function (user, cb) {
        console.log('adminChecking', user);

        Admin.app.models.UserTemp.findOne({ where: { otp: user.otp } }, function (err, res) {
            if (res) {

                Admin.app.models.UserTemp.destroyAll({ where: { otp: user.otp } }, function (err, res) {

                })
                cb(null, { "message": "OTP exist", "access_token": res.access_token });
            } else {
                cb({ "message": "Wrong OTP" });
            }
        });
    }
    Admin.remoteMethod('otpChecking', {
        http: { path: '/otpChecking', verb: 'post' },
        accepts: [
            {
                arg: 'user',
                type: 'object',
                http: { source: 'body' }
            }
        ],
        returns: { arg: 'response', type: 'object' }
    });
    Admin.addAgent = function (id, admin, cb) {
        var response = {};
        var to = admin.email;
        var subject = 'Successfully Registered';
        var text = 'text';
        var html = 'Hi,<br>You have been added as an agent in our team.<br><br>Regards,<br>Krew Team';
        Admin.upsert(admin, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {
                var entryData = [];
                for (var i = 0; i < admin['zoneId'].length; i++) {

                    let insertData = { "adminId": res.id, "zoneId": admin['zoneId'][i] };
                    entryData.push(insertData);
                }
                Admin.app.models.adminZone.create(entryData, (err1, res1) => {
                    if (err1) {
                        response.type = "Error";
                        response.message = err1;
                        cb(null, response);
                    }
                    else {
                        Admin.sendEmail(to, subject, text, html, function (cb) {


                        });
                    }
                })

                response.type = "Success";
                response.message = res;
                cb(null, response);
            }
        })
    }
    Admin.remoteMethod('addAgent', {
        http: { path: '/addAgent', verb: 'post' },
        accepts: [
            { arg: 'admin', type: 'object', required: true },
            {
                arg: 'admin',
                type: 'object',
                http: { source: 'body' }
            }
        ],
        returns: { arg: 'response', type: 'object' }
    });

    Admin.getAllAgents = function (cb) {
        var response = {};
        Admin.find({}, (err, res) => {
            if (err) {
                response.type = "Error";
                response.message = err;
                cb(null, response);
            }
            else {
                cb(null, res);
            }

        });
    }

    Admin.remoteMethod('getAllAgents', {
        http: { path: '/getAllAgents', verb: 'get' },
        returns: { arg: 'response', type: 'object' }
    });



    Admin.deleteAgent = function (id, cb) {
        var response = {};
        if (id) {
            Admin.destroyById(id, (err, res) => {
                if (err) {
                    response.type = "Error";
                    response.message = err;
                    cb(null, response);
                }
                else {
                    response.type = "Success";
                    response.message = res;
                    cb(null, response);
                }
            })
        }
        else {
            response.type = "Error";
            response.message = "Please select the agent to delete.";
            cb(null, response);
        }


    }

    Admin.remoteMethod('deleteAgent', {
        http: { path: '/deleteAgent/:id', verb: 'delete' },
        accepts: [
            { arg: 'id', type: 'number', required: false }
        ],
        returns: { arg: 'response', type: 'object' }
    });












    Admin.sendEmail = function (to, subject, text, html, cb) {
        Admin.app.models.EmailSend.send({
            to: to,
            from: 'mail@natitsolved.com',
            subject: subject,
            text: text,
            html: html
        }, function (err, mail) {

            //cb(err);
            if (!err) {
                cb({ "success": true })
            } else {
                cb({ "success": false });
            }

        });
    }

    Admin.remoteMethod('sendEmail', {
        http: { path: '/sendEmail', verb: 'get' },
        returns: { arg: 'admin', type: 'object' }
    });
};
