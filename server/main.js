///// Security & Search /////
// Limit the number of items while publish.
// I added the sort back, because I wish the app
// publish the latest items with 'limit' enabled.
Meteor.publish("userLogs", function (limit) {
  check(limit, Number);
  return Logs.find({user_id: this.userId}, {sort: {created_at: -1}, limit: limit})
});

Meteor.publish("searchedLogs", function (text, limit) {
  check(text, String);
  check(limit, Number);
  var query = new RegExp(text, 'i');
  return Logs.find({user_id: this.userId, text: query}, {sort: {created_at: -1}, limit: limit});
});

Logs.allow({
  remove: function (userId, doc) {
    return doc.user_id === userId;
  }
});
