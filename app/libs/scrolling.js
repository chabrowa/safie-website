(function(window, document) {
  var DEFAULTS, NAME, SmoothScroll;
  NAME = 'SmoothScroll';
  DEFAULTS = {
    duration: 500,
    easing: 'easeInOutCubic',
    offset: 10,
    updateURL: true,
    callbackBefore: function() {},
    callbackAfter: function() {}
  };
  SmoothScroll = (function() {
    function SmoothScroll(toggle, options) {
      var data, key;
      this.toggle = toggle;
      this.supports = !!document.querySelector && !!window.addEventListener;
      data = {
        easing: this._data(this.toggle, 'easing'),
        offset: this._data(this.toggle, 'offset')
      };
      for (key in data) {
        if (data[key] === null) {
          delete data[key];
        }
      }
      this._extend(this, DEFAULTS, options, data);
      this.anchor = this.toggle.getAttribute('href').substr(1);
      this.anchorElement = document.getElementById(this.anchor);
      this.endLocation = this.getEndLocation();
      this.documentHeight = this.getDocumentHeight();
      this.easingPattern = this.easing === 'easeInQuad' ? function(time) {
        return time * time;
      } : this.easing === 'easeOutQuad' ? function(time) {
        return time * (2 - time);
      } : this.easing === 'easeInOutQuad' ? function(time) {
        if (time < 0.5) {
          return 2 * time * time;
        } else {
          return -1 + (4 - 2 * time) * time;
        }
      } : this.easing === 'easeInCubic' ? function(time) {
        return time * time * time;
      } : this.easing === 'easeOutCubic' ? function(time) {
        return (--time) * time * time + 1;
      } : this.easing === 'easeInOutCubic' ? function(time) {
        if (time < 0.5) {
          return 4 * time * time * time;
        } else {
          return (time - 1) * (2 * time - 2) * (2 * time - 2) + 1;
        }
      } : this.easing === 'easeInQuart' ? function(time) {
        return time * time * time * time;
      } : this.easing === 'easeOutQuart' ? function(time) {
        return 1 - (--time) * time * time * time;
      } : this.easing === 'easeInOutQuart' ? function(time) {
        if (time < 0.5) {
          return 8 * time * time * time * time;
        } else {
          return 1 - 8 * (--time) * time * time * time;
        }
      } : this.easing === 'easeInQuint' ? function(time) {
        return time * time * time * time * time;
      } : this.easing === 'easeOutQuint' ? function(time) {
        return 1 + (--time) * time * time * time * time;
      } : this.easing === 'easeInOutQuint' ? function(time) {
        if (time < 0.5) {
          return 16 * time * time * time * time * time;
        } else {
          return 1 + 16 * (--time) * time * time * time * time;
        }
      } : function(time) {
        return time;
      };
      this.scroll = this.scroll.bind(this);
      this.toggle.addEventListener('click', this.scroll);
    }

    SmoothScroll.prototype._extend = function() {
      var i, len, master, object, results;
      if (arguments.length > 1) {
        master = arguments[0];
        results = [];
        for (i = 0, len = arguments.length; i < len; i++) {
          object = arguments[i];
          results.push((function(object) {
            var key, results1;
            results1 = [];
            for (key in object) {
              results1.push(master[key] = object[key]);
            }
            return results1;
          })(object));
        }
        return results;
      }
    };

    SmoothScroll.prototype._data = function(element, name) {
      return this._deserialize(element.getAttribute('data-' + name));
    };

    SmoothScroll.prototype._deserialize = function(value) {
      if (value === "true") {
        return true;
      } else if (value === "false") {
        return false;
      } else if (value === "null") {
        return null;
      } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
        return parseFloat(value);
      } else {
        return value;
      }
    };

    SmoothScroll.prototype.getHeight = function(elem) {
      return Math.max(elem.scrollHeight, elem.offsetHeight, elem.clientHeight);
    };

    SmoothScroll.prototype.getDocumentHeight = function() {
      return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
    };

    SmoothScroll.prototype.getEndLocation = function() {
      var anchor, location;
      location = 0;
      if (this.anchorElement.offsetParent) {
        anchor = this.anchorElement;
        while (true) {
          location += anchor.offsetTop;
          anchor = anchor.offsetParent;
          if (!anchor) {
            break;
          }
        }
        location = location - this.offset;
        if (location >= 0) {
          return location;
        } else {
          return 0;
        }
      }
    };

    SmoothScroll.prototype.updateUrl = function() {
      if (history.pushState && (this.updateURL || this.updateURL === 'true')) {
        return history.pushState(null, null, [window.location.protocol, '//', window.location.host, window.location.pathname, window.location.search, '#', this.anchor].join(''));
      }
    };

    SmoothScroll.prototype.scroll = function(event) {
      var animationInterval, distance, loopAnimateScroll, self, startAnimateScroll, startLocation, stopAnimateScroll, timeLapsed;
      event.preventDefault();
      self = this;
      startLocation = window.pageYOffset;
      distance = self.endLocation - startLocation;
      timeLapsed = 0;
      animationInterval = null;
      self.updateUrl();
      stopAnimateScroll = function(position, endLocation, animationInterval) {
        var currentLocation;
        currentLocation = window.pageYOffset;
        if (position === endLocation || currentLocation === endLocation || ((window.innerHeight + currentLocation) >= self.documentHeight)) {
          clearInterval(animationInterval);
          self.anchorElement.focus();
          return self.callbackAfter(self.toggle, self.anchor);
        }
      };
      loopAnimateScroll = function() {
        var percentage, position;
        timeLapsed += 16;
        percentage = timeLapsed / self.duration;
        percentage = percentage > 1 ? 1 : percentage;
        position = startLocation + (distance * self.easingPattern(percentage));
        window.scrollTo(0, Math.floor(position));
        return stopAnimateScroll(position, self.endLocation, animationInterval);
      };
      startAnimateScroll = function() {
        self.callbackBefore(self.toggle, self.anchor);
        return animationInterval = setInterval(loopAnimateScroll, 16);

        /*
        		 * Reset position to fix weird iOS bug
        		 * @link https://github.com/cferdinandi/smooth-scroll/issues/45
         */
      };
      if (window.pageYOffset === 0) {
        window.scrollTo(0, 0);
      }
      return startAnimateScroll();
    };

    SmoothScroll.prototype.eventHandler = function(event) {
      return this.scroll();
    };

    return SmoothScroll;

  })();
  return window[NAME] = SmoothScroll;
})(window, document);
