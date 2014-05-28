///// Search /////
// Set the showSearch session to false by default.
Session.set('showSearch', false);
Session.set('searchMore', 10);

Template.paper.showSearch = function () {
  return Session.get('showSearch');
};

Template.paper.searchedLogs = function () {
  var text = Session.get('searchKeyword');
  // RegExp is a big helper in this search step.
  // The RegExp constructor creates a regular
  // expression object for matching text with a pattern.
  // The 'i' flag means ignore case.
  var query = new RegExp(text, 'i');
  return Logs.find({text: query}, {sort: {created_at: -1}});
};

Template.paper.showMoreSearch = function () {
  var text = Session.get('searchKeyword');
  var query = new RegExp(text, 'i');
  return Logs.find({text: query}).count() > 9;
};

Template.paper.events({
  'click .search-more': function (e, tmpl) {
    e.preventDefault();
    Session.set('searchMore', Session.get('searchMore') + 20);
  }
});

Template.pencil.events({
  'keyup, #text': function (e, tmpl) {
    e.preventDefault();
    var val = tmpl.find('#text').value;
    Session.set('searchKeyword', val);
    window.localStorage.autosave = val;
    if (val) {
      Session.set('showSearch', true);
      Session.set('showPreview', true);
      Session.set('textPreview', val);
      Session.set('finger', 'step2');
    } else {
      Session.set('showSearch', false);
      Session.set('searchMore', 10);
      Session.set('showPreview', false);
      Session.set('finger', 'step1');
    }
    autoresize();
  }
});

Deps.autorun(function () {
  Meteor.subscribe('searchedLogs', Session.get('searchKeyword'), Session.get('searchMore'));
});
