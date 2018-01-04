'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FMP = function () {
  function FMP() {
    _classCallCheck(this, FMP);
  }

  _createClass(FMP, null, [{
    key: 'getFmp',

    /**
     * get first-meaningful-paint
     */
    value: function getFmp() {
      var observeTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3000;

      if (!Promise || !window.performance || !window.performance.timing || !window.requestAnimationFrame || !window.MutationObserver) {
        console.log('fmp can not be retrieved');
        Promise.reject(new Error('fmp can not be retrieved'));
      }

      var promise = new Promise(function (resolve) {
        var observedPoints = [];
        var observer = new window.MutationObserver(function () {
          var innerHeight = window.innerHeight;
          function getDomMark(dom, level) {
            var length = dom.children ? dom.children.length : 0;
            var sum = 0;
            var tagName = dom.tagName;
            if (tagName !== 'SCRIPT' && tagName !== 'STYLE' && tagName !== 'META' && tagName !== 'HEAD') {
              if (dom.getBoundingClientRect && dom.getBoundingClientRect().top < innerHeight) {
                sum += level * length;
              }
              if (length > 0) {
                var children = dom.children;
                for (var i = 0; i < length; i++) {
                  sum += getDomMark(children[i], level + 1);
                }
              }
            }
            return sum;
          }
          window.requestAnimationFrame(function () {
            var timing = window.performance.timing;
            var startTime = timing.navigationStart || timing.fetchStart;
            var t = new Date().getTime() - startTime;
            var score = getDomMark(document, 1);
            observedPoints.push({
              score: score,
              t: t
            });
          });
        });
        observer.observe(document, {
          childList: true,
          subtree: true
        });

        setTimeout(function () {
          observer.disconnect();
          var rates = [];
          for (var i = 1; i < observedPoints.length; i++) {
            if (observedPoints[i].t !== observedPoints[i - 1].t) {
              rates.push({
                t: observedPoints[i].t,
                rate: observedPoints[i].score - observedPoints[i - 1].score
              });
            }
          }
          rates.sort(function (a, b) {
            return b.rate - a.rate;
          });
          if (rates.length > 0) {
            resolve(rates[0].t);
          } else {
            resolve(observeTime);
          }
        }, observeTime);
      });
      return promise;
    }
  }]);

  return FMP;
}();

exports.default = FMP;
