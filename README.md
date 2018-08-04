D3 Simple Gauge
===============

A simple gauge written with D3.js that can be easily included in a project.

The base code was used from [this example](https://codepen.io/anon/pen/WKyXgr) on CodePen and from 
[this tutorial](https://jaketrent.com/post/rotate-gauge-needle-in-d3/). I refactored the code of the example to make 
it work with D3.js v5, and I restructured the code to make it more flexible. Thanks to the original author for its 
work.

Quick Start
-----------
The first step you need to do before to use the script is to include [D3.js v5](https://github.com/d3/d3) in your 
project.

Once you have included D3 in your dependencies, you have the following options to use the script:

- Use the latest [version](https://raw.githubusercontent.com/antoinebeland/d3-simple-gauge/master/dist/simple-gauge.js) 
of the master branch (see `dist` folder)
- Clone the repo: `git clone https://github.com/antoinebeland/d3-simple-gauge.git`

Be sure to include `simple-gauge.js` file in your file before to start.

Usage
-----
The gauge is very simple to use. You only have to initialize a new instance of the gauge with a configuration
like in the following example to make it work. Once the gauge is initialized, you can set the percentage position of
the needle with the `percent` property.
 

```javascript
const svg = d3.select('body')
  .append('svg')
  .attr('width', 400)
  .attr('height', 250);

const simpleGauge = new SimpleGauge({
  el: svg.append('g'),  // The element that hosts the gauge
  width: 400,           // The width of the gauge
  height: 200,          // The height of the gauge
  sectionsCount: 2,     // The number of sections in the gauge
  barWidth: 40          // The bar width of the gauge (optional)
});

setTimeout(() => {
  simpleGauge.percent = 0.7;  // The new percent of the needle to set
}, 5000);
```

License
-------
The code of this project is under MIT license.
