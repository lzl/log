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
}

if (Meteor.isServer) {

  ///// Security /////
  Meteor.publish("userLogs", function () {
    return Logs.find({user_id: this.userId})
  });

  Logs.allow({
    insert: function (userId, doc) {
      return doc.user_id === userId;
    }
  });
}
