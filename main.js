Logs = new Meteor.Collection("logs");

if (Meteor.isClient) {

  Meteor.startup(function () {
    autoresize();
    $( "#text" ).focus();
  });

  ///// Demo /////
  // Run this when visitor is not signed in.
  if (!Meteor.userId()) {
    // Create a local collection called Demo to store the demo messages.
    var Demo = new Meteor.Collection(null);
    Session.set("demoContinue", true);
    demoLogs = ["I'm [open-sourced](http://github.com/lzl/log). Running on Meteor " + Meteor.release,
                "I'm the anti-social version of Twitter for introverts.\n\n这里只允许你自言自语，不被他人打扰，更不被他人偷窥。",
                "This is a new log. You can create one by yourself.\n\n你现在就可以试着提交一条日志。快，我等着你。"];
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
        Logs.insert({
          text: val,
          user_id: Meteor.userId(),
          created_at: new Date()
        });
      }

      if (val && !Meteor.userId()) {
        Demo.insert({
          text: val,
          created_at: new Date()
        });
        if (Demo.find().count() > demoLogs.length && Session.get("demoContinue")) {
          (function() {
            demoLogs = ["You just got it. 你成功了。",
                        "Congratulations! 恭喜你！",
                        "Signup for free, then you can log and search your life.\n\n你可以选择免费注册我们的服务，从而储存并搜索今后提交的所有日志。\n\n![Sign up now](/signup.gif)"];
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
  // Create a local collection called Trash.
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
      Undos.insert({
        _id: this._id,
        text: "[Undo](#undo)",
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
      Logs.insert(undoLog);
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
      if (val && Meteor.userId()) {
        Session.set('showSearch', true);
        Session.set('showPreview',true);
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
}

if (Meteor.isServer) {

  ///// Security  && Search/////
  // Limit the number of items while publish.
  // I added the sort back, because I wish the app
  // publish the latest items with 'limit' enabled.
  Meteor.publish("userLogs", function (limit) {
    return Logs.find({user_id: this.userId}, {sort: {created_at: -1}, limit: limit})
  });

  Meteor.publish("searchedLogs", function (text, limit) {
    var query = new RegExp(text, 'i');
    return Logs.find({user_id: this.userId, text: query}, {sort: {created_at: -1}, limit: limit});
  });

  Logs.allow({
    insert: function (userId, doc) {
      return doc.user_id === userId;
    },
    remove: function (userId, doc) {
      return doc.user_id === userId;
    }
  });
}
