Logs = new Meteor.Collection("logs");

if (Meteor.isClient) {

  Meteor.subscribe("userLogs");

  Meteor.startup(function () {
    $('#text').focus();
  });

  ///// Prototype /////
  Template.paper.userLogs = function () {
    return Logs.find({}, {sort: {created_at: -1}});
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

  ///// Delete /////
  // showRemove is a template helpers available
  // to the log template. If this log is created
  // by you, return true.
  Template.log.showRemove = function () {
    return this.user_id === Meteor.userId();
  };

  // When you click 'x', that log you owned will 
  // be removed by you.
  Template.log.events({
    'click .eraser': function () {
      Logs.remove(this._id);
    }
  });
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
