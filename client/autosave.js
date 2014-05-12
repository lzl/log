///// Autosave /////
Template.pencil.autosave = function () {
  return Session.get('searchKeyword') || window.localStorage.autosave;
};
