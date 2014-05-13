///// Load more /////
// Set the 'loadMore' session to 50 by default.
Session.set('loadMore', 50);

// Only show the 'Load more' button if the
// number of items in the Logs collection
// larger than 49;
Template.paper.showMore = function () {
  return Logs.find().count() > 49;
};

Template.paper.disabledLoadMore = function () {
  var loadMore = Session.get('loadMore');
  var loaded = Logs.find().count();
  if (loadMore > loaded) {
    return disabled="disabled";
  }
};

Template.paper.disabledSearchMore = function () {
  var searchMore = Session.get('searchMore');
  var text = Session.get('searchKeyword');
  var query = new RegExp(text, 'i');
  var searched = Logs.find({text: query}).count();
  if (searchMore > searched) {
    return disabled="disabled";
  }
};

// Click the 'Load more' button to show 50 more logs.
Template.paper.events({
  'click .load-more': function (e, tmpl) {
    e.preventDefault();
    Session.set('loadMore', Session.get('loadMore') + 50);
  }
});

// If the 'loadMore' session changed. It will
// be rerunning, aka, subscribe userLogs again.
Deps.autorun(function () {
  Meteor.subscribe('userLogs', Session.get('loadMore'));
});
