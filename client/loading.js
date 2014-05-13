///// Loading /////
Template.paper.loading = function () {
  var loading = i18n('loading').split("|");
  var rand = loading[Math.floor(Math.random() * loading.length)];
  return rand;
};
