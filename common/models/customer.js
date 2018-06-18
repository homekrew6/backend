'use strict';
var loopbackPassport = require('loopback-component-passport');
var FCM = require('fcm-push');
var userServerKey_before_release = 'AIzaSyDXBq375kG8CSjsKeX11EmtQWCmyQ14ATE';
var userServerKey = 'AIzaSyDPsQQvaMIUWiL0jb_ftvKlM4OV_IFzZkw';
var fcm = new FCM(userServerKey);
module.exports = function (Customer) {
  Customer.editCustomer = function (id, customer, cb) {
    customer.id = id;
    Customer.upsert(customer, function (err, res) {
      if (err) {
        cb(err);
      } else {
        cb(null, res);
      }

    });
  }
  Customer.remoteMethod('editCustomer', {
    http: { path: '/editCustomer/:id', verb: 'put' },
    accepts: [
      { arg: 'id', type: 'number', required: true },
      {
        arg: 'customer',
        type: 'object',
        http: { source: 'body' }
      }
    ],
    returns: { arg: 'customer', type: 'object' }
  });

  Customer.signup = function (customer, cb) {
    var to = customer.email;
    var subject = 'Successfully Registered';
    var text = 'text';
    customer.language = "en";
    var html = 'Hi,<br>Your account has been successfully registered with us<br><br>Regards,<br>Krew Team';
    Customer.upsert(customer, function (err, res) {
      var message = {
        to: customer.deviceToken,
        data: {
          "screenType": "Notification"
        },
        notification: {
          title: "Welcome to Krew.",
          body: "Welcome to Krew."
        }
      };
      const notificationInsertData = { notificationType: "Welcome", notificationDate: new Date().toUTCString(), title: message.notification.title, sentIds: res.id, jobId: '', IsToWorker: false, IsRead: 0 };
      Customer.app.models.Notifications.create(notificationInsertData, (finalError, finalSuccess) => {
        if (finalError) {
          fcm.send(message, function (err4, fcmResponse) {
            if (err4) {
              cb(null, res);
            } else {
              cb(null, res);
            }
          });
        }
        else {
          fcm.send(message, function (err4, fcmResponse) {
            if (err4) {
              Customer.sendEmail(to, subject, text, html, function (cb) {


              });
            } else {
              Customer.sendEmail(to, subject, text, html, function (cb) {


              });
            }
            cb(null, res);
          });
        }
      });


    });
  }
  Customer.remoteMethod('signup', {
    http: { path: '/signup', verb: 'post' },
    accepts: [
      {
        arg: 'customer',
        type: 'object',
        http: { source: 'body' }
      }
    ],
    returns: { arg: 'customer', type: 'object' }
  });


  Customer.emailChecking = function (customer, cb) {

    Customer.findOne({ where: { email: customer.email } }, function (err, res) {
      if (res) {
        cb(null, { "message": "Email exist" });
        // Customer.sendEmail(to,subject,text,html,function(cbb){
        //     if(cbb.success){
        //       cb(null,{"otp":otp,"message":"Successfully sent"});
        //     }else{
        //       cb(err);
        //     }
        // });
      } else {
        cb({ "message": "Email does not exist" });
      }
    });
  }
  Customer.remoteMethod('emailChecking', {
    http: { path: '/emailChecking', verb: 'post' },
    accepts: [
      {
        arg: 'customer',
        type: 'object',
        http: { source: 'body' }
      }
    ],
    returns: { arg: 'response', type: 'object' }
  });

  Customer.sendEmail = function (to, subject, text, html, cb) {
    Customer.app.models.EmailSend.send({
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

  Customer.remoteMethod('sendEmail', {
    http: { path: '/sendEmail', verb: 'get' },
    returns: { arg: 'customer', type: 'object' }
  });


  Customer.sendEmailForPasswordChange = function (data, cb) {
    var response = {};
    Customer.app.models.EmailSend.send({
      to: data.to,
      from: 'mail@natitsolved.com',
      subject: data.subject,
      text: data.text ? data.text : '',
      html: data.html
    }, function (err, mail) {

      //cb(err);
      if (!err) {

        response.success = true;
        cb(null, response);
      } else {
        response.success = false;
        cb(null, response);
      }

    });
  }

  Customer.remoteMethod('sendEmailForPasswordChange', {
    http: { path: '/sendEmailForPasswordChange', verb: 'post' },
    accepts: [
      {
        arg: 'data',
        type: 'object',
        http: { source: 'body' }
      }
    ],
    returns: { arg: 'response', type: 'object' }
  });

  Customer.approveChecking = function (customer, cb) {
    Customer.findOne({ where: { email: customer.email } }, function (err, res) {
      if (res) {
        cb(null, res);
      } else {
        cb({ "message": "Email does not exist" });
      }
    });
  }

  Customer.remoteMethod('approveChecking', {
    http: { path: '/approveChecking', verb: 'post' },
    accepts: [
      {
        arg: 'customer',
        type: 'object',
        http: { source: 'body' }
      }
    ],
    returns: { arg: 'response', type: 'object' }
  });

  Customer.on('resetPasswordRequest', function (info) {


    if (info.options.IsFromAdmin) {
      var temp = {
        email: info.email,
        access_token: info.accessToken.id
      }
      Customer.app.models.AdminTemp.upsert(temp, function (err, res) {

      });
    }
    else {
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
      Customer.app.models.UserTemp.upsert(temp, function (err, res) {
        Customer.sendEmail(to, subject, text, html, function (cb) {

        });
      });
    }

  });


  Customer.sendAccessToken = function (data, cb) {
    cb(null, data);
  }

  Customer.otpChecking = function (user, cb) {

    Customer.app.models.UserTemp.findOne({ where: { otp: user.otp } }, function (err, res) {
      if (res) {

        Customer.app.models.UserTemp.destroyAll({ where: { otp: user.otp } }, function (err, res) {

        })
        cb(null, { "message": "OTP exist", "access_token": res.access_token });
      } else {
        cb({ "message": "Wrong OTP" });
      }
    });
  }
  Customer.remoteMethod('otpChecking', {
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

  Customer.socialLogin = function (customer, cb) {


    var profileDetails = JSON.parse(customer.profile);
    var provider = customer.provider;
    var authSchema = 'oAuth 2.0';

    // oneTimeCode from android
    //var oneTimeCode = req.body.oneTimeCode;

    // Make a request to google api
    // to exchange refreshToken and accessToken with using google apis
    var accessToken = customer.credentials.token;
    //var refreshToken = 'FROM GOOGLE API';

    // external id is your google or facebook user id
    var externalId = customer.credentials.userId;
    var email = profileDetails.email;

    var credentials = {};
    credentials.externalId = externalId;
    credentials.accessToken = accessToken;

    var profile = {};
    profile.id = externalId;
    profile.emails = [{ type: 'account', value: email }];

    //console.log(credentials)
    //console.log(profile)
    Customer.app.models.UserIdentity.login(
      provider, authSchema, profile, credentials,
      { autoLogin: true }, function (err, loopbackUser, identity, token) {
        if (err) {

        } else {

        }
        // token is access token for thig login
        //return res.send(token);
      });
    cb(null, customer)
  }
  Customer.remoteMethod('socialLogin', {
    http: { path: '/socialLogin', verb: 'post' },
    accepts: [
      {
        arg: 'customer',
        type: 'object',
        http: { source: 'body' }
      }
    ],
    returns: { arg: 'customer', type: 'object' }
  });


  Customer.socialLoginEmailCheck = function (customer, cb) {

    Customer.findOne({ where: { email: customer.email } }, function (err, res) {

      if (res) {
        if (res.social_type == 'facebook' || res.social_type == 'google') {
          cb(null, { "exist": 2 });
        } else {
          cb(null, { "exist": 1 });
        }

      } else {
        cb(null, { "exist": 0 });
      }
    });
    //cb(null,customer);

  }
  Customer.remoteMethod('socialLoginEmailCheck', {
    http: { path: '/socialLoginEmailCheck', verb: 'post' },
    accepts: [
      {
        arg: 'customer',
        type: 'object',
        http: { source: 'body' }
      }
    ],
    returns: { arg: 'response', type: 'object' }
  });



  Customer.checkIfPaymentPending = function (data, cb) {
    var response = {};
    Customer.app.models.Job.find({ where: { customerId: data.id, status: 'PAYPENDING' } }, (err, res) => {
      if (err) {
        response.type = "Error";
        response.message = err;
        cb(null, response);
      }
      else {
        if (res.length > 0) {
          response.type = "Success";
          response.IsPayPending = true;
          let message1;
          if (data.language == "en") {
            message1 = "Please pay the pending amount to post another job.";
          }
          else if (data.language == "ar") {
            message1 = "يرجى دفع المبلغ المعلق لنشر وظيفة أخرى.";
          }
          else if (data.language == "fr") {
            message1 = "Veuillez payer le montant en attente pour publier un autre travail.";
          }

          response.message = message1;
          cb(null, response);
        }
        else {
          response.type = "Success";
          response.IsPayPending = false;
          cb(null, response);
        }
      }
    });
  }

  Customer.remoteMethod('checkIfPaymentPending', {
    http: { path: '/checkIfPaymentPending', verb: 'post' },
    accepts: [
      {
        arg: 'data',
        type: 'object',
        http: { source: 'body' }
      }
    ],
    returns: { arg: 'response', type: 'object' }
  });
  Customer.deleteCustomerandSendMail = function (data, cb) {
    var response = {};
    Customer.findById(data.customerId, (custErr, custRes) => {
      if (custErr) {
        response.type = "Error";
        response.message = custErr;
        cb(null, response);
      }
      else {
        var to = custRes.email;
        var subject = 'Profile Deleted By Admin';
        var text = 'text';
        var html = 'Hi,<br>Your profile has been deleted by Admin. Please contact admin for details.<br><br>Regards,<br>Krew Team';
        if (data.id) {
          Customer.destroyById(data.id, (err, res) => {
            if (err) {
              response.type = "Error";
              response.message = err;
              cb(null, response);
            }
            else {
              response.type = "Success";
              response.message = res;
              Customer.sendEmail(to, subject, text, html, function (cb) {

              });
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
    })



  }

  Customer.remoteMethod('deleteCustomerandSendMail', {
    http: { path: '/deleteCustomerandSendMail', verb: 'POST' },
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
