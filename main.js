Logs = new Meteor.Collection("logs");

if (Meteor.isClient) {

  Meteor.subscribe("userLogs");

  Meteor.startup(function () {
    $('#text').focus();
  });

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

      tmpl.find('form').reset();
      tmpl.find('#text').focus();
    }
  })

  ///// Delete & Undo/////
  // Create a local collection called Trash.
  var Trash = new Meteor.Collection(null);
  var Undos = new Meteor.Collection(null);

  Template.log.showRemove = function () {
    return this.user_id === Meteor.userId();
  };

  Template.log.events({
    'click .eraser': function () {
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
    return this.created_at.toLocaleString();
  }
}

if (Meteor.isServer) {

  ///// Security /////
  Meteor.publish("userLogs", function () {
    return Logs.find({user_id: this.userId})
  });

  Logs.allow({
    insert: function (userId, doc) {
      return doc.user_id === userId;
    },

    // Others could not remove yours. You
    // don't have the permission to hurt
    // others, too.
    remove: function (userId, doc) {
      return doc.user_id === userId;
    }
  });
}
