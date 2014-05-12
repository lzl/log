///// Counts /////
// via https://atmospherejs.com/package/publish-counts
Counts = new Meteor.Collection('counts');

Counts.get = function(name) {
  var count = Counts.findOne(name);
  return count && count.count;
};

Meteor.subscribe("userCounts");
Meteor.subscribe("logCounts");

UI.body.userCounts = function () {
  return Counts.get('userCounts');
};
UI.body.logCounts = function () {
  return Counts.get('logCounts');
};
