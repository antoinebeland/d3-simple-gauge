require('should');
const chai = require("chai");
const d3 = require("d3");
const expect = chai.expect;
const jsdom = require("jsdom");
const rn = require('random-number');
const SimpleGauge = require('../dist/d3-simple-gauge').SimpleGauge;

// Tests for the SimpleGauge class
describe('SimpleGauge', () => {

  // Tests for the constructor
  describe('#constructor()', () => {
    it('should initialize the gauge correctly', () => {
      const rootElement = getRootElement();
      const config = {
        el: rootElement,
        height: getPositiveNumber(),
        sectionsCount: getSmallPositiveNumber(),
        width: getPositiveNumber()
      };
      const simpleGauge = new SimpleGauge(config);

      simpleGauge._height.should.be.equal(config.height);
      simpleGauge._sectionsCount.should.be.equal(config.sectionsCount);
      simpleGauge._width.should.be.equal(config.width);

      simpleGauge._animationDelay.should.be.equal(0);
      simpleGauge._animationDuration.should.be.equal(3000);
      simpleGauge._barWidth.should.be.equal(40);
      simpleGauge._easeType.should.be.equal(d3.easeElastic);
      simpleGauge._needleRadius.should.be.equal(15);
      expect(simpleGauge._sectionsColors).to.be.undefined;
      expect(simpleGauge._needleColor).to.be.undefined;

      expect(simpleGauge.interval).to.eql([0, 1]);
      simpleGauge.percent.should.be.equal(0);

      rootElement.selectAll('.arc').size().should.be.equal(config.sectionsCount);
    });

    it('should initialize the gauge correctly when a valid animation delay is specified', () => {
      const config = {
        el: getRootElement(),
        height: getPositiveNumber(),
        sectionsCount: getSmallPositiveNumber(),
        width: getPositiveNumber(),
        animationDelay: getPositiveNumber()
      };
      let simpleGauge = new SimpleGauge(config);
      simpleGauge._animationDelay.should.be.equal(config.animationDelay);

      config.animationDelay = 0;
      simpleGauge = new SimpleGauge(config);
      simpleGauge._animationDelay.should.be.equal(config.animationDelay);
    });

    it('should initialize the gauge correctly when a valid animation duration is specified', () => {
      const config = {
        el:  getRootElement(),
        height: getPositiveNumber(),
        sectionsCount: getSmallPositiveNumber(),
        width: getPositiveNumber(),
        animationDuration: getPositiveNumber()
      };
      let simpleGauge = new SimpleGauge(config);
      simpleGauge._animationDuration.should.be.equal(config.animationDuration);

      config.animationDuration = 0;
      simpleGauge = new SimpleGauge(config);
      simpleGauge._animationDuration.should.be.equal(config.animationDuration);
    });

    it('should initialize the gauge correctly when a valid bar width is specified', () => {
      const config = {
        el: getRootElement(),
        height: getPositiveNumber(),
        sectionsCount: getSmallPositiveNumber(),
        width: getPositiveNumber(),
        barWidth: getPositiveNumber()
      };
      const simpleGauge = new SimpleGauge(config);
      simpleGauge._barWidth.should.be.equal(config.barWidth);
    });

    it('should initialize the gauge correctly when a valid chart inset is specified', () => {
      const config = {
        el:  getRootElement(),
        height: getPositiveNumber(),
        sectionsCount: getSmallPositiveNumber(),
        width: getPositiveNumber(),
        animationDuration: getPositiveNumber(),
      };
      config.chartInset = config.width * 0.1;

      let simpleGauge = new SimpleGauge(config);
      simpleGauge._chartInset.should.be.equal(config.chartInset);
    });

    it('should initialize the gauge correctly when a valid ease type is specified', () => {
      const config = {
        el: getRootElement(),
        height: getPositiveNumber(),
        sectionsCount: getSmallPositiveNumber(),
        width: getPositiveNumber(),
        easeType: d3.easeLinear
      };
      const simpleGauge = new SimpleGauge(config);
      simpleGauge._easeType.should.be.equal(config.easeType);
    });

    it('should initialize the gauge correctly when a valid interval is specified', () => {
      const config = {
        el: getRootElement(),
        height: getPositiveNumber(),
        sectionsCount: getSmallPositiveNumber(),
        width: getPositiveNumber(),
        interval: [0, getPositiveNumber()]
      };
      const simpleGauge = new SimpleGauge(config);
      expect(simpleGauge.interval).to.eql(config.interval)
    });

    it('should initialize the gauge correctly when a valid needle color is specified', () => {
      const rootElement = getRootElement();
      const config = {
        el: rootElement,
        height: getPositiveNumber(),
        sectionsCount: getSmallPositiveNumber(),
        width: getPositiveNumber(),
        needleColor: '#f00'
      };
      const simpleGauge = new SimpleGauge(config);
      simpleGauge._needleColor.should.be.equal(config.needleColor);

      rootElement.select('.needle').style('fill').should.be.equal(config.needleColor);
      rootElement.select('.needle-center').style('fill').should.be.equal(config.needleColor);
    });

    it('should initialize the gauge correctly when a valid needle radius is specified', () => {
      const config = {
        el: getRootElement(),
        height: getPositiveNumber(),
        sectionsCount: getSmallPositiveNumber(),
        width: getPositiveNumber(),
        needleRadius: getPositiveOrZeroNumber()
      };
      const simpleGauge = new SimpleGauge(config);
      simpleGauge._needleRadius.should.be.equal(config.needleRadius);
    });

    it('should initialize the gauge correctly when a valid percentage is specified', () => {
      const config = {
        el: getRootElement(),
        height: getPositiveNumber(),
        sectionsCount: getSmallPositiveNumber(),
        width: getPositiveNumber(),
        percent: Math.random()
      };
      const simpleGauge = new SimpleGauge(config);
      simpleGauge.percent.should.be.equal(config.percent);
    });

    it('should initialize the gauge correctly when a valid colors for the groups are specified', () => {
      const rootElement = getRootElement();
      const config = {
        el: rootElement,
        height: getPositiveNumber(),
        sectionsCount: 3,
        width: getPositiveNumber(),
        sectionsColors: [
          '#f00',
          '#0f0',
          '#00f'
        ]
      };
      const simpleGauge = new SimpleGauge(config);
      expect(simpleGauge._sectionsColors).to.eql(config.sectionsColors);

      rootElement.selectAll('.arc')
        .each(function(d, i) {
          d3.select(this).style('fill').should.be.equal(config.sectionsColors[i])
        });
    });

    it('should throw an exception when the root element is invalid', () => {
      const config = {
        el: null,
        height: getPositiveNumber(),
        sectionsCount: getSmallPositiveNumber(),
        width: getPositiveNumber()
      };
      expect(() => new SimpleGauge(config)).to.throw(Error, 'The element must be valid.');
    });

    it('should throw an exception when the height specified is invalid', () => {
      const config = {
        el: getRootElement(),
        height: 'invalid',
        sectionsCount: getSmallPositiveNumber(),
        width: getPositiveNumber()
      };
      expect(() => new SimpleGauge(config)).to.throw(RangeError, 'The height must be a positive number.');

      config.height = getNegativeOrZeroNumber();
      expect(() => new SimpleGauge(config)).to.throw(RangeError, 'The height must be a positive number.');
    });

    it('should throw an exception when the sections count specified is invalid', () => {
      const config = {
        el: getRootElement(),
        height: getPositiveNumber(),
        sectionsCount: 'invalid',
        width: getPositiveNumber()
      };
      expect(() => new SimpleGauge(config)).to.throw(RangeError, 'The sections count must be a positive number.');

      config.sectionsCount = getNegativeOrZeroNumber();
      expect(() => new SimpleGauge(config)).to.throw(RangeError, 'The sections count must be a positive number.');
    });

    it('should throw an exception when the width specified is invalid', () => {
      const config = {
        el: getRootElement(),
        height: getPositiveNumber(),
        sectionsCount: getSmallPositiveNumber(),
        width: 'invalid'
      };
      expect(() => new SimpleGauge(config)).to.throw(RangeError, 'The width must be a positive number.');

      config.width = getNegativeOrZeroNumber();
      expect(() => new SimpleGauge(config)).to.throw(RangeError, 'The width must be a positive number.');
    });

    it('should throw an exception when the animation delay specified is invalid', () => {
      const config = {
        el: getRootElement(),
        height: getPositiveNumber(),
        sectionsCount: getSmallPositiveNumber(),
        width: getPositiveNumber(),
        animationDelay: 'invalid'
      };
      expect(() => new SimpleGauge(config)).to.throw(RangeError,
        'The transition delay must be greater or equal to 0.');

      config.animationDelay = getNegativeNumber();
      expect(() => new SimpleGauge(config)).to.throw(RangeError,
        'The transition delay must be greater or equal to 0.');
    });

    it('should throw an exception when the animation duration specified is invalid', () => {
      const config = {
        el: getRootElement(),
        height: getPositiveNumber(),
        sectionsCount: getSmallPositiveNumber(),
        width: getPositiveNumber(),
        animationDuration: 'invalid'
      };
      expect(() => new SimpleGauge(config)).to.throw(RangeError,
        'The transition duration must be greater or equal to 0.');

      config.animationDuration = getNegativeNumber();
      expect(() => new SimpleGauge(config)).to.throw(RangeError,
        'The transition duration must be greater or equal to 0.');
    });

    it('should throw an exception when the bar width specified is invalid', () => {
      const config = {
        el: getRootElement(),
        height: getPositiveNumber(),
        sectionsCount: getSmallPositiveNumber(),
        width: getPositiveNumber(),
        barWidth: 'invalid'
      };
      expect(() => new SimpleGauge(config)).to.throw(RangeError, 'The bar width must be a positive number.');

      config.barWidth = getNegativeOrZeroNumber();
      expect(() => new SimpleGauge(config)).to.throw(RangeError, 'The bar width must be a positive number.');
    });

    it('should throw an exception when the chart inset specified is invalid', () => {
      const config = {
        el: getRootElement(),
        height: getPositiveNumber(),
        sectionsCount: getSmallPositiveNumber(),
        width: getPositiveNumber(),
        chartInset: 'invalid'
      };
      expect(() => new SimpleGauge(config)).to.throw(RangeError, 'The chart inset must be greater or equal to 0.');

      config.chartInset = getNegativeNumber();
      expect(() => new SimpleGauge(config)).to.throw(RangeError, 'The chart inset must be greater or equal to 0.');
    });

    it('should throw an exception when the needle radius specified is invalid', () => {
      const config = {
        el: getRootElement(),
        height: getPositiveNumber(),
        sectionsCount: getSmallPositiveNumber(),
        width: getPositiveNumber(),
        needleRadius: 'invalid'
      };
      expect(() => new SimpleGauge(config)).to.throw(RangeError, 'The needle radius must be greater or equal to 0.');

      config.needleRadius = getNegativeNumber();
      expect(() => new SimpleGauge(config)).to.throw(RangeError, 'The needle radius must be greater or equal to 0.');
    });

    it('should throw an exception when the sections colors length is not equal to sections count', () => {
      const config = {
        el: getRootElement(),
        height: getPositiveNumber(),
        sectionsCount: 3,
        width: getPositiveNumber(),
        sectionsColors: [
          'yellow',
          'red'
        ]
      };
      expect(() => new SimpleGauge(config)).to.throw(RangeError,
        'The sectionsColors length must match with the sectionsCount.');
    });

  });

  // Tests for 'interval' property
  describe('#interval', () => {
    it('should set the interval specified if it is valid', () => {
      const config = {
        el: getRootElement(),
        height: getPositiveNumber(),
        sectionsCount: getSmallPositiveNumber(),
        width: getPositiveNumber()
      };
      const intervalToSet = [0, getPositiveNumber()];
      const simpleGauge = new SimpleGauge(config);
      simpleGauge.interval = intervalToSet;
      expect(simpleGauge.interval).to.eql(intervalToSet);
    });

    it('should throw an exception if the specified interval is invalid', () => {
      const config = {
        el: getRootElement(),
        height: getPositiveNumber(),
        sectionsCount: getSmallPositiveNumber(),
        width: getPositiveNumber()
      };
      const simpleGauge = new SimpleGauge(config);
      expect(() => simpleGauge.interval = 'invalid').to.throw(Error, 'The interval specified is invalid.');
      expect(() => simpleGauge.interval = [1, 2, 3]).to.throw(Error, 'The interval specified is invalid.');
      expect(() => simpleGauge.interval = ['a', 'b']).to.throw(Error, 'The interval specified is invalid.');
      expect(() => simpleGauge.interval = [0, -100]).to.throw(Error, 'The interval specified is invalid.');
      expect(() => simpleGauge.interval = [100, 50]).to.throw(Error, 'The interval specified is invalid.');
    });
  });

  // Tests for 'percent' property
  describe('#percent', () => {
    it('should set the percentage specified if it is valid', () => {
      const rootElement = getRootElement();
      const config = {
        el: rootElement,
        height: getPositiveNumber(),
        sectionsCount: 4,
        width: getPositiveNumber()
      };
      const simpleGauge = new SimpleGauge(config);
      const group = rootElement.select('g');

      function validateActiveClass(index) {
        rootElement.selectAll('.arc').each(function(d, i) {
          const currentClass = d3.select(this).attr('class');
          if (i === index) {
            expect(currentClass).to.include('active');
          } else {
            expect(currentClass).does.not.include('active');
          }
        });
      }

      // 0%
      simpleGauge.percent = 0;
      simpleGauge.percent.should.be.equal(0);
      validateActiveClass(0);
      expect(group.attr('class')).does.not.include('max');
      expect(group.attr('class')).to.include('min');

      // 25%
      simpleGauge.percent = 0.25;
      simpleGauge.percent.should.be.equal(0.25);
      validateActiveClass(1);
      expect(group.attr('class')).does.not.include(['min', 'max']);

      // 50%
      simpleGauge.percent = 0.5;
      simpleGauge.percent.should.be.equal(0.5);
      validateActiveClass(2);
      expect(group.attr('class')).does.not.include(['min', 'max']);

      // 75%
      simpleGauge.percent = 0.75;
      simpleGauge.percent.should.be.equal(0.75);
      validateActiveClass(3);
      expect(group.attr('class')).does.not.include(['min', 'max']);

      // 100%
      simpleGauge.percent = 1;
      simpleGauge.percent.should.be.equal(1);
      validateActiveClass(config.sectionsCount - 1);
      expect(group.attr('class')).does.not.include('min');
      expect(group.attr('class')).to.include('max');
    });

    it('should throw an exception if the percentage specified is invalid', () => {
      const config = {
        el: getRootElement(),
        height: getPositiveNumber(),
        sectionsCount: getSmallPositiveNumber(),
        width: getPositiveNumber()
      };
      const simpleGauge = new SimpleGauge(config);
      expect(() => simpleGauge.percent = 'invalid').to.throw(RangeError, 'The percentage must be between 0 and 1.');
      expect(() => simpleGauge.percent = getNegativeNumber()).to.throw(RangeError,
        'The percentage must be between 0 and 1.');
      expect(() => simpleGauge.percent = getPositiveNumber + 0.5).to.throw(RangeError,
        'The percentage must be between 0 and 1.');
    });
  });

  // Tests for 'value' setter
  describe('#value', () => {
    it('should set the value specified if it is valid', () => {
      const config = {
        el: getRootElement(),
        height: getPositiveNumber(),
        sectionsCount: getSmallPositiveNumber(),
        width: getPositiveNumber(),
        interval: [
          0,
          250
        ]
      };
      const simpleGauge = new SimpleGauge(config);
      simpleGauge.value = 0;
      simpleGauge.percent.should.be.equal(0);

      simpleGauge.value = 125;
      simpleGauge.percent.should.be.equal(0.5);

      simpleGauge.value = 250;
      simpleGauge.percent.should.be.equal(1);
    });
    it('should throw an exception if the value specified is invalid', () => {
      const config = {
        el: getRootElement(),
        height: getPositiveNumber(),
        sectionsCount: getSmallPositiveNumber(),
        width: getPositiveNumber()
      };
      const simpleGauge = new SimpleGauge(config);
      expect(() => simpleGauge.value = 'invalid').to.throw(Error, 'The specified value must be a number.');
    });
  });
});

/**
 * Generates a random negative number.
 */
const getNegativeNumber = rn.generator({
  min: -1000,
  max: -1,
  integer: true
});

/**
 * Generates a random negative number (including zero).
 */
const getNegativeOrZeroNumber = rn.generator({
  min: -1000,
  max: 0,
  integer: true
});

/**
 * Generates a random positive number.
 */
const getPositiveNumber = rn.generator({
  min: 1,
  max: 1000,
  integer: true
});

/**
 * Generates a random positive number (including zero).
 */
const getPositiveOrZeroNumber = rn.generator({
  min: 0,
  max: 1000,
  integer: true
});

/**
 * Generates a random positive small number.
 */
const getSmallPositiveNumber = rn.generator({
  min: 1,
  max: 10,
  integer: true
});

/**
 * Gets the root element of the gauge.
 *
 * @returns {*}   The root element of the gauge.
 */
function getRootElement() {
  const dom = new jsdom.JSDOM(`<!DOCTYPE html><svg></svg>`);
  return d3.select(dom.window.document.querySelector('svg'));
}
