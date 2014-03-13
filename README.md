log
===

Do you have a life? Log it for the future version of yourself.

# Why?

Why I build this Meteor app? 1st, I have learned Meteor for a while, I need a tiny project to evaluate what I have learned. 2nd, I have a blog for a long time, I used to tweet a few words, but I need a sandbox to log what I am doing, what I have learned and how is the projects going on. This app is my answer to mine. I will use it daily and I hope it will be enjoyable, to me and some of you.

# Layout

'git checkout step1-layout'

Thinking is like a stream of river flows out of your head. When you have something to log, just output it, without any barrier. When you output with your finger on the keyboard, the bytes print on the screen will and only will be what you're typing or its context.

Then, a place to log and a place to see the logs you have submited. That's all we need.

# Prototype

'git checkout step2-prototype'

Layout is done. But it is not working at all. Now let's give it a life.

Meteor uses MongoDB as their database. I created a new collection named "Logs" on both client and server, which is the most important collection in this tiny app.

When I pushed the "Submit" button, I wish the text in the text area form will insert into that important collection, on both client and server. Of course, the time & date of the text is as important as the text itself, so it need be inserted too.

When the process of inserting is finished safely, we can say most of the work is done. A detail I should draw is to restore the text area into empty status, waiting for the next big thing flows from its master's head.
    
Another detail is no matter we refresh the page or push a button, the text area form should be always focused by cursor, automatically and immediately. Cut off the distraction between the input and output behaviour will make the app works better.

[Try it](http://log-step2-prototype.meteor.com), the app must have a life now. Please don't mess it hard, though.

# Account

'git checkout step3-account'

When I say please don't mess it hard, I know some of you will.

Account can stop that happening, partly. Add the account feature to an app with Meteor is as simple as submit a log.

1st, at the terminal, 'meteor add accounts-password accounts-ui'. 2nd, at the code editor, add '{{loginButtons}}' to the html file properly. There is no 3rd step. Smile.

With the 'accounts-password' package enabled, we created another collection called 'users', along with the 'logs' one. That means five things at least. 1. There are two modes for every visitors now, sign in or sign out. 2. Each new user has an unique user id string. 3. We can insert that user id along with the text and timestamp into the Logs collection. 4. We can show and only show your logs, no other troubles. 5. We can make the text area form unavailable unless the visitor signed in as a user. Checkout the code to see how I have done that.

Or just [try it](http://log-step3-account.meteor.com), this will keep some of you from messing it up, but not all of you. Next, I will make the app secure completely. Again, with Meteor, it will be simple and easy.

# Security

'git checkout step4-security'

How to make an app secure? I really don't know. Thank god I have a genuine friend called Meteor.

By logic, to make an app secure, the app itself should control what visitor and user can SEE or DO. All of the rules should be coded on the server side.

1st, at the terminal, 'meteor remove autopublish insecure'. The 'autopublish' package automatically publishes every document in the collection to each connected client. Remove it to control what you can see. The 'insecure' package make sure all users have full write access to the collection. Remove it to control what you can do. Both packages are included by default for prototyping quickly. Be sure to remove them when you're ready for production.

2st, at the code editor, I writed the publish and allow rules by hand. Checkout the code to feel how simple it is.

Or [try it](http://log-step4-security.meteor.com). At the console of your browser, run 'Logs.find().fetch()', it just returns your logs. Then sign out as anonymous, run 'Logs.insert({text: "Insert virus"})', it will show 'insert failed: Access denied'. Meteor is a good teacher, the app gets smarter now.

# Bootstrap

'git checkout step5-bootstrap'

Bootstrap is the most popular front-end framework for developing responsive, mobile first projects on the web.

By Meteor document, it's only one step to integrate Bootstrap with your app. But I choose another way, download then copy the bootstrap.css file into my app folder. Then add some class names to the html file properly. Done.

[See it](http://log-step5-bootstrap.meteor.com) in live. Now it has a Bootstrap style.

# Markdown

'git checkout step6-markdown'

I love Markdown. It makes editor so powerful with little effort.

1st, at the terminal, 'meteor add showdown'.

2nd, at the code editor, make sure '{{#markdown}}' and '{{/markdown}}' surround the '{{text}}'. Style the css file to fit other trivial situation.

[Check it out](http://log-step6-markdown.meteor.com), signup and signin, then submit some basic markdowned words to see how it render them, e.g. h1, link, list or image.

# Delete

'git checkout step7-delete'

Maybe it's too simple to feel exciting. I can tell you the next two steps is the true beginning of handcraft coding.

When you can insert something, you want more power, such as delete some of them. Checkout the code to see how I have done that.

Or [try it](http://log-step7-delete.meteor.com) by yourself.

# Undo

'git checkout step8-undo'

After deleting something, maybe two or three seconds, you regret. That's not good, but shit happens sometimes.

Perhaps someone told you should alert users when they do some important stuff, such as delete data. But I don't think so. Instead of an alert window, what they really need is a trash, the undo button.

Here is the whole concept of the Undo feature:

1. When 'x' is clicked legally, copy that log into a local collection called Trash. Then remove that log from server as while as reveal the Undo button.
2. If the user regret what has done. Click the Undo button. That log will be restored from the Trash collection on the client to the Logs collection on the server. Everything is fine.
3. If the user do nothing with the Undo button, like close or refresh the page. The local collection will be reset, including the Trash. Now, that log was gone forever.

The logic is simple and clear. Checkout the code to see how I have done that.

Or, as usual, [try it](http://log-step8-undo.meteor.com) on your browser to feel how good it is.
