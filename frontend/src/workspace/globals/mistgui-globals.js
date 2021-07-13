/**
 * mistgui-globals.js
 *   Global constiables for a MIST gui.  (Eventually, these should be fields
 *   within the object/prototype.)
 */

import { width, height } from "./globals.js";

const globalFont = "Arial";
const functionFont = "Arial";

const functionStrokeWidth = width / 90;
const functionHalfStrokeWidth = functionStrokeWidth / 2;
const functionTotalSideLength = width / 20;
const functionRectSideLength = functionTotalSideLength - functionStrokeWidth;
const functionMultColor = "#9966ff"; 
const functionSingleColor = "#6680ff";
const functionRGBcolor = "#66cdff";

const valueSideLength = functionTotalSideLength / 1.8; //1.414;
const valueXYColor = "#f97162";
const valueTimeColor = "#f9bc62";
const valueMouseColor = "#f9e262";
const valueConstantColor = "#fff192";

const menuFontSize = width / 75; //12 when width = 900
const nodeFontSize = width / 56.25; //16 when width = 900
const globalScale = width / 900; // for elements that are more difficult to scale (undo/redo)

const funNames = [
  "add",
  "multiply",
  "average",
  "wrapsum",
  "square",
  // "sqrt",
  "negate",
  "sine",
  "cosine",
  "absolute",
  "sign",
  "mistif",
  "rgb"
];

const functions = {
  add: { 
    rep: "+", 
    max: 20,
    min: 2, 
    prefix: "sum",
    descript: "Sum 2 or more values. If the sum > 1, it gives 1. If the sum < -1, it gives -1",
    usage: "sum(...)",
    color: functionMultColor,
  },
  multiply: {
    rep: "*",
    max: 20,
    min: 2,
    prefix: "mult",
    descript: "Multiply 2 or more values",
    usage: "mult(...)",
    color: functionMultColor,
  },
  square: {
    rep: "^2",
    max: 1,
    min: 1,
    prefix: "square",
    descript: "Multiply a by itself",
    usage: "square(a)",
    color: functionSingleColor,
  },
  negate: {
    rep: "neg",
    max: 1,
    min: 1,
    prefix: "neg",
    descript: "Negates value",
    usage: "neg(a)",
    color: functionSingleColor,
  },
  sine: {
    rep: "sin",
    max: 1,
    min: 1,
    prefix: "sin",
    descript: "The sine of pi*a",
    usage: "sin(a)",
    color: functionSingleColor,
  },
  cosine: {
    rep: "cos",
    max: 1,
    min: 1,
    prefix: "cos",
    descript: "The cosine of pi*a",
    usage: "cos(a)",
    color: functionSingleColor,
  },
  absolute: {
    rep: "abs",
    max: 1,
    min: 1,
    prefix: "abs",
    descript: "The absolute value of i",
    usage: "abs(i)",
    color: functionSingleColor,
  },
  average: {
    rep: "avg",
    max: 20,
    min: 2,
    prefix: "avg",
    descript: "Average 2 or more values",
    usage: "avg(...)",
    color: functionMultColor,
  },
  sign: {
    rep: "+/-",
    max: 1,
    min: 1,
    prefix: "sign",
    descript: "Rounds the value to -1 and 1 (if i < 0, returns -1; if i >= 0, returns 1).",
    usage: "sign(i)",
    color: functionSingleColor,
  },
  wrapsum: {
    rep: "wrap",
    max: 20,
    min: 2,
    prefix: "wsum",
    descript: "Sum of 2 or more values, wrapping around from 1 to -1 (or vice versa) if the sum is too large or too small",
    usage: "sign(i)",
    color: functionMultColor,
  },
  rgb: { 
    rep: "rgb", 
    max: 3, 
    min: 3, 
    prefix: "rgb", 
    descript: "Generate a color from red, green, and blue expressions",
    usage: "rgb(r,g,b)",
    color: functionRGBcolor 
  },
  mistif: {
    rep: "if",
    max: 3,
    min: 3,
    prefix: "mistif",
    descript: "If test >= 0, returns the pos expression. Otherwise, it returns the neg expression.",
    usage: "mistif(test,pos,neg)",
    color: functionSingleColor,
  },
};

const repToFun = {
  sum: "add",
  mult: "multiply",
  sqr: "square",
  neg: "negate",
  sin: "sine",
  cos: "cosine",
  abs: "absolute",
  avg: "average",
  sign: "sign",
  wsum: "wrapsum",
  rgb: "rgb",
  if: "mistif",
};

const repToVal = {
  x: "x",
  y: "y",
  "t.s": "second",
  "t.m": "minute",
  "t.h": "hour",
  "t.d": "day",
  "#": "constant",
  "m.x": "mouseX",
  "m.y": "mouseY",
};

