# ADPatternLock
An react library for android like pattern lock for your web app.
It's highly customizable according to your need.

## Installation
```
npm install ad-pattern-lock
```

## How to use
```
import React, { Component } from "react";
import AdPatternLock from "ad-pattern-lock";
import 'ad-pattern-lock/dist/main.css';

// in you render method
<AdPatternLock/>
``` 

## Props API

| props         | default   | Description |
| ------------- | ------------- | ------------- |
| matrix  | [3,3]  | m*n grid for the pattern |
| backgroundColor  | #556b2f  | Background color for the pattern |
| allowRepeat | false | Will allow repetition of dots if true |
| delimiter | <empty> | Delimeter used in pattern output |
| patternDotsBackgroundColor | #fff | background color for the inner dots of pattern circle |
| patternDotsRadius | 5 | radius for the pattern dots |
| patternCircleRadius | 25 | radius for the pattern circle |
| patternCircleMargin | 20 | margin for the pattern circle (margin and radius used to calculate width and height of the pattern component) |
| patternCircleVisible | false | if true circle surrounds the pattern dots |
| patternCircleVisibleBorder| "3px solid #fff" | border property for pattern circle |
| patternCircleHoverVisible | false | if true circle surrounds the pattern dots on hover |
| patternCircleHoverBorder | "3px solid #afeeee" | border property for pattern circle on hover |
| patternLinesHeight | 10 | height of the pattern lines[usually double of radius of pattern dots] |
| patternLinesBackgroundColor | rgba(255,255,255,.7) | color of pattern lines |
| minimumPatternLength| 2 | minimum pattern length
 

## License
Copyright (c) [2019] [ankitdeveloper]
