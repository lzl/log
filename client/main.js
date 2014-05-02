// The function will run as soon as the DOM is ready.
Meteor.startup(function () {
  ///// resize & focus /////
  autoresize();
  $( "#text" ).focus();
});

///// i18n /////
var lang = window.localStorage.lang || (navigator.language || navigator.browserLanguage).toLowerCase();
window.localStorage.lang = lang;
if (lang === "zh-cn") {
  i18n.setLanguage('zh-cn');
} else {
  i18n.setDefaultLanguage('en-us');
}

///// Demo /////
// Run this if visitor is not signed in.
if (!Meteor.userId()) {
  // Create a local collection called Demo to store the demo messages.
  var Demo = new Meteor.Collection(null);
  Session.set("demoContinue", true);
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
    }
  }
  // Insert the message above every 2 seconds.
  timeout = Meteor.setInterval(demoInsert, 2000);

  Template.paper.demoLogs = function () {
    return Demo.find({}, {sort: {created_at: -1}});
  };
}

///// Prototype & Undo/////
Template.paper.userLogs = function () {
  // return Logs.find({}, {sort: {created_at: -1}});
  // I commented the old code above. It is
  // simple and elegant. But not suitable
  // with the new situation.

  // The new code is handcrafted by the tips
  // from Stack Overflow.
  var userLogs = Logs.find().fetch();
  var undoLogs = Undos.find().fetch();
  var allLogs = userLogs.concat(undoLogs);
  return _.sortBy(allLogs, function(doc) {
    return -doc.created_at;
  });
};

Template.paper.events({
  'submit form': function (e, tmpl) {
    e.preventDefault();
    var val = tmpl.find('#text').value;

    if (val && Meteor.userId()) {
      Meteor.call('submit', val);
    }

    if (val && !Meteor.userId()) {
      Demo.insert({
        text: val,
        created_at: new Date()
      });
      if (Demo.find().count() > demoLogs.length && Session.get("demoContinue")) {
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
        Session.set("demoContinue", false);
      }
    }

    Session.set('searchKeyword', undefined);
    window.localStorage.autosave = "";
    tmpl.find('form').reset();
    tmpl.find('#text').focus();
    Session.set('showSearch', false);
    Session.set('showPreview', false);
    autoresize();
  }
});

///// Delete & Undo/////
// Create local collections called Trash and Undos.
var Trash = new Meteor.Collection(null);
var Undos = new Meteor.Collection(null);

Template.log.showRemove = function () {
  return this.user_id === Meteor.userId();
};

Template.log.events({
  'click .eraser': function (e, tmpl) {
    // Copy that log into Trash.
    Trash.insert(this);
    // Insert the Undo button with that
    // log's id information to retrieve
    // that log later.
    var deleted = i18n('deleted');
    var undo = i18n('undo');
    var undoTitle = i18n('undoTitle');
    var text = deleted + '[' + undo + '](#undo "' + undoTitle + '")';
    Undos.insert({
      _id: this._id,
      text: text,
      created_at: this.created_at
    });
    // Remove that log from server.
    Logs.remove(this._id);
  },
  'click [href="#undo"]': function () {
    // Find that log with the id information
    // then save it into a variable.
    var undoLog = Trash.find({_id: this._id}).fetch()[0];
    // Remove that Undo button from client.
    Undos.remove(this._id);
    // Remove the cloned log from client.
    Trash.remove(this._id);
    // Insert that variable into Logs collection
    // on the server. That variable contains all
    // information about that removed log, including
    // the timestamp when it was created.
    Meteor.call('undo', undoLog);
  }
});

///// Date & Time /////
Template.log.dateTime = function () {
  return moment(this.created_at).format("YYYY.MM.DD HH:mm:ss");
};

///// Load more /////
// Set the 'loadMore' session to 50 by default.
Session.set('loadMore', 50);

// Only show the 'Load more' button if the
// number of items in the Logs collection
// larger than 49;
Template.paper.showMore = function () {
  return Logs.find().count() > 49;
};

Template.paper.disabledLoadMore = function () {
  var loadMore = Session.get('loadMore');
  var loaded = Logs.find().count();
  if (loadMore > loaded) {
    return disabled="disabled";
  }
};