const valNames = [
  "x",
  "y",
  "second",
  "minute",
  "hour",
  "day",
  "mouseX",
  "mouseY",
  "constant",
];
const values = {
  x: {
    rep: "x",
    color: valueXYColor,
    descript: "Values in the horizontal direction" 
  },
  y: {
    rep: "y",
    color: valueXYColor,
    descript: "Values in the vertical direction" 
  },
  second: {
    rep: "t.s",
    color: valueTimeColor,
    descript: "Time in seconds" 
  },
  minute: {
    rep: "t.m",
    color: valueTimeColor,
    descript: "Time in minutes" 
  },
  hour: {
    rep: "t.h",
    color: valueTimeColor,
    descript: "Time in hours" 
  },
  day: {
     rep: "t.d",
     color: valueTimeColor,
     descript: "Time in days" 
  },
  constant: {
    rep: "#",
    color: valueConstantColor,
    descript: "Constant value: enter a number" 
  },
  mouseX: {
    rep: "m.x",
    color: valueMouseColor,
    descript: "Mouse's X position" 
  },
  mouseY: {
    rep: "m.y",
    color: valueMouseColor,
    descript: "Mouse's Y position" 
  },
};

const imageBoxSideLength = width / 80;
const imageBoxColor = "white";
const functionImageBoxOffset = width / 300;
const valueImageBoxOffset = width / 34;
const renderSideLength = width / 18;

const editableTextWidth = width / 15;
const editableTextHeight = width / 30;
const editableTextFont = width / 69;

const constiableColor = { r: 197, g: 231, b: 109, a: 0.5 };
const constiableStrokeColor = "#A1C447";
const constiableRadius = 1.4 * (functionTotalSideLength / 2);
const constiableTextColor = "#62694F";
const constiableWidth = Math.cos(Math.PI / 6) * constiableRadius;

const outletXOffset = width / 400;
const outletYOffset = functionRectSideLength / 3;
const outletColor = "#C4C4C4";
const outletColor2 = "#808080";

const lineStrokeWidth = 2;

const dragShadowColor = "black";
const selectedShadowColor = "blue";

//SLIDING MENU
const menuHeight = width / 12;
const menuCornerWidth = width / 6;
const buttonWidth = width / 10;
const valSpaceWidth = width - menuCornerWidth - 2 * buttonWidth;
const numVals = 6; //valNames.length;
const valMenuXSpacing =
  (valSpaceWidth - (numVals * functionTotalSideLength - 4)) / (numVals + 1);
const functSpaceWidth = width - menuCornerWidth - 2 * buttonWidth;
const numFuncts = 6;
const functMenuXSpacing =
  (functSpaceWidth - numFuncts * functionTotalSideLength) / (numFuncts + 1);
const menuYspacing = (width * 11) / 360;
const menuFunctsXStart =
  2 * (buttonWidth - functionRectSideLength) +
  menuCornerWidth -
  functionTotalSideLength / 2;
const menuFunctsXEnd = width - buttonWidth + functionRectSideLength / 2;
const menuValuesXStart = menuCornerWidth + buttonWidth / 2;
const menuAnimDuration = 1;

//SCROLLING MENU BUTTONS
const arrowWidth = width / 50;
const arrowBoxFill = "gray";
const arrowFill = "black";
const triX = width / 90;
const triY = width / 60;

//CORNER BUTTONS
const menuOffset = 10;
const menuControlHeight = (menuHeight - 4 * menuOffset) / 3;
const menuControlColor = "#111d5e";
const menuControlSelect = "#9EBDF0";
const menuControlTextColor = "black";
const menuTextOffset = menuControlHeight / 5;

//TOOLBOX
const toolboxWidth = width / 18;
const toolboxHeight = width / 4.1;
const toolboxShift = toolboxWidth / 5;
const toolboxButtonSize = width / 30;
const deleteColor = "#A30F0F";

//FUNCTIONBAR
const funBarWidth = width;
const funBarHeight = height / 15;
const funBarBackgroundColor = menuControlColor;
const funBarOffset = funBarHeight * 0.17;
const funBarTextAreaWidth = funBarWidth * 0.75;
const funBarTextAreaHeight = funBarHeight * 0.66;
const funBarTextOffset = funBarOffset * 1.5;
const funBarDisplayFontSize = width / 40.9;
const funBarFontSize = width / 75;
const funBarIconOffset = funBarWidth / 16;
const funBarIconSideLength = funBarHeight / 4;
const funBarIconTextWidth = width / 18;
const funBarIconTextY = funBarHeight - funBarOffset * 1.3;

//SAVE SCREEN
const popRectColor = "white"; //'#e8e8e8';
const popRectWidth = width * 0.35;
const popRectHeight = height * 0.85;
const popSaveGroupX = (width - popRectWidth) / 2;
const popSaveGroupY = (height - popRectHeight) / 2;

const popCanvasSide = popRectWidth * 0.9;
const popCanvasResolution = width * (3 / 9);
const popCanvasShiftX = popSaveGroupX + (popRectWidth - popCanvasSide) / 2;
const popCanvasShiftY = popSaveGroupY + (popRectWidth - popCanvasSide) / 2;

const popTextShiftX = (popRectWidth - popCanvasSide) / 2;
const popTextShiftY = popCanvasShiftY / 1.2 + popCanvasSide;
const popTextWidth = popCanvasSide;
const popTextFontSize = width / 70;
const popTextHeight = 2 * popTextFontSize;

