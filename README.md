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

Meteor uses MongoDB(?) as their database. I created a new collection named "Logs" on both client and server, which is the most important collection in this tiny app.

When I pushed the "Submit" button, I wish the text in the text area form will insert into that important collection, on both client and server. Of course, the time & date of the text is as important as the text itself, so it need be inserted too.

When the process of inserting is finished safely, we can say most of the work is done. A detail I should draw is to restore the text area into empty status, waiting for the next big thing flows from its master's head.
    
Another detail is no matter we refresh the page or push a button, the text area form should be always focused by cursor, automatically and immediately. Cut off the distraction between the input and output behaviour will make the app works better.

[Try it](http://log-step2-prototype.meteor.com), the app must have a life now. Please don't mess it hard, though.
