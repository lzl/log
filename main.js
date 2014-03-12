Logs = new Meteor.Collection("logs");

if (Meteor.isClient) {

  // Cursor will focus the text area as soon as the DOM is ready.
  Meteor.startup(function () {
    $('#text').focus();
  });

  ///// Prototype /////

  // Make userLogs return all documents in Logs collection sorted by the created_at field in descending order.
  Template.paper.userLogs = function () {
    return Logs.find({user_id: Meteor.userId()}, {sort: {created_at: -1}});
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
