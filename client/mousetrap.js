///// Mousetrap /////
Mousetrap.bind(['n', '/'], function(e) {
  $( "#text" ).focus();
  return false;
});

Mousetrap.bind(['u', '.'], function(e) {
  location.reload();
  return false;
});

Mousetrap.bind('l', function(e) {
  var lang = window.localStorage.lang || Session.get('lang');
  if (lang === 'en-us') {
    i18n.setLanguage('zh-cn');
    Session.set('lang', 'zh-cn');
    if (window.localStorage.lang) {
      window.localStorage.lang = 'zh-cn';
    }
  } else {
    i18n.setLanguage('en-us');
    Session.set('lang', 'en-us');
    if (window.localStorage.lang) {
      window.localStorage.lang = 'en-us';
    }
  }
  return false;
});

Mousetrap.bind('?', function(e) {
  Session.get('showWelcome') ? Session.set('showWelcome', false) : Session.set('showWelcome', true);
});
