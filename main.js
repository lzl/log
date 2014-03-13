Logs = new Meteor.Collection("logs");

if (Meteor.isClient) {

  // Client subscribes what the server published.
  Meteor.subscribe("userLogs");

  Meteor.startup(function () {
    $('#text').focus();
  });

  ///// Prototype /////
  Template.paper.userLogs = function () {
    // Don't need to find the subset of collection.
    // Don't need to sort them.
    // They're done by the server now.
    return Logs.find();
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
  // The codes below run on the server only.

  ///// Security /////
  Meteor.publish("userLogs", function () {
    return Logs.find({user_id: this.userId}, {sort: {created_at: -1}})
  });

  Logs.allow({
    insert: function (userId, doc) {
      return doc.user_id === userId;
    }
  });
}
