// Remove this file before run the code if you don't use Mixpanel.
Deps.autorun(function () {
  if (Meteor.userId()) {
    mixpanel.track("User");
  } else {
    mixpanel.track("Visitor");
  }
});
