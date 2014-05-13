///// Welcome /////
Meteor.methods({
  showWelcome: function () {
    return Logs.find({user_id: this.userId}).count() === 0;
  }
});
