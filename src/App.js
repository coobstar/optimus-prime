/* global localStorage */

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
var MidiWriter = require('midi-writer-js');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curTime: new Date().getTime().toString().split('').reverse().join(''),
      menuOpen: false,
      outputPrime: ""
    };

    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.submitPrime = this.submitPrime.bind(this);
  }

  componentDidMount() {
    if (window.localStorage && window.localStorage.getItem('page-color')) {
      document.documentElement.style.setProperty('--outline-color', localStorage.getItem('page-color'))
    }

    setInterval( () => {
      this.setState({
        curTime : new Date().getTime().toString().split('').reverse().join('')
      })
    },30)


  }

  handleColorChange(event) {
    window.localStorage.setItem('page-color', event.target.value);
    document.documentElement.style.setProperty('--outline-color', event.target.value)
    this.setState({
      menuOpen: false
    });
  }

  handleMenuClick(event) {
    this.setState({
      menuOpen: !this.state.menuOpen
    });
  }

  submitPrime(event) {
    event.preventDefault();
    let n = parseInt(this.inputPrime.value);
    /*let last_factor = 0;
    let remainder = 0;
    let outputString = "";
    while (last_factor !== 1) {
      last_factor = factor(n);
      remainder = n / last_factor;
      let factorString = "found another prime factor: " + last_factor + " x " + remainder + " = " + n;
      console.log(factorString);
      outputString += factorString;
      outputString += "\n";
      n = remainder;
    }*/
    let outputString = "";
    let primes = [];
    for (let i = 0; i < 100; i++) {
      primes[i] = getPrimeFactorVector(i);
      console.log(primes[i]);
    }
    this.setState({
      outputPrime: primes.toString()
    });

    const canvas = document.getElementById('screen');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");
    const imgData = new ImageData(Uint8ClampedArray.from(preparePixelArray(primes)), 100, 100);
    ctx.putImageData(imgData, 0, 0);

    let track = new MidiWriter.Track();

    for (let p of primes) {
      track.addEvent(new MidiWriter.NoteEvent({pitch: generateChordFromPrimeFactorVector(p, 40, 64, 1), duration: '4'}))
    }

    var write = new MidiWriter.Writer([track]);
    console.log(write.dataUri());
  }

  render() {

    return (
      <div className="app">
        <header className="header">
          <div className="header-left header-section">
            <div src={logo} className="logo" alt="logo" >C</div>
          </div>
          <div className="header-center header-section">
            <div className="title">Carls Cool Website</div>
          </div>
          <div className="header-right header-section">
            <div className="time">{this.state.curTime}</div>
            <div className="header-menu-button" onClick={this.handleMenuClick}>+</div>
          </div>
        </header>
        <div className={"menu " + (this.state.menuOpen ? 'show' : 'hidden')}>
          <select value={this.state.textColor} onChange={this.handleColorChange}>
            <option value="#990000">Red</option>
            <option value="#009900">Green</option>
            <option value="#000099">Blue</option>
          </select>
        </div>
        <div className="intro">
          <code>enter a prime to factor</code> and press factor
          <form className="prime-input" onSubmit={this.submitPrime}>
            <input type="text" ref={(element) => { this.inputPrime = element }}></input>
            <button>compute</button>
          </form>
          <div className="prime-output">{this.state.outputPrime}</div>
        </div>
        <div className="screenOutput">
          <canvas id="screen"/>
        </div>
      </div>
    );
  }
}

function calculateLCM() {
  var factorVectors = [];

   for (var i = 1; i <= 20; i++) {
     factorVectors.push(getPrimeFactorVector(i, 20));
   }

   console.log(factorVectors);
   var lcmVector = Array(20).fill(0);
   for (let i = 0; i < 20; i++) {
     for  (let j = 0; j < 20; j++) {
       if (factorVectors[i][j] > lcmVector[j]) {
         lcmVector[j] = factorVectors[i][j]
       }
     }
   }

   console.log(lcmVector);
   console.log(expandPrimeFactorVector(lcmVector));
}

function isPalindrome(n) {
  var s = n.toString();
  var split = s.split('');
  var p = true;
  for (var i = 0; i < Math.round(split.length / 2); i++) {
    if (split[i] !== split[split.length - i - 1]) {
      p = false;
      break;
    }
  }
  return p;
}

function getPrimeFactorVector(n, l = 100) {
  let factors = getPrimeFactors(n);
  let v = new Array(l).fill(0);
  for (let f of factors) {
    if (f < l) {
      v[f] += 1;
    }
  }
  return v;
}

function expandPrimeFactorVector(v) {
  let product = 1;

  for (let i = 0; i < v.length; i++) {
    if (v[i] > 0) {
      product *= Math.pow(i, v[i]);
      console.log(i, v[i], Math.pow(i, v[i]), product);
    }
  }

  return product;
}

function generateChordFromPrimeFactorVector(v, offset = 0, depth = 127, scale = 1) {
  let chord = [];
  for (let i = 0; i < Math.min(v.length, depth); i++) {
    if (v[i] > 0) {
      chord.push(((i * scale) % 12) + offset);
    }
  }
  console.log(chord);
  return chord;
}

function getPrimeFactors(n) {
  if (n > 1) {
    let last_factor = 0;
    let remainder = 0;
    let factors = [];
    while (last_factor !== 1) {
      last_factor = factor(n);
      if(last_factor % 2 === 0) {
        last_factor = 2;
      }
      remainder = n / last_factor;
      factors.push(last_factor);
      n = remainder;
    }

    return factors;
  } else {
    return [1];
  }
}

function factor(n) {
  let x_fixed = 2;
  let cycle_size = 2;
  let x = 2;
  let factor = 1;
  if (n !== 1) {
    while (factor === 1) {
      let count = 1;
      while (count < cycle_size && factor <= 1) {
        x = g(x, n);
        factor = gcd(Math.abs(x - x_fixed), n);
        count += 1;
      }
      cycle_size *= 2;
      x_fixed = x;
    }
  }
  return factor;
}

function gcd2(a, b) {
  if(b !== 0) {
    return gcd2(b, a % b);
  } else {
    return a;
  }
}

function gcd(a, b) {
  while(a % b !== 0){
    [a, b] = [b, a % b]
  }
  return b;
}

function g(x, n) {
  return (x * x + 1) % n;
}

function preparePixelArray(a) {
  const concat = (xs, ys) => xs.concat(ys);
  const toRGBA = x => [Math.abs(255 - x), Math.abs(255 - x), Math.abs(255 - x), 255];
  let flattenedRGBAValues = normalize(a.reduce(concat), 255).map(toRGBA).reduce(concat);
  console.log(flattenedRGBAValues);
  return flattenedRGBAValues;
}

function normalize(a, max = 1) {
  let current_max = Math.max(...a);
  console.log(current_max);
  let s = max / current_max;
  return a.map(x => s * x);
}

export default App;
