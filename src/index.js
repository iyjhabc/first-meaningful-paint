
class FMP {
  /**
   * get first-meaningful-paint
   */
  static getFmp(observeTime = 3000) {
    if (!Promise
      || !window.performance
      || !window.performance.timing
      || !window.requestAnimationFrame
      || !window.MutationObserver) {
      console.log('fmp can not be retrieved');
      Promise.reject(new Error('fmp can not be retrieved'));
    }

    const promise = new Promise((resolve) => {
      const observedPoints = [];
      const observer = new window.MutationObserver(() => {
        const innerHeight = window.innerHeight;
        /**
         * efficiency bottleneck: Element.getBoundingClientRect()
         * using DFS to avoid parents/pre-siblings dom rect dectection
         */
        function getDomMark(dom, level) {
          let sum = 0;
          const tagName = dom.tagName;
          if (tagName !== 'SCRIPT' && tagName !== 'STYLE' && tagName !== 'META' && tagName !== 'HEAD') {
            const length = dom.children ? dom.children.length : 0;
            if (length > 0) {
              const children = dom.children;
              for (let i = length; i > 0 ; i--) {
                sum += getDomMark(children[i-1], level + 1);
              }
            }

            if (sum > 0 || (dom.getBoundingClientRect && dom.getBoundingClientRect().top < innerHeight)) {
              sum += (level * length);
            }
          }
          return sum;
        }
        window.requestAnimationFrame(() => {
          const timing = window.performance.timing;
          const startTime = timing.navigationStart || timing.fetchStart;
          const t = new Date().getTime() - startTime;
          const score = getDomMark(document, 1);
          observedPoints.push({
            score,
            t,
          });
        });
      });
      observer.observe(document, {
        childList: true,
        subtree: true,
      });

      setTimeout(() => {
        observer.disconnect();
        const rates = [];
        for (let i = 1; i < observedPoints.length; i++) {
          if (observedPoints[i].t !== observedPoints[i - 1].t) {
            rates.push({
              t: observedPoints[i].t,
              rate: observedPoints[i].score - observedPoints[i - 1].score,
            });
          }
        }
        rates.sort((a, b) => b.rate - a.rate);
        if (rates.length > 0) {
          resolve(rates[0].t);
        } else {
          resolve(observeTime);
        }
      }, observeTime);
    });
    return promise;
  }
}

export default FMP;
