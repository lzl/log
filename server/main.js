///// Security & Search/////
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

///// Counts /////
// via https://atmospherejs.com/package/publish-counts
publishCount = function(self, name, cursor, options) {
  var count = 0;
  var initializing = true;
  options = options || {}

  var handle = cursor.observeChanges({
    added: function(id) {
      count += 1;
      if (! initializing)
        self.changed('counts', name, { count: count });
    },
    removed: function(id) {
      count -= 1;
      self.changed('counts', name, { count: count });
    }
  });

  initializing = false;
  self.added('counts', name, { count: count });
  if (! options.noReady) self.ready();

  self.onStop(function() {
    handle.stop();
  });
};

Meteor.publish('userCounts', function() {
  publishCount(this, 'userCounts', Meteor.users.find());
});

Meteor.publish('logCounts', function() {
  publishCount(this, 'logCounts', Logs.find());
});
