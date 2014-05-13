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
