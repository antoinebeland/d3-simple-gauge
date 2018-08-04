(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'd3'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('d3'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.d3);
    global.d3SimpleGauge = mod.exports;
  }
})(this, function (exports, _d) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SimpleGauge = undefined;

  var d3 = _interopRequireWildcard(_d);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var CONSTANTS = {
    CHAR_INSET: 10,
    BAR_WIDTH: 40,
    EASE_TYPE: d3.easeElastic,
    NEEDLE_ANIMATION_DELAY: 0,
    NEEDLE_ANIMATION_DURATION: 3000,
    NEEDLE_RADIUS: 15,
    PAD_RAD: 0.05
  };

  var percToDeg = function percToDeg(perc) {
    return perc * 360;
  };
  var degToRad = function degToRad(deg) {
    return deg * Math.PI / 180;
  };
  var percToRad = function percToRad(perc) {
    return degToRad(percToDeg(perc));
  };

  /**
   * Defines the needle used in the gauge.
   */

  var Needle = function () {
    /**
     * Initializes a new instance of the Needle class.
     *
     * @param config                      The configuration to use to initialize the needle.
     * @param config.animationDelay       The delay in ms before to start the needle animation.
     * @param config.animationDuration    The duration in ms of the needle animation.
     * @param config.easeType             The ease type to use for the needle animation.
     * @param config.el                   The parent element of the needle.
     * @param config.length               The length of the needle.
     * @param config.percent              The initial percentage to use.
     * @param config.radius               The radius of the needle.
     */
    function Needle(config) {
      _classCallCheck(this, Needle);

      if (!config.el) {
        throw new Error('The element must be valid.');
      }
      this._animationDelay = config.animationDelay;
      this._animationDuration = config.animationDuration;
      this._easeType = config.easeType;
      this._el = config.el;
      this._length = config.length;
      this._percent = config.percent;
      this._radius = config.radius;
      this._initialize();
    }

    /**
     * Updates the needle position based on the percentage specified.
     *
     * @param percent      The percentage to use.
     */


    _createClass(Needle, [{
      key: 'update',
      value: function update(percent) {
        var self = this;
        this._el.transition().delay(this._animationDelay).ease(this._easeType).duration(this._animationDuration).selectAll('.needle').tween('progress', function () {
          var thisElement = this;
          var delta = percent - self._percent;
          var initialPercent = self._percent;
          return function (progressPercent) {
            self._percent = initialPercent + progressPercent * delta;
            return d3.select(thisElement).attr('d', self._getPath(self._percent));
          };
        });
      }
    }, {
      key: '_initialize',
      value: function _initialize() {
        this._el.append('circle').attr('class', 'needle-center').attr('cx', 0).attr('cy', 0).attr('r', this._radius);

        this._el.append('path').attr('class', 'needle').attr('d', this._getPath(this._percent));
      }
    }, {
      key: '_getPath',
      value: function _getPath(percent) {
        var halfPI = Math.PI / 2;
        var thetaRad = percToRad(percent / 2); // half circle

        var centerX = 0;
        var centerY = 0;

        var topX = centerX - this._length * Math.cos(thetaRad);
        var topY = centerY - this._length * Math.sin(thetaRad);

        var leftX = centerX - this._radius * Math.cos(thetaRad - halfPI);
        var leftY = centerY - this._radius * Math.sin(thetaRad - halfPI);

        var rightX = centerX - this._radius * Math.cos(thetaRad + halfPI);
        var rightY = centerY - this._radius * Math.sin(thetaRad + halfPI);

        return 'M ' + leftX + ' ' + leftY + ' L ' + topX + ' ' + topY + ' L ' + rightX + ' ' + rightY;
      }
    }]);

    return Needle;
  }();

  var SimpleGauge = exports.SimpleGauge = function () {
    /**
     * Initializes a new instance of the SimpleGauge class.
     *
     * @param config                        The configuration to use to initialize the gauge.
     * @param [config.animationDelay]       The delay in ms before to start the needle animation. By default, the value
     *                                      is 0.
     * @param [config.animationDuration]    The duration in ms of the needle animation. By default, the value is 3000.
     * @param [config.barWidth]             The bar width of the gauge. By default, the value is 40.
     * @param [config.easeType]             The ease type to use for the needle animation. By default, the value is
     *                                      "d3.easeElastic".
     * @param config.el                     The D3 element to use to create the gauge (must be a group or a SVG element).
     * @param config.height                 The height of the gauge.
     * @param [config.percent]              The percentage to use for the needle position. By default, the value is 0.
     * @param config.sectionsCount          The number of sections in the gauge.
     * @param config.width                  The width of the gauge.
     */
    function SimpleGauge(config) {
      _classCallCheck(this, SimpleGauge);

      if (!config.el) {
        throw new Error('The element must be valid.');
      }
      if (isNaN(config.height) || config.height <= 0) {
        throw new RangeError('The height must be a positive number.');
      }
      if (isNaN(config.sectionsCount) || config.sectionsCount <= 0) {
        throw new RangeError('The sections count must be a positive number');
      }
      if (isNaN(config.width) || config.width <= 0) {
        throw new RangeError('The width must be a positive number.');
      }
      if (config.animationDelay !== undefined && (isNaN(config.animationDelay) || config.animationDelay < 0)) {
        throw new RangeError('The transition delay must be greater or equal to 0.');
      }
      if (config.animationDuration !== undefined && (isNaN(config.animationDuration) || config.animationDuration < 0)) {
        throw new RangeError('The transition duration must be greater or equal to 0.');
      }
      if (config.barWidth !== undefined && (isNaN(config.barWidth) || config.barWidth <= 0)) {
        throw new RangeError('The bar width must be a positive number');
      }
      this._animationDelay = config.animationDelay || CONSTANTS.NEEDLE_ANIMATION_DELAY;
      this._animationDuration = config.animationDuration || CONSTANTS.NEEDLE_ANIMATION_DURATION;
      this._barWidth = config.barWidth || CONSTANTS.BAR_WIDTH;
      this._easeType = config.easeType || CONSTANTS.EASE_TYPE;
      this._el = config.el;
      this._height = config.height;
      this._sectionsCount = config.sectionsCount;
      this._width = config.width;
      this.percent = config.percent !== undefined ? config.percent : 0;
      this._initialize();
    }

    /**
     * Gets the needle percent.
     *
     * @returns {number|*}    The percentage position of the needle.
     */


    _createClass(SimpleGauge, [{
      key: '_initialize',


      /**
       * Initializes the simple gauge.
       *
       * @private
       */
      value: function _initialize() {
        var _this = this;

        var sectionPercentage = 1 / this._sectionsCount / 2;
        var padRad = CONSTANTS.PAD_RAD;
        var chartInset = CONSTANTS.CHAR_INSET;

        var totalPercent = 0.75; // start at 270deg
        var radius = Math.min(this._width, this._height * 2) / 2;

        var chart = this._el.append('g').attr('transform', 'translate(' + this._width / 2 + ', ' + this._height + ')');

        chart.selectAll('.arc').data(d3.range(1, this._sectionsCount + 1)).enter().append('path').attr('class', function (sectionIndex) {
          return 'arc chart-color' + sectionIndex;
        }).attr('d', function (sectionIndex) {
          var arcStartRad = percToRad(totalPercent);
          var arcEndRad = arcStartRad + percToRad(sectionPercentage);
          totalPercent += sectionPercentage;

          var startPadRad = sectionIndex === 0 ? 0 : padRad / 2;
          var endPadRad = sectionIndex === _this._sectionsCount ? 0 : padRad / 2;
          var arc = d3.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - _this._barWidth).startAngle(arcStartRad + startPadRad).endAngle(arcEndRad - endPadRad);

          return arc(_this);
        });
        this._needle = new Needle({
          animationDelay: this._animationDelay,
          animationDuration: this._animationDuration,
          easeType: this._easeType,
          el: chart,
          length: this._height * 0.5,
          percent: this._percent,
          radius: CONSTANTS.NEEDLE_RADIUS
        });
      }
    }, {
      key: 'percent',
      get: function get() {
        return this._percent;
      }

      /**
       * Sets the needle percent.
       *
       * @param percent         The percentage to set.
       */
      ,
      set: function set(percent) {
        if (isNaN(percent) || percent < 0 || percent > 1) {
          throw new RangeError('The percentage must be between 0 and 1.');
        }
        if (this._needle) {
          this._needle.update(percent);
        }
        this._percent = percent;
      }
    }]);

    return SimpleGauge;
  }();
});