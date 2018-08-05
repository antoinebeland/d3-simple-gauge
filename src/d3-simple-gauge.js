/**
 * The code is based on this example (https://codepen.io/anon/pen/WKyXgr)
 * on CodePen and on this tutorial (https://jaketrent.com/post/rotate-gauge-needle-in-d3/).
 *
 * I refactored the code of the example to make it work with D3.js v5, and I restructured
 * the code to make it more flexible.
 *
 * Thanks to the original author for its work.
 */

import * as d3 from 'd3';

const CONSTANTS = {
  CHAR_INSET: 10,
  BAR_WIDTH: 40,
  EASE_TYPE: d3.easeElastic,
  NEEDLE_ANIMATION_DELAY: 0,
  NEEDLE_ANIMATION_DURATION: 3000,
  NEEDLE_RADIUS: 15,
  PAD_RAD: 0.05
};

const percToDeg = perc => perc * 360;
const degToRad = deg => (deg * Math.PI) / 180;
const percToRad = perc => degToRad(percToDeg(perc));

/**
 * Defines the needle used in the gauge.
 */
class Needle {
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
  constructor(config) {
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
  update(percent) {
    const self = this;
    this._el.transition()
      .delay(this._animationDelay)
      .ease(this._easeType)
      .duration(this._animationDuration)
      .selectAll('.needle')
      .tween('progress', function () {
        const thisElement = this;
        const delta = percent - self._percent;
        const initialPercent = self._percent;
        return function (progressPercent) {
          self._percent = initialPercent + progressPercent * delta;
          return d3.select(thisElement)
            .attr('d', self._getPath(self._percent));
        }
      });
  }

  /**
   * Initializes the needle.
   *
   * @private
   */
  _initialize() {
    this._el.append('circle')
      .attr('class', 'needle-center')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', this._radius);

    this._el.append('path')
      .attr('class', 'needle')
      .attr('d', this._getPath(this._percent));
  }

  /**
   * Gets the needle path based on the percent specified.
   *
   * @param percent       The percentage to use to create the path.
   * @returns {string}    A string associated with the path.
   * @private
   */
  _getPath(percent) {
    const halfPI = Math.PI / 2;
    const thetaRad = percToRad(percent / 2); // half circle

    const centerX = 0;
    const centerY = 0;

    const topX = centerX - (this._length * Math.cos(thetaRad));
    const topY = centerY - (this._length * Math.sin(thetaRad));

    const leftX = centerX - (this._radius * Math.cos(thetaRad - halfPI));
    const leftY = centerY - (this._radius * Math.sin(thetaRad - halfPI));

    const rightX = centerX - (this._radius * Math.cos(thetaRad + halfPI));
    const rightY = centerY - (this._radius * Math.sin(thetaRad + halfPI));

    return `M ${leftX} ${leftY} L ${topX} ${topY} L ${rightX} ${rightY}`;
  }
}

/**
 * Defines a simple gauge.
 */
export class SimpleGauge {
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
   * @param [config.interval]             The interval (min and max values) of the gauge. By default, the interval
   *                                      ia [0, 1].
   * @param [config.needleRadius]         The radius of the needle. By the default, the radius is 15.
   * @param [config.percent]              The percentage to use for the needle position. By default, the value is 0.
   * @param config.sectionsCount          The number of sections in the gauge.
   * @param config.width                  The width of the gauge.
   */
  constructor(config) {
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
    if (config.animationDelay !== undefined && (isNaN(config.animationDelay)
      || config.animationDelay < 0)) {
      throw new RangeError('The transition delay must be greater or equal to 0.');
    }
    if (config.animationDuration !== undefined && (isNaN(config.animationDuration)
      || config.animationDuration < 0)) {
      throw new RangeError('The transition duration must be greater or equal to 0.');
    }
    if (config.barWidth !== undefined && (isNaN(config.barWidth) || config.barWidth <= 0)) {
      throw new RangeError('The bar width must be a positive number');
    }
    if (config.needleRadius !== undefined && (isNaN(config.needleRadius) || config.needleRadius < 0)) {
      throw new RangeError('The needle radius must be greater or equal to 0.');
    }
    this._animationDelay = config.animationDelay || CONSTANTS.NEEDLE_ANIMATION_DELAY;
    this._animationDuration = config.animationDuration || CONSTANTS.NEEDLE_ANIMATION_DURATION;
    this._barWidth = config.barWidth || CONSTANTS.BAR_WIDTH;
    this._easeType = config.easeType || CONSTANTS.EASE_TYPE;
    this._el = config.el;
    this._height = config.height;
    this._needleRadius = config.needleRadius || CONSTANTS.NEEDLE_RADIUS;
    this._sectionsCount = config.sectionsCount;
    this._width = config.width;
    this.interval = config.interval || [0, 1];
    this.percent = (config.percent !== undefined) ? config.percent : 0;
    this._initialize();
  }

