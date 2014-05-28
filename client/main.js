// The function will run as soon as the DOM is ready.
Meteor.startup(function () {
  // reset
  Session.set('finger', 'step0');
  Session.set('showTips', false);
  // resize
  autoresize();
  // focus
  $( "#text" ).focus();
});

///// Logs /////
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

Template.pencil.events({
  'submit form': function (e, tmpl) {
    e.preventDefault();
    var val = tmpl.find('#text').value;
    val = $.trim(val);

    if (val && Meteor.userId()) {
      Meteor.call('submit', val);
      Session.set('showWelcome', false);
      // Remove next line before run the code if you don't use Mixpanel.
      mixpanel.track("Submit");
    }

    if (val && !Meteor.userId()) {
      demoContinueInsert(val);
      // Remove next line before run the code if you don't use Mixpanel.
      mixpanel.track("Try");
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
    // Remove next line before run the code if you don't use Mixpanel.
    mixpanel.track("Delete");
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
    Session.set('showWelcome', false);
    // Remove next line before run the code if you don't use Mixpanel.
    mixpanel.track("Undo");
  }
});
