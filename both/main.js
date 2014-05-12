Logs = new Meteor.Collection("logs");

Meteor.methods({
  submit: function (val) {
    check(val, String);
    var userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(401, "The request requires user authentication.");
    }
    if (!val) {
      throw new Meteor.Error(411, "Length required.")
    }
    return Logs.insert({
      text: val,
      user_id: userId,
      created_at: new Date()
    });
  },
  undo: function (val) {
    check(val, {
      _id: String,
      text: String,
      user_id: String,
      created_at: Date
    });
    var userId = this.userId;
    if (!userId) {
      throw new Meteor.Error(401, "The request requires user authentication.");
    }
    if (!val) {
      throw new Meteor.Error(411, "Length required.")
    }
    return Logs.insert(val);
  }
});
