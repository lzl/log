///// Tips /////
Template.paper.showTips = function () {
  return Session.get('showTips');
};
Template.paper.tips = function () {
  return i18n('tipsText');
};
