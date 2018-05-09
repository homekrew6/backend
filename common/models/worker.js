'use strict';

module.exports = function (Worker) {
  Worker.editWorker = function (id, worker, cb) {
    worker.id = id;
    Worker.upsert(worker, function (err, res) {
      // Worker.app.models.Customer.sendEmail(a,b,c,d,e,(res)=>{
      //
      // });
      cb(null, res);
    });
  }
  Worker.remoteMethod('editWorker', {
    http: { path: '/editWorker/:id', verb: 'put' },
    accepts: [
      { arg: 'id', type: 'number', required: true },
      {
        arg: 'worker',
        type: 'object',
        http: { source: 'body' }
      }
    ],
    returns: { arg: 'worker', type: 'object' }
  });

  Worker.signup = function (worker, cb) {
    var to = worker.email;
    var subject = 'Successfully Registered';
    var text = 'text';
    var html = 'Hi,<br>Your account has been successfully registered with us. Needs admin approval.<br><br>Regards,<br>Krew Team';
    Worker.find({ where: { email: worker.email } }, (err1, res1) => {
      if (err1) {
        cb(null, res1);
      }
      else {

        if (res1.length > 0) {
          cb(null, { "Error": true, "message": "Email already exists." });
        }
        else {
          worker.language = "en";
          Worker.create(worker, function (err, res) {
            Worker.app.models.Customer.sendEmail(to, subject, text, html, function (cb) {

            });
            cb(null, res);
          });
        }
      }
    })

  }
  Worker.remoteMethod('signup', {
    http: { path: '/signup', verb: 'post' },
    accepts: [
      {
        arg: 'worker',
        type: 'object',
        http: { source: 'body' }
      }
    ],
    returns: { arg: 'worker', type: 'object' }
  });

  Worker.emailChecking = function (worker, cb) {
    Worker.findOne({ where: { email: worker.email } }, function (err, res) {
      if (res) {
        cb(null, { "message": "Email exist" });
      } else {
        cb({ "message": "Email does not exist" });
      }
    });
  }
  Worker.remoteMethod('emailChecking', {
    http: { path: '/emailChecking', verb: 'post' },
    accepts: [
      {
        arg: 'worker',
        type: 'object',
        http: { source: 'body' }
      }
    ],
    returns: { arg: 'response', type: 'object' }
  });

  Worker.on('resetPasswordRequest', function (info) {


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
    Worker.app.models.UserTemp.upsert(temp, function (err, res) {
      Worker.app.models.Customer.sendEmail(to, subject, text, html, function (cb) {

      });
    });
  });

  Worker.approveChecking = function (worker, cb) {
    Worker.findOne({ where: { email: worker.email } }, function (err, res) {
      if (res) {
        cb(null, res);
      } else {
        cb({ "message": "Email does not exist" });
      }
    });
  }
  Worker.remoteMethod('approveChecking', {
    http: { path: '/approveChecking', verb: 'post' },
    accepts: [
      {
        arg: 'worker',
        type: 'object',
        http: { source: 'body' }
      }
    ],
    returns: { arg: 'response', type: 'object' }
  });

  Worker.getCommissionList = function (data, cb) {
    var resposne = {};
    Worker.app.models.Job.find({ where: { workerId: data.id, status: "COMPLETED", IsPaid: true }, "include": ["customer"] }, (err, res) => {
      if (err) {
        resposne.type = "Error";
        resposne.message = err;
        cb(null, resposne);
      }
      else {

        data.commission = Number(data.commission);
        for (let i = 0; i < res.length; i++) {
          res[i].price=Number(res[i].price);
          let commission1 = (res[i].price * data.commission) / 100;
          res[i].commission = commission1.toFixed(2);
        }
        resposne.type = "Success";
        resposne.message = res;
        cb(null, resposne);
      }
    })
  }

  Worker.remoteMethod('getCommissionList', {
    http: { path: '/getCommissionList', verb: 'post' },
    accepts: [
      {
        arg: 'data',
        type: 'object',
        http: { source: 'body' }
      }
    ],
    returns: { arg: 'response', type: 'object' }
  });


  Worker.totalCommission = function (data, cb) {
    var resposne = {};
    Worker.findById(data.id, (err1, res1) => {
      if (err1) {
        resposne.type = "Error";
        resposne.mess = err1;
        cb(null, resposne);
      }
      else {
        if (res1.commission) {
          Worker.app.models.Job.find({ where: { workerId: data.id, status: "COMPLETED", IsPaid: true }, "include": ["customer"] }, (err, res) => {
            if (err) {
              resposne.type = "Error";
              resposne.message = err;
              cb(null, resposne);
            }
            else {
              let totalCommission = 0;
              for (let i = 0; i < res.length > 0; i++) {
                totalCommission = totalCommission + Number(res1.commission);
              }
              resposne.type = "Success";
              resposne.message = totalCommission.toFixed(2);
              cb(null, resposne);
            }
          })
        }

      }
    })

  }

  Worker.remoteMethod('totalCommission', {
    http: { path: '/totalCommission', verb: 'post' },
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
