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

    if (info.options.IsFromAdmin) {
      var temp = {
        email: info.email,
        access_token: info.accessToken.id
      }
      Worker.app.models.AdminTemp.upsert(temp, function (err, res) {

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
      Worker.app.models.UserTemp.upsert(temp, function (err, res) {
        Worker.app.models.Customer.sendEmail(to, subject, text, html, function (cb) {

        });
      });
    }

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
          res[i].price = Number(res[i].price);
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



  Worker.getWorkerDetailsById = function (data, cb) {
    var resposne = {};
    let details;
    Worker.findById(data.id, (err, res) => {
      if (err) {
        resposne.type = "Error";
        resposne.message = err;
        cb(null, resposne);
      }
      else {
        details = res;
        Worker.app.models.Rating.find({ where: { IsWorkerSender: false, workerId: data.id } }, (err1, res1) => {
          if (err1) {
            resposne.type = "Error";
            resposne.message = err1;
            cb(null, resposne);
          }
          else {
            let starRating = 0;
            for (let i = 0; i < res1.length; i++) {
              starRating = starRating + Number(res1[i].rating);
              starRating = starRating / (res1.length);
            }
            details.starRating = starRating;
            resposne.type = "Success";
            resposne.message = details;
            cb(null, resposne);
          }
        })
      }
    })
  }

  Worker.remoteMethod('getWorkerDetailsById', {
    http: { path: '/getWorkerDetailsById', verb: 'post' },
    accepts: [
      {
        arg: 'data',
        type: 'object',
        http: { source: 'body' }
      }
    ],
    returns: { arg: 'response', type: 'object' }
  });


  function getDay(day) {
    let weekDay;
    switch (day) {
      case 0:
        weekDay = "sun";
        break;
      case 1:
        weekDay = "mon";
        break;
      case 2:
        weekDay = "tue";
        break;
      case 3:
        weekDay = "wed";
        break;
      case 4:
        weekDay = "thu";
        break;
      case 5:
        weekDay = "fri";
        break;
      case 6:
        weekDay = "sat";
        break;
      default:
        break;
    }
    return weekDay;
  }
  Worker.getJobCount = function (data, cb) {

    const toDaysDate = new Date();
    const one_day = 1000 * 60 * 60 * 24;
    var response = {};
    let zoneIds = [];
    Worker.app.models.WorkerSkill.find({ "where": { "workerId": data.workerId } }, (err, res) => {
      if (err) {
        response.type = "Error";
        response.message = err;
        cb(null, response);
      }
      let serviceIds = [];
      for (let i = 0; i < res.length; i++) {
        serviceIds.push(res[i].serviceId);
      }
      Worker.app.models.Workeravailabletiming.find({ where: { workerId: data.workerId } }, (timingError, timingRes) => {
        if (timingError) {
          response.type = "Error";
          response.message = timingError;
          cb(null, response);
        }
        else {
          Worker.app.models.WorkerLocation.find({ "where": { "workerId": data.workerId } }, (locError, locSuccess) => {
            if (locError) {
              response.type = "Error";
              response.message = locError;
              cb(null, response);
            }
            else {

              for (let i = 0; i < locSuccess.length; i++) {
                zoneIds.push(locSuccess[i].zoneId);
              }
              Worker.app.models.Job.find({ where: { serviceId: { inq: serviceIds }, zoneId: { inq: zoneIds }, status: { nin: ['CLOSED'] } }, include: ["service", "zone", "userLocation", "customer", "currency"], "order": "postedDate ASC" }, (err1, res1) => {
                if (err1) {
                  response.type = "Error";
                  response.message = err1;
                  cb(null, response);
                }
                else {
                  var jobs = {};
                  jobs.upcomingJobs = [];
                  jobs.acceptedJobs = [];
                  jobs.declinedJobs = [];
                  jobs.completedJobs = [];
                  jobs.onGoingJobs = [];
                  jobs.cancelledJobs = [];

                  Worker.app.models.Job.find({ "where": { "workerId": data.workerId }, include: ["service", "zone", "userLocation", "customer", "currency", "worker"], "order": "postedDate ASC" }, (err2, res2) => {
                    if (err2) {
                      response.type = "Error";
                      response.message = err2;
                      cb(null, response);
                    }
                    else {
                      Worker.app.models.declinedJobs.find({ "where": { "workerId": data.workerId }, include: ["service", "job", "currency"] }, (err3, res3) => {
                        if (err3) {
                          response.type = "Error";
                          response.message = err3;
                          cb(null, response);
                        }
                        else {

                          if (res3.length && res3.length > 0) {
                            for (let i = 0; i < res3.length; i++) {

                              if (res3[i].status == "IGNORED") {
                                jobs.declinedJobs.push(res3[i]);
                              }
                              else if (res3[i].status == "CANCELLED") {
                                jobs.cancelledJobs.push(res3[i]);
                              }

                            }
                            for (let i = 0; i < res1.length; i++) {
                              if (res1[i].status == "STARTED") {
                                let index;
                                for (let k = 0; k < jobs.declinedJobs.length; k++) {
                                  // if (jobs.declinedJobs[k].jobId == res1[i].id && jobs.declinedJobs[k].workerId == res1[i].workerId) {
                                  //     index = k;
                                  // }
                                  if (jobs.declinedJobs[k].jobId == res1[i].id) {
                                    index = k;
                                  }
                                }
                                if (index || index == 0) { }
                                else {
                                  //jobs.upcomingJobs.push(res1[i]);
                                  let weekDay = getDay(new Date(res1[i].postedDate).getDay());
                                  let time = new Date(res1[i].postedDate).toLocaleString("en-US", { timeZone: data.timeZone }, { hour: 'numeric', minute: 'numeric', hour12: true });
                                  if (time) {
                                    time = time.split(', ')[1];
                                    if (time) {
                                      time = time.replace(":00", '');
                                      time = time.replace(":00", '');
                                      time = time.toLowerCase();
                                    }

                                  }

                                  for (var w = 0; w < timingRes.length; w++) {
                                    if (timingRes[w].timings) {
                                      for (var v = 0; v < timingRes[w].timings.length; v++) {
                                        if (timingRes[w].timings[v][weekDay] == true) {
                                          if (timingRes[w].timings[v].time == time) {
                                            jobs.upcomingJobs.push(res1[i]);

                                          }

                                        }
                                      }
                                    }

                                  }
                                }
                              }
                            }
                            response.type = "Success";
                            response.message = jobs.upcomingJobs.length;
                            cb(null, response);
                          }
                          else {
                            for (let i = 0; i < res1.length; i++) {
                              if (res1[i].status == "STARTED") {

                                let weekDay = getDay(new Date(res1[i].postedDate).getDay());
                                let time = new Date(res1[i].postedDate).toLocaleString("en-US", { timeZone: data.timeZone }, { hour: 'numeric', minute: 'numeric', hour12: true });
                                if (time) {
                                  time = time.split(', ')[1];
                                  if (time) {
                                    time = time.replace(":00", '');
                                    time = time.replace(":00", '');
                                    time = time.toLowerCase();
                                  }

                                }

                                for (var w = 0; w < timingRes.length; w++) {
                                  if (timingRes[w].timings) {
                                    for (var v = 0; v < timingRes[w].timings.length; v++) {
                                      if (timingRes[w].timings[v][weekDay] == true) {
                                        if (timingRes[w].timings[v].time == time) {
                                          jobs.upcomingJobs.push(res1[i]);

                                        }
                                        //finalJobData.push(timingRes[w].timings[v].time);

                                      }
                                    }
                                  }

                                }
                                //jobs.upcomingJobs.push(res1[i]);

                              }
                            }
                            response.type = "Success";
                            response.message = jobs.upcomingJobs.length;
                            cb(null, response);
                          }
                        }
                      })

                    }




                  })
                }

              });
            }
          })

        }
      });



    })

  }
  Worker.remoteMethod('getJobCount', {
    http: {
      path: '/getJobCount',
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
  });
};