Template.paper.disabledSearchMore = function () {
  var searchMore = Session.get('searchMore');
  var text = Session.get('searchKeyword');
  var query = new RegExp(text, 'i');
  var searched = Logs.find({text: query}).count();
  if (searchMore > searched) {
    return disabled="disabled";
  }
};

// Click the 'Load more' button to show 50 more logs.
Template.paper.events({
  'click .load-more': function (e, tmpl) {
    e.preventDefault();
    Session.set('loadMore', Session.get('loadMore') + 50);
  }
});

// If the 'loadMore' session changed. It will
// be rerunning, aka, subscribe userLogs again.
Deps.autorun(function () {
  Meteor.subscribe('userLogs', Session.get('loadMore'));
});

///// Search /////
// Set the showSearch session to false by default.
Session.set('showSearch', false);
Session.set('searchMore', 10);

Template.paper.showSearch = function () {
  return Session.get('showSearch');
};

Template.paper.searchedLogs = function () {
  var text = Session.get('searchKeyword');
  // RegExp is a big helper in this search step.
  // The RegExp constructor creates a regular
  // expression object for matching text with a pattern.
  // The 'i' flag means ignore case.
  var query = new RegExp(text, 'i');
  return Logs.find({text: query}, {sort: {created_at: -1}});
};

Template.paper.showMoreSearch = function () {
  var text = Session.get('searchKeyword');
  var query = new RegExp(text, 'i');
  return Logs.find({text: query}).count() > 9;
};

Template.paper.events({
  'keyup, #text': function (e, tmpl) {
    e.preventDefault();
    var val = tmpl.find('#text').value;
    Session.set('searchKeyword', val);
    window.localStorage.autosave = val;
    if (val) {
      Session.set('showSearch', true);
      Session.set('showPreview', true);
      Session.set('textPreview', val);
    } else {
      Session.set('showSearch', false);
      Session.set('searchMore', 10);
      Session.set('showPreview', false);
    }
    autoresize();
  },
  'click .search-more': function (e, tmpl) {
    e.preventDefault();
    Session.set('searchMore', Session.get('searchMore') + 20);
  }
});

Deps.autorun(function () {
  Meteor.subscribe('searchedLogs', Session.get('searchKeyword'), Session.get('searchMore'));
});

///// Preview /////
Template.paper.showPreview = function () {
  return Session.get('showPreview');
};

Template.paper.textPreview = function () {
  return Session.get('textPreview');
};

///// Autosave /////
Template.paper.autosave = function () {
  return Session.get('searchKeyword') || window.localStorage.autosave;
};

///// Autoresize /////
// thx http://phaistonian.pblogs.gr/expanding-textareas-the-easy-and-clean-way.html
function autoresize () {
  var t = document.getElementsByTagName('textarea')[0];
  var offset = !window.opera ? (t.offsetHeight - t.clientHeight) : (t.offsetHeight + parseInt(window.getComputedStyle(t, null).getPropertyValue('border-top-width')));
  t.style.height = 'auto';
  t.style.height = (t.scrollHeight  + offset + 27) + 'px';
}

///// Counts /////
// via https://atmospherejs.com/package/publish-counts
Counts = new Meteor.Collection('counts');

Counts.get = function(name) {
  var count = Counts.findOne(name);
  return count && count.count;
};

Meteor.subscribe("userCounts");
Meteor.subscribe("logCounts");

UI.body.userCounts = function () {
  return Counts.get("userCounts");
};
UI.body.logCounts = function () {
  return Counts.get("logCounts");
};

///// Mousetrap /////
Mousetrap.bind(['n', '/'], function(e) {
  $( "#text" ).focus();
  return false;
});
Mousetrap.bind(['u', '.'], function(e) {
  location.reload();
  return false;
});
Mousetrap.bind('l', function(e) {
  var lang = window.localStorage.lang;
  if (lang === 'en-us') {
    i18n.setLanguage('zh-cn');
    window.localStorage.lang = 'zh-cn';
  } else {
    i18n.setLanguage('en-us');
    window.localStorage.lang = 'en-us';
  }
  return false;
});
Mousetrap.bind('?', function(e) {
  Session.get('showWelcome') ? Session.set('showWelcome', false) : Session.set('showWelcome', true);
});

