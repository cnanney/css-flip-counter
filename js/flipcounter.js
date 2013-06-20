/**
 * CSS Flip Counter
 * Version 0.1 - Dec 4, 2011
 *
 * Copyright (c) 2011 Chris Nanney
 *
 * http://cnanney.com/journal/demo/css-flip-counter/
 *
 * Licensed under MIT
 * http://www.opensource.org/licenses/mit-license.php
 */

var flipCounter = function(d, options){

  // Default values
  var defaults = {
    value: 0,
    inc: 1,
    pace: 1000,
    auto: true
  };

  var counter = options || {};
  var document = window.document;

  for (var opt in defaults){
    counter[opt] = counter.hasOwnProperty(opt) ? counter[opt] : defaults[opt];
  }

  var digitsOld = [], digitsNew = [], digitsAnimate = [], x, y, nextCount = null,
    best = {
      q: null,
      pace: 0,
      inc: 0
    };

  /**
   * Sets the value of the counter and animates the digits to new value.
   *
   * Example: myCounter.setValue(500); would set the value of the counter to 500,
   * no matter what value it was previously.
   *
   * @param {int} n
   *   New counter value
   */
  this.setValue = function(n){
    if (_isNumber(n)){
      x = counter.value;
      y = counter.value = n;
      _digitCheck(x, y);
    }
    return this;
  };

  /**
   * Sets the increment for the counter. Does NOT animate digits.
   */
  this.setIncrement = function(n){
    counter.inc = _isNumber(n) ? n : defaults.inc;
    return this;
  };

  /**
   * Sets the pace of the counter. Only affects counter when auto == true.
   *
   * @param {int} n
   *   New pace for counter in milliseconds
   */
  this.setPace = function(n){
    counter.pace = _isNumber(n) ? n : defaults.pace;
    return this;
  };

  /**
   * Sets counter to auto-increment (true) or not (false).
   *
   * @param {boolean} a
   *   Should counter auto-increment, true or false
   */
  this.setAuto = function(a){
    var sa = typeof a !== "boolean" ? true : a;
    if (counter.auto){
      if (!sa){
        if (nextCount) _clearNext();
        counter.auto = false;
      }
    }
    else{
      if (sa){
        if (nextCount) _clearNext();
        counter.auto = true;
        _doCount();
      }
    }
    return this;
  };

  /**
   * Increments counter by one animation based on set 'inc' value.
   */
  this.step = function(){
    if (!counter.auto) _doCount();
    return this;
  };

  /**
   * Adds a number to the counter value, not affecting the 'inc' or 'pace' of the counter.
   *
   * @param {int} n
   *   Number to add to counter value
   */
  this.add = function(n){
    if (_isNumber(n)){
      x = counter.value;
      counter.value += n;
      y = counter.value;
      _digitCheck(x, y);
    }
    return this;
  };

  /**
   * Subtracts a number from the counter value, not affecting the 'inc' or 'pace' of the counter.
   *
   * @param {int} n
   *   Number to subtract from counter value
   */
  this.subtract = function(n){
    if (_isNumber(n)){
      x = counter.value;
      counter.value -= n;
      if (counter.value >= 0){
        y = counter.value;
      }
      else{
        y = "0";
        counter.value = 0;
      }
      _digitCheck(x, y);
    }
    return this;
  };

  /**
   * Gets current value of counter.
   */
  this.getValue = function(){
    return counter.value;
  }

  /**
   * Stops all running increments.
   */
  this.stop = function(){
    if (nextCount) _clearNext();
    return this;
  }

  //---------------------------------------------------------------------------//

  function _doCount(first){
    var first_run = typeof first === "undefined" ? false : first;
    x = counter.value;
    if (!first_run) counter.value += counter.inc;
    y = counter.value;
    _digitCheck(x, y);
    // Do first animation
    if (counter.auto === true) nextCount = setTimeout(_doCount, counter.pace);
  }

  function _digitCheck(x, y){
    digitsOld = _splitToArray(x);
    digitsNew = _splitToArray(y);
    var ylen = digitsNew.length;
    for (var i = 0; i < ylen; i++){
      digitsAnimate[i] = digitsNew[i] != digitsOld[i];
    }
    _draw_counter();
  }

  // Creates array of digits for easier manipulation
  function _splitToArray(input){
    return input.toString().split('').reverse();
  }

  // Sets the correct digits on load
  function _draw_counter(){
    var bit = 1, html = '', dNew, dOld;
    for (var i = 0, count = digitsNew.length; i < count; i++){
      dNew = _isNumber(digitsNew[i]) ? digitsNew[i] : '';
      dOld = _isNumber(digitsOld[i]) ? digitsOld[i] : '';
      html += '<li class="digit" id="digit-a'+i+'">'+
        '<div class="line"></div>'+
        '<span class="front">'+dNew+'</span>'+
        '<span class="back">'+dOld+'</span>'+
        '<div class="hinge">'+
        '<span class="front">'+dOld+'</span>'+
        '<span class="back">'+dNew+'</span>'+
        '</div>'+
        '</li>';
      if (bit !== count && bit % 3 === 0){
        html += '<li class="digit-delimiter">,</li>';
      }
      bit++;
    }

    var element = document.getElementById(d);
    element.innerHTML = html;

    var alen = digitsAnimate.length;

    // Need a slight delay before adding the 'animate' class or else animation won't fire on FF
    setTimeout(function(){
      for (i = 0; i < alen; i++){
        if (digitsAnimate[i]){
          var a = document.getElementById('digit-a'+i);
          a.className = a.className+' animate';
        }
      }
    }, 20)

  }

  // http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric/1830844
  function _isNumber(n){
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function _clearNext(){
    clearTimeout(nextCount);
    nextCount = null;
  }

  // Start it up
  _doCount(true);
};