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
     * @param config.color                The color to use for the needle.
     * @param config.easeType             The ease type to use for the needle animation.
     * @param config.el                   The parent element of the needle.
     * @param config.length               The length of the needle.
     * @param config.percent              The initial percentage to use.
     * @param config.radius               The radius of the needle.
     */
    function Needle(config) {
      _classCallCheck(this, Needle);

      this._animationDelay = config.animationDelay;
      this._animationDuration = config.animationDuration;
      this._color = config.color;
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

        if (this._color) {
          this._el.select('.needle-center').style('fill', this._color);

          this._el.select('.needle').style('fill', this._color);
        }
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
     * @param [config.chartInset]           The char inset to use. By default, the value is 10.
     * @param [config.easeType]             The ease type to use for the needle animation. By default, the value is
     *                                      "d3.easeElastic".
     * @param config.el                     The D3 element to use to create the gauge (must be a group or an SVG element).
     * @param config.height                 The height of the gauge.
     * @param [config.interval]             The interval (min and max values) of the gauge. By default, the interval
     *                                      ia [0, 1].
     * @param [config.needleColor]          The needle color.
     * @param [config.needleRadius]         The radius of the needle. By default, the radius is 15.
     * @param [config.percent]              The percentage to use for the needle position. By default, the value is 0.
     * @param config.sectionsCount          The number of sections in the gauge.
     * @param [config.sectionsColors]       The color to use for each section.
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
        throw new RangeError('The sections count must be a positive number.');
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
        throw new RangeError('The bar width must be a positive number.');
      }
      if (config.chartInset !== undefined && (isNaN(config.chartInset) || config.chartInset < 0)) {
        throw new RangeError('The chart inset must be greater or equal to 0.');
      }
      if (config.needleRadius !== undefined && (isNaN(config.needleRadius) || config.needleRadius < 0)) {
        throw new RangeError('The needle radius must be greater or equal to 0.');
      }
      if (config.sectionsColors !== undefined && config.sectionsColors.length !== config.sectionsCount) {
        throw new RangeError('The sectionsColors length must match with the sectionsCount.');
      }

      this._animationDelay = config.animationDelay !== undefined ? config.animationDelay : CONSTANTS.NEEDLE_ANIMATION_DELAY;

      this._animationDuration = config.animationDuration !== undefined ? config.animationDuration : CONSTANTS.NEEDLE_ANIMATION_DURATION;

      this._chartInset = config.chartInset !== undefined ? config.chartInset : CONSTANTS.CHAR_INSET;

      this._barWidth = config.barWidth || CONSTANTS.BAR_WIDTH;
      this._easeType = config.easeType || CONSTANTS.EASE_TYPE;
      this._el = config.el;
      this._height = config.height;
      this._needleRadius = config.needleRadius !== undefined ? config.needleRadius : CONSTANTS.NEEDLE_RADIUS;
      this._sectionsCount = config.sectionsCount;
      this._width = config.width;
      this._sectionsColors = config.sectionsColors;
      this._needleColor = config.needleColor;

      this.interval = config.interval || [0, 1];
      this.percent = config.percent !== undefined ? config.percent : 0;

      this._initialize();
    }

    /**
     * Gets the interval of the gauge.
     *
     * @returns {Array}   An array of two elements that represents the min and the max values of the gauge.
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

        var totalPercent = 0.75; // Start at 270deg
        var radius = Math.min(this._width, this._height * 2) / 2;

        this._chart = this._el.append('g').attr('transform', 'translate(' + this._width / 2 + ', ' + this._height + ')');

        this._arcs = this._chart.selectAll('.arc').data(d3.range(1, this._sectionsCount + 1)).enter().append('path').attr('class', function (sectionIndex) {
          return 'arc chart-color' + sectionIndex;
        }).attr('d', function (sectionIndex) {
          var arcStartRad = percToRad(totalPercent);
          var arcEndRad = arcStartRad + percToRad(sectionPercentage);
          totalPercent += sectionPercentage;

          var startPadRad = sectionIndex === 0 ? 0 : padRad / 2;
          var endPadRad = sectionIndex === _this._sectionsCount ? 0 : padRad / 2;
          var arc = d3.arc().outerRadius(radius - _this._chartInset).innerRadius(radius - _this._chartInset - _this._barWidth).startAngle(arcStartRad + startPadRad).endAngle(arcEndRad - endPadRad);

          return arc(_this);
        });

        if (this._sectionsColors) {
          this._arcs.style('fill', function (sectionIndex) {
            return _this._sectionsColors[sectionIndex - 1];
          });
        }

        this._needle = new Needle({
          animationDelay: this._animationDelay,
          animationDuration: this._animationDuration,
          easeType: this._easeType,
          el: this._chart,
          length: this._height * 0.5,
          percent: this._percent,
          radius: this._needleRadius,
          color: this._needleColor
        });
        this._update();
      }

      /**
       * Updates the active arc and the gauge status (min or max) based on the current percent.
       *
       * @private
       */

    }, {
      key: '_update',
      value: function _update() {
        var _this2 = this;

        if (!this._arcs) {
          return;
        }
        this._arcs.classed('active', function (d, i) {
          return i === Math.floor(_this2._percent * _this2._sectionsCount) || i === _this2._arcs.size() - 1 && _this2._percent === 1;
        });
        this._chart.classed('min', this._percent === 0);
        this._chart.classed('max', this._percent === 1);
      }
    }, {
      key: 'interval',
      get: function get() {
        return this._scale.domain();
      }

      /**
       * Sets the interval of the gauge (min and max values).
       *
       * @param interval
       */
      ,
      set: function set(interval) {
        if (!(interval instanceof Array) || interval.length !== 2 || isNaN(interval[0]) || isNaN(interval[1]) || interval[0] > interval[1]) {
          throw new Error('The interval specified is invalid.');
        }
        this._scale = d3.scaleLinear().domain(interval).range([0, 1]).clamp(true);
      }

      /**
       * Gets the needle percent.
       *
       * @returns {number|*}    The percentage position of the needle.
       */

    }, {
      key: 'percent',
      get: function get() {
        return this._percent;
      }

      /**
       * Sets the needle percent. The percent must be between 0 and 1.
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
        this._update();
      }

      /**
       * Sets the needle position based on the specified value inside the interval.
       * If the value specified is outside the interval, the value will be
       * clamped to fit inside the domain.
       *
       * @param value           The value to use to set the needle position.
       */

    }, {
      key: 'value',
      set: function set(value) {
        if (isNaN(value)) {
          throw new Error('The specified value must be a number.');
        }
        this.percent = this._scale(value);
      }
    }]);

    return SimpleGauge;
  }();
});