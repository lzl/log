///// Autoresize /////
// thx http://phaistonian.pblogs.gr/expanding-textareas-the-easy-and-clean-way.html
autoresize = function() {
  var t = document.getElementsByTagName('textarea')[0];
  var offset = !window.opera ? (t.offsetHeight - t.clientHeight) : (t.offsetHeight + parseInt(window.getComputedStyle(t, null).getPropertyValue('border-top-width')));
  t.style.height = 'auto';
  t.style.height = (t.scrollHeight  + offset + 27) + 'px';
}
