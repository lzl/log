///// Preview /////
Template.paper.showPreview = function () {
  return Session.get('showPreview');
};

Template.paper.textPreview = function () {
  return Session.get('textPreview');
};
