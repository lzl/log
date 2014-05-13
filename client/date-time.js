///// Date & Time /////
Template.log.dateTime = function () {
  return moment(this.created_at).format("YYYY.MM.DD HH:mm:ss");
};