///// i18n /////
i18n.map('en-us', {
  title: "log",
  loading: "Loading...",
  placeholder: "What's new?",
  submit: "Submit",
  eraser: "Move to Trash",
  deleted: "Deleted. Regret? ",
  undo: "Get it back",
  undoTitle: "Be careful next time :D",
  preview: "Preview",
  loadMore: "Load more",
  totalUsers: "total users:",
  totalLogs: "total logs:",
  welcome: "Welcome",
  welcomeText: "\nThank you for joining. I wish this app will push more value back to you while using it with energy from you.\n\nMy name is Zunlong Lee, you can call me [LZL](http://lizunlong.com) for short. To be honest, I need a private place to rewired what I found valuable from the Internet or my mind. So I made this app after learning coding with the awesome [Meteor](https://www.meteor.com/).\n\nFocus is the most important quality if you want to flourish and prosper in the Internet world. Why? Because today is full of distractions. People made things for the things they want by hunting our limited attention. It's not the Internet's or the builders' fault. They are booming our technology. And they are building a better world for all human.\n\nThe one thing we should think about in our head everyday is this: [What is my must?](http://vimeo.com/77436516) Find your must through the distracted and abundant world. Then focus on your own.\n\nIf you agree with me, I believe you are, please submit the valuable bits at the top text area as pursuing your must. Thank you."
});
i18n.map('zh-cn', {
  title: "日志",
  loading: "立等可取...",
  placeholder: "今天有什么新发现？",
  submit: "提交",
  eraser: "删除",
  deleted: "已删除。误操作？",
  undo: "可撤销",
  undoTitle: "一键还原",
  preview: "预览",
  loadMore: "显示更多",
  totalUsers: "用户总数:",
  totalLogs: "日志总量:",
  welcome: "欢迎光临",
  welcomeText: "\n谢谢捧场。欢迎在这里记录、检索你的点滴发现。\n\n我叫[李尊龙](http://lizunlong.com/)，是这款应用的创造者。我曾希望拥有一处私密、安静的小角落，记录心中所想、眼中所见，同时能够通过只言片语回忆起那时那刻。这里便是我为自己建造的小角落，幸运的是，互联网允许我以几乎零成本的代价将它复制到你的时空中，然后由你来选择是否在此处长留。\n\n『你每天上网都做些什么？』因为我很宅，所以不少人问过我这个问题。我总是支支吾吾，找不到合适的词语作答。后来，也许是因为惯性，我时常自问『我每天都在干些什么啊？』\n\n『专注』是一项极为重要的技能，集全力释于一点，事半功倍，但易说难做。互联网本质上携有一股『分心』能量，一个超级链接嵌套着多个超级链接，循环无穷，无论你有多么充裕的时间，理论上都能够被它抽空并内化为更多能量去抽空其他人。\n\n我们的生活本身就是在不断分心，只不过互联网让这一趋势变得更加明显。『分心』意味着你有机会接触到未知且有趣的信息，这远比在闭塞环境下不得不专注于某件维持生计的事物要幸福得多。\n\n因此，最好的情况是在一个允许分心的环境下找到那件值得为之专注的事物。幸运的是，我们正身处这一环境中。\n\n如果你同意我的观点，那么请努力和我一起在这里记录生活中的点滴发现，发现美好的事物，发现属于你的『专注』。在这一过程中，使用哪个工具并不重要，重要的是在头脑中保留一个从复杂生活中抽取属于自己的简单真理的念头，就足够了。"
});
// via https://github.com/meteor/meteor/issues/266
Deps.autorun(function () {
  document.title = i18n("title");
});

///// Welcome /////
Template.paper.showWelcome = function () {
  Meteor.call('showWelcome', function (error, result) {
    check(result, Boolean);
    if (result) {
      Session.set("showWelcome", true);
    } else {
      Session.set("showWelcome", false);
    }
  });
  if (Session.get("showWelcome")) {
    return true;
  } else {
    return false;
  }
}
Template.paper.welcome = function () {
  return i18n("welcomeText");
};

///// Methods /////
Meteor.methods({
  showWelcome: function () {
    return Logs.find().count() === 0;
  }
});
