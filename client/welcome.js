///// Welcome /////
Template.paper.showWelcome = function () {
  if (Session.get('showWelcome')) {
    return true;
  }
  Meteor.call('showWelcome', function (error, result) {
    check(result, Boolean);
    if (result) {
      Session.set('showWelcome', true);
    } else {
      Session.set('showWelcome', false);
    }
  });
  return Session.get('showWelcome');
}
Template.paper.welcome = function () {
  return i18n('welcomeText');
};

Meteor.methods({
  showWelcome: function () {
    return Logs.find().count() === 0;
  }
});
