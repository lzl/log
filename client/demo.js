///// Demo /////
// Run this if visitor is not signed in.
Deps.autorun(function () {
  if (!Meteor.userId()) {
    // Create a local collection called Demo to store the demo messages.
    var Demo = new Meteor.Collection(null);
    Session.set('demoContinue', true);
    // i18n begins
    if (window.localStorage.lang === "zh-cn") {
      demoLogs = ["我是一款[开源软件](https://github.com/lzl/log)，正运行在 Meteor " + Meteor.release + " 上。",
                  "这里只允许你自言自语，不被他人打扰，更不被他人偷窥。",
                  "你现在就可以试着提交一条日志。快，我等着你。"];
    } else {
      demoLogs = ["I'm [open-sourced](https://github.com/lzl/log). Running on Meteor " + Meteor.release + ".",
                  "I'm the anti-social version of Twitter for introverts.",
                  "This is a new log. You can submit one by yourself, now."];
    }
    // i18n ends
    demoInsertTimes = 0;

    function demoInsert () {
      if (demoInsertTimes < demoLogs.length) {
        Demo.insert({
          text: demoLogs[demoInsertTimes],
          created_at: new Date()
        });
        demoInsertTimes++;
      } else {
        console.log("You should signup by click the [Sign in] button.");
        Meteor.clearInterval(timeout);
        if (Session.get('finger') === 'step0') {
          Session.set('finger', 'step1');
        } else {
          Session.set('finger', 'step0');
        }
      }
    }
    // Insert the message above every 2 seconds.
    timeout = Meteor.setInterval(demoInsert, 2000);

    Template.paper.demoLogs = function () {
      return Demo.find({}, {sort: {created_at: -1}});
    };
  }

  demoContinueInsert = function(val) {
    Demo.insert({
      text: val,
      created_at: new Date()
    });
    Session.set('finger', 'step1');
    if (Demo.find().count() > demoLogs.length && Session.get('demoContinue')) {
      (function() {
        // i18n begins
        if (window.localStorage.lang === "zh-cn") {
          demoLogs = ["你成功了。",
                      "恭喜你！",
                      "你可以选择免费注册我们的服务，从而储存并搜索今后提交的所有日志。\n\n![Sign up now](/signup-cn.gif)"];
        } else {
          demoLogs = ["You just got it.",
                      "Congratulations!",
                      "Signup for free, then you can log and search your life.\n\n![Sign up now](/signup-en.gif)"];
        }
        // i18n ends
        demoInsertTimes = 0;
        timeout = Meteor.setInterval(demoInsert, 2000);
      })();
      Session.set('demoContinue', false);
    }
  }
})
