First-Meaningful-Paint
=======

First-meaningful-paint is a tiny package to get first meaningful paint time at the web page effectively.

What is first meaningful paint?
---------------------------------------------------
First Meaningful Paint is the time when page's primary content appeared on the screen. This is going to be our primary metric for user-perceived loading experience.

This concept was raised by Google, [see this](https://docs.google.com/document/d/1BR94tJdZLsin5poeet0XoTW60M0SjvOJQttKT-JK8HI/view?hl=zh-cn). However, google has not yet implement first meaningful paint in performance api for some reason.

What we do
-------------------
Google has not yet implement first meaningful paint in performance api for some reason. But we found first meaningful paint is a good way to estimate the first srceen time in our page, which is critical for user experience. We want to monitor user's real first srceen time in production environment. So First-Meaningful-Paint can help you to retrieve this value in a easy way, no matter what structure your web is, React, Jquery or any other.

Install
-------------------

``` shell
npm install first-meaningful-paint
```

Usage
-------------------

``` shell
import FMP from 'first-meaningful-paint';

FMP.getFmp(3000).then((fmp) => {
    // do sth with fmp, which is a millisecond value
});
```
parameter of getFmp is the time to stop observing changes in the page, defualt is 3000 milliseconds. It shoud be bigger than the biggest loading time of your page. 

License
-------------------
MIT
