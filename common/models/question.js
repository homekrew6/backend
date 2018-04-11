'use strict';

module.exports = function (Question) {
  Question.getQuestions = function (cb) {


    var filter = {
      where: {
        parent_id: 0
      },
      include: ['service']
    };

    return Question.find(filter).then(function (empl) {

      return empl;
    }).catch(function (err) {
      console.log(err);
    });
  }
  Question.remoteMethod('getQuestions', {
    http: {
      path: '/getQuestions',
      verb: 'get'
    },

    returns: {
      arg: 'question',
      type: 'array'
    }
  });

  Question.observe('after save', function (ctx, next) {
    if (ctx.instance) {
      console.log('Saved %s#%s', ctx.Model.modelName, ctx.instance.id);
      console.log('Instance data', ctx.instance);
      if (ctx.instance.type == 1 || ctx.instance.type == 2 || ctx.instance.type == 4)

      {
        if(ctx.instance.answerId)
        {
          Question.app.models.Answer.upsert({
            title: ctx.instance.title?ctx.instance:'',
            icon: ctx.instance.icon?ctx.instance.icon:'',
            image: ctx.instance.image?ctx.instance.image:'',
            option_price_impact: ctx.instance.option_price_impact,
            price_impact: ctx.instance.price_impact,
            option_time_impact: ctx.instance.option_time_impact,
            time_impact: ctx.instance.time_impact,
            currencyId: ctx.instance.currencyId,
            parts: '',
            scope: '',
            questionId: ctx.instance.id,
            id:ctx.instance.answerId
  
          }, function (err, models) {
            if (err) {
              console.log(err);
            } else {
              console.log("success in saving answer");
            }
          });
        }
        else
        {
          Question.app.models.Answer.upsert({
            title: ctx.instance.title?ctx.instance:'',
            icon: ctx.instance.icon?ctx.instance.icon:'',
            image: ctx.instance.image?ctx.instance.image:'',
            option_price_impact: ctx.instance.option_price_impact,
            price_impact: ctx.instance.price_impact,
            option_time_impact: ctx.instance.option_time_impact,
            time_impact: ctx.instance.time_impact,
            currencyId: ctx.instance.currencyId,
            parts: '',
            scope: '',
            questionId: ctx.instance.id
  
          }, function (err, models) {
            if (err) {
              console.log(err);
            } else {
              console.log("success in saving answer");
            }
          });
        }
      
      }



    } else {
      console.log('Updated %s matching %j',
        ctx.Model.pluralModelName,
        ctx.where
      );
    }
    next();
  });

};

