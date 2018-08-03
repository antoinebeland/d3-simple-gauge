/**
 * The code is based on this example (https://codepen.io/anon/pen/WKyXgr)
 * on CodePen and on this tutorial (https://jaketrent.com/post/rotate-gauge-needle-in-d3/).
 *
 * I refactored the code of the example to make it works with D3.js v5, and I restructured
 * the code to make it more flexible.
 *
 * Thanks to the original author for its work.
 */

const SimpleGauge = (() => {
  // TODO: Put constants here.

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
     * @param el        The parent element of the needle.
     * @param length    The length of the needle.
     * @param radius    The radius of the needle.
     */
    constructor(el, length, radius) {
      if (!el) {
        throw new Error('The element must be valid.');
      }
      this._el = el;
      this._length = length;
      this._radius = radius;
      this._initialize();
    }

    /**
     * Updates the needle position based on the percentage specified.
     *
     * @param percentage      The percentage to use.
     */
    update(percentage) {
      const self = this;
      this._el.transition()
        .delay(500)
        .ease(d3.easeElastic)
        .duration(3000)
        .selectAll('.needle')
        .tween('progress', function () {
          const elementThis = this;
          return function (percentOfPercent) {
            const progress = percentOfPercent * percentage;
            return d3.select(elementThis)
              .attr('d', self._getPath(progress));
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
        .attr('d', this._getPath(0));
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
  class SimpleGauge {
    /**
     * Initializes a new instance of the SimpleGauge class.
     *
     * @param config.el
     * @param config.width
     * @param config.height
     * @param config.sectionsCount
     * @param [config.barWidth]
     */
    constructor(config) {
      if (!config.el) {
        throw new Error('The element must be valid.');
      }
      if (isNaN(config.width) || config.width <= 0) {
        throw new RangeError('The width must be a positive number.');
      }
      if (isNaN(config.height) || config.height <= 0) {
        throw new RangeError('The height must be a positive number.');
      }
      if (isNaN(config.sectionsCount) || config.sectionsCount <= 0) {
        throw new RangeError('The sections count must be a positive number');
      }
      if (config.barWidth !== undefined && (isNaN(config.barWidth) || config.barWidth <= 0)) {
        throw new RangeError('The bar width must be a positive number');
      }
      this._el = config.el;
      this._width = config.width;
      this._height = config.height;
      this._sectionsCount = config.sectionsCount;
      this._barWidth = config.barWidth || 40;
      this._percent = 0;
      this._initialize();
    }

    /**
     * Gets the percent
     *
     * @returns {number|*}
     */
    get percent() {
      return this._percent;
    }

    set percent(percent) {
      if (isNaN(percent) || percent < 0 || percent > 1) {
        throw new RangeError('The percentage must be between 0 and 1.');
      }
      this._percent = percent;
      if (this._needle) {
        this._needle.update(this._percent);
      }
    }

    _initialize() {
      const sectionPercentage = 1 / this._sectionsCount / 2;
      const padRad = 0.05;
      const chartInset = 10;

      // start at 270deg
      let totalPercent = .75;
      const radius = Math.min(this._width, this._height) / 2;

      const chart = this._el.append('g')
        .attr('transform', `translate(${(this._width) / 2}, ${(this._height) / 2})`);

      // build gauge bg
      d3.range(1, this._sectionsCount + 1).forEach((d, sectionIndex) => {
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

        chart.append('path')
          .attr('class', `arc chart-color${sectionIndex}`)
          .attr('d', arc);
      });
      this._needle = new Needle(chart, this._height * 0.25, 15);
    }
  }

  return SimpleGauge;
})();