  /**
   * Gets the interval of the gauge.
   *
   * @returns {Array}   An array of two elements that represents the min and the max values of the gauge.
   */
  get interval() {
    return this._scale.domain();
  }

  /**
   * Sets the interval of the gauge (min and max values).
   *
   * @param interval
   */
  set interval(interval) {
    if (!(interval instanceof Array) || interval.length !== 2 ||
      isNaN(interval[0]) ||isNaN(interval[1]) || interval[0] > interval[1]) {
      throw new Error('The interval specified is invalid.');
    }
    this._scale = d3.scaleLinear()
      .domain(interval)
      .range([0, 1])
      .clamp(true);
  }

  /**
   * Gets the needle percent.
   *
   * @returns {number|*}    The percentage position of the needle.
   */
  get percent() {
    return this._percent;
  }

  /**
   * Sets the needle percent. The percent must be between 0 and 1.
   *
   * @param percent         The percentage to set.
   */
  set percent(percent) {
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
   * Sets the needle position based on a value inside the interval.
   * If the value specified is outside the interval, the value will be
   * clamped to fit inside the domain.
   *
   * @param value           The value to use to set the needle position.
   */
  set value(value) {
    if (isNaN(value)) {
      throw new Error('The specified value must be a number');
    }
    this.percent = this._scale(value);
  }

  /**
   * Initializes the simple gauge.
   *
   * @private
   */
  _initialize() {
    const sectionPercentage = 1 / this._sectionsCount / 2;
    const padRad = CONSTANTS.PAD_RAD;
    const chartInset = CONSTANTS.CHAR_INSET;

    let totalPercent = 0.75; // Start at 270deg
    const radius = Math.min(this._width, this._height * 2) / 2;

    this._chart = this._el.append('g')
      .attr('transform', `translate(${this._width / 2}, ${this._height})`);

    this._arcs = this._chart.selectAll('.arc')
      .data(d3.range(1, this._sectionsCount + 1))
      .enter()
      .append('path')
      .attr('class', sectionIndex => `arc chart-color${sectionIndex}`)
      .attr('d', sectionIndex => {
        const arcStartRad = percToRad(totalPercent);
        const arcEndRad = arcStartRad + percToRad(sectionPercentage);
        totalPercent += sectionPercentage;

        const startPadRad = sectionIndex === 0 ? 0 : padRad / 2;
        const endPadRad = sectionIndex === this._sectionsCount ? 0 : padRad / 2;
        const arc = d3.arc()
          .outerRadius(radius - chartInset)
          .innerRadius(radius - chartInset - this._barWidth)
          .startAngle(arcStartRad + startPadRad)
          .endAngle(arcEndRad - endPadRad);

        return arc(this);
      });
    this._needle = new Needle({
      animationDelay: this._animationDelay,
      animationDuration: this._animationDuration,
      easeType: this._easeType,
      el: this._chart,
      length: this._height * 0.5,
      percent: this._percent,
      radius: this._needleRadius
    });
    this._update();
  }

  /**
   * Updates the active arc and the gauge status (min or max) based on the current percent.
   *
   * @private
   */
  _update() {
    if (!this._arcs) {
      return;
    }
    this._arcs.classed('active', (d, i) => i === Math.floor(this._percent * this._sectionsCount));
    this._chart.classed('min', this._percent === 0);
    this._chart.classed('max', this._percent === 1);
  }
}
