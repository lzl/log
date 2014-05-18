///// i18n /////
var lang = window.localStorage.lang || (navigator.language || navigator.browserLanguage).toLowerCase();
if (window.localStorage.lang) {
  window.localStorage.lang = lang;
}
Session.set('lang', lang);
if (lang === "zh-cn") {
  i18n.setLanguage('zh-cn');
} else {
  i18n.setDefaultLanguage('en-us');
}

i18n.map('en-us', {
  title: "log",
  loading: "Loading...|Bear with me. I am working hard.|Your patience is all I need.",
  placeholder: "What's new?",
  submit: "Submit",
  eraser: "Move to Trash",
  deleted: "Deleted. Regret? ",
  undo: "Get it back",
  undoTitle: "Be careful next time :D",
  preview: "Preview",
  loadMore: "Load more",
  totalUsers: "total users:",
  totalLogs: "total logs:",
  welcome: "Welcome",
  welcomeText: "\nThank you for joining. I wish this app will push more value back to you while using it with energy from you.\n\nMy name is Zunlong Lee, you can call me [LZL](http://lizunlong.com) for short. To be honest, I need a private place to rewired what I found valuable from the Internet or my mind. So I made this app after learning coding with the awesome [Meteor](https://www.meteor.com/).\n\nFocus is the most important quality if you want to flourish and prosper in the Internet world. Why? Because today is full of distractions. People made things for the things they want by hunting our limited attention. It's not the Internet's or the builders' fault. They are booming our technology. And they are building a better world for all human.\n\nThe one thing we should think about in our head everyday is this: [What is my must?](http://vimeo.com/77436516) Find your must through the distracted and abundant world. Then focus on your own.\n\nIf you agree with me, I believe you do, please submit the valuable bits at the top text area as pursuing your must. Thank you."
});
i18n.map('zh-cn', {
  title: "日志",
  loading: "立等可取...|载入中，莫急。|等待返回信号...|正在从大洋彼岸拉数据...|请稍候...",
  placeholder: "今天有什么新发现？",
  submit: "提交",
  eraser: "删除",
  deleted: "已删除。误操作？",
  undo: "可撤销",
  undoTitle: "一键还原",
  preview: "预览",
  loadMore: "显示更多",
  totalUsers: "用户总数:",
  totalLogs: "日志总量:",
  welcome: "欢迎光临",
  welcomeText: "\n谢谢捧场。欢迎在这里记录、检索你的点滴发现。\n\n我叫[李尊龙](http://lizunlong.com/)，是这款应用的创造者。我曾希望拥有一处私密、安静的小角落，记录心中所想、眼中所见，同时能够通过只言片语回忆起那时那刻。这里便是我为自己建造的小角落，幸运的是，互联网允许我以几乎零成本的代价将它复制到你的时空中，然后由你来选择是否在此处长留。\n\n『你每天上网都做些什么？』因为我很宅，所以不少人问过我这个问题。我总是支支吾吾，找不到合适的词语作答。后来，也许是因为惯性，我时常自问『我每天都在干些什么啊？』\n\n『专注』是一项极为重要的技能，集全力释于一点，事半功倍，但易说难做。互联网本质上携有一股『分心』能量，一个超级链接嵌套着多个超级链接，循环无穷，无论你有多么充裕的时间，理论上都能够被它抽空并内化为更多能量去抽空其他人。\n\n我们的生活本身就是在不断分心，只不过互联网让这一趋势变得更加明显。『分心』意味着你有机会接触到未知且有趣的信息，这远比在闭塞环境下不得不专注于某件维持生计的事物要幸福得多。\n\n因此，最好的情况是在一个允许分心的环境下找到那件值得为之专注的事物。幸运的是，我们正身处这一环境中。\n\n如果你同意我的观点，那么请努力和我一起在这里记录生活中的点滴发现，发现美好的事物，发现属于你的『专注』。在这一过程中，使用哪个工具并不重要，重要的是在头脑中保留一个从复杂生活中抽取属于自己的简单真理的念头，就足够了。"
});

// via https://github.com/meteor/meteor/issues/266
Deps.autorun(function () {
  document.title = i18n("title");
});