const nameTextShift = width / 18;

const popButtonWidth = popCanvasSide / 3.4;
const popButtonHeight = popTextHeight / 1.25;
const popButtonShiftX = (popCanvasSide - 3 * popButtonWidth) / 2;
const popButtonColor = "#A0A3A3";
const popButtonSelectedColor = "#B6BABA";

const errorColor = "#A11212";

// OPEN WS SCREEN
const popOpenWsRectWidth = width * 0.4;
const popOpenWsRectHeight = height * 0.16;
const popOpenWsGroupX = (width - popOpenWsRectWidth) / 2;
const popOpenWsGroupY = (height - popOpenWsRectHeight) / 2;

const popOpenWsButtonShiftX = popTextShiftX; //((popWsRectWidth / 2) - (2 * popWsButtonWidth)) / 3;
const popOpenWsButtonWidth =
  (popOpenWsRectWidth / 2 - 3 * popOpenWsButtonShiftX) / 2;
const popOpenWsButtonHeight = popOpenWsRectWidth * 0.06;

const RGBoutletColors = ["#C94949", "#2D9C2D", "#4272DB"];

// TOOLBOX BOOLEANS
const lineToolOn = false;
const workToolOn = false;
const deleteToolOn = false;

//MENU BOOLEANSF
const valueExpanded = false;
const functionExpanded = false;
const tagsOn = true;

/* constiables to globally reference the most recently used object/line and current state */
const dragShape = null;
const scaledObj = null;
const map = [];

//OTHER BOOLEANS
const makingLine = false;
const animation = false;

// CONSTANTS

/**
 * The offset in an operation node to the set of offsets.
 */
const OUTLET_OFFSET = 3;
const bezPoint = width / 50;

export { width, height };

export default {
  width,
  height,
  globalFont,
  functionFont,
  functionStrokeWidth,
  functionHalfStrokeWidth,
  functionTotalSideLength,
  functionRectSideLength,
  functionMultColor,
  functionSingleColor,
  functionRGBcolor,
  valueSideLength,
  valueXYColor,
  valueTimeColor,
  valueMouseColor,
  valueConstantColor,
  menuFontSize,
  nodeFontSize,
  globalScale,
  funNames,
  functions,
  valNames,
  values,
  imageBoxSideLength,
  imageBoxColor,
  functionImageBoxOffset,
  valueImageBoxOffset,
  renderSideLength,
  editableTextWidth,
  editableTextHeight,
  editableTextFont,
  constiableColor,
  constiableStrokeColor,
  constiableRadius,
  constiableTextColor,
  constiableWidth,
  outletXOffset,
  outletYOffset,
  outletColor,
  outletColor2,
  lineStrokeWidth,
  dragShadowColor,
  selectedShadowColor,
  menuHeight,
  menuCornerWidth,
  buttonWidth,
  valSpaceWidth,
  numVals,
  valMenuXSpacing,
  functSpaceWidth,
  numFuncts,
  functMenuXSpacing,
  menuYspacing,
  menuFunctsXStart,
  menuFunctsXEnd,
  menuValuesXStart,
  menuAnimDuration,
  arrowWidth,
  arrowBoxFill,
  arrowFill,
  triX,
  triY,
  menuOffset,
  menuControlHeight,
  menuControlColor,
  menuControlSelect,
  menuControlTextColor,
  menuTextOffset,
  toolboxWidth,
  toolboxHeight,
  toolboxShift,
  toolboxButtonSize,
  deleteColor,
  funBarWidth,
  funBarHeight,
  funBarBackgroundColor,
  funBarOffset,
  funBarTextAreaWidth,
  funBarTextAreaHeight,
  funBarTextOffset,
  funBarDisplayFontSize,
  funBarFontSize,
  funBarIconOffset,
  funBarIconSideLength,
  funBarIconTextWidth,
  funBarIconTextY,
  popRectColor,
  popRectWidth,
  popRectHeight,
  popSaveGroupX,
  popSaveGroupY,
  popCanvasSide,
  popCanvasResolution,
  popCanvasShiftX,
  popCanvasShiftY,
  popTextShiftX,
  popTextShiftY,
  popTextWidth,
  popTextFontSize,
  popTextHeight,
  nameTextShift,
  popButtonWidth,
  popButtonHeight,
  popButtonShiftX,
  popButtonColor,
  popButtonSelectedColor,
  errorColor,
  popOpenWsRectWidth,
  popOpenWsRectHeight,
  popOpenWsGroupX,
  popOpenWsGroupY,
  popOpenWsButtonShiftX,
  popOpenWsButtonWidth,
  popOpenWsButtonHeight,
  RGBoutletColors,
  lineToolOn,
  workToolOn,
  deleteToolOn,
  valueExpanded,
  functionExpanded,
  tagsOn,
  dragShape,
  scaledObj,
  map,
  makingLine,
  animation,
  OUTLET_OFFSET,
  bezPoint,
  repToFun,
  repToVal,
};
