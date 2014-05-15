Package.describe({
  summary: "Mixpanel Analyics"
});

Package.on_use(function (api) {
  api.add_files('loader.js', 'client');
});
