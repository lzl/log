///// Welcome /////
Template.paper.showWelcome = function () {
  Meteor.call('showWelcome', function (error, result) {
    check(result, Boolean);
    if (result) {
      Session.set('showWelcome', true);
      // Remove next line before run the code if you don't use Mixpanel.
      mixpanel.track("Join");
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
