// add Comma above decimal point or space below decimal point
const addComma = (number) => {
  var str = number.toString().split('.');
  if (str[0].length >= 4) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
  if (str[1] && str[1].length >= 4) {
    str[1] = str[1].replace(/(\d{3})/g, '$1 ');
  }
  return str.join('.');
}

// don't use this function right now
const getType = (character) => {
  if(character === '0') return 0;           // when character is zero
  if(character === '.') return 1;           // when character is decimal point
  if(character === ',') return 2;           // when character is comma
  if(!isNaN(parseInt(character))) return 3; // when character is number from 1 to 9
  return -1;                                // when other character
}

// modify number to comma and space per 3 digits
const modify = (result, nextCaretPos) => {
  var caretPos = -1;
  // number above decimal point,
  var newAboveStr = "";
  var aboveDecimalStr = result.split('.')[0]? result.split('.')[0]: '';
  var aboveLength = aboveDecimalStr.length;

  // convert number above decimal point to comma and space per 3 digits
  for(var i = aboveLength - 1; i >= 0; i--) {
    if(i === nextCaretPos) caretPos = newAboveStr.length;
    newAboveStr = aboveDecimalStr[i] + newAboveStr;
    if(newAboveStr.length % 4 === 3 && i > 0)
      newAboveStr = ',' + newAboveStr;
  }

  // when caret placed above decimal point,
  if(caretPos >= 0) caretPos = newAboveStr.length - caretPos;

  // number below decimal point
  var newBelowStr = "";
  var belowDecimalStr = result.split('.')[1]? result.split('.')[1]: '';
  var belowLength = belowDecimalStr.length;

  // convert number below decimal point to comma and space per 3 digits
  for(var i = 0; i < belowLength; i++) {
    newBelowStr += belowDecimalStr[i];
    if(i + aboveLength + 1 === nextCaretPos)
      caretPos = newBelowStr.length + newAboveStr.length + 1
    if(newBelowStr.length % 4 === 3 && i < belowLength - 1)
      newBelowStr += ' ';
  }

  // join number above and below decimal point
  var newResult = aboveDecimalStr + (result.indexOf('.') < 0? '': '.') + belowDecimalStr;
  if(caretPos < 0) {
    if(typeof newResult === 'undefined' || newResult.length === 0) caretPos = 0;
    else if(result[nextCaretPos] === '.') caretPos = newAboveStr.length + 1;
  }
  // when typed backspace or delete
  caretPos = pressedKey <= 0? caretPos: caretPos - 1;
  // when caret placed zero position,
  caretPos = caretPos < 0? 0: caretPos;
  return caretPos;
}

// set new Caret position when type on position - `caretPos`
const getNextCaretPos = (strTotal, caretPos) => {
  let nextCaretPos;
  let resultTotal;
  if(!pressedKey) {
    if(strTotal[caretPos - 1] === '.') {
      // when typed decimal point
      aboveCaretStr = strTotal.substring(0, caretPos - 1).replace(/[, .]+/g, '');
      belowCaretStr = strTotal.substring(caretPos).replace(/[, .]+/g, '');
      resultTotal = aboveCaretStr + "." + belowCaretStr;
      nextCaretPos = aboveCaretStr.length;
    } else {
      // when typed number
      aboveCaretStr = strTotal.substring(0, caretPos).replace(/[, ]+/g, '');
      belowCaretStr = strTotal.substring(caretPos).replace(/[, ]+/g, '');
      resultTotal = aboveCaretStr + belowCaretStr;
      nextCaretPos = aboveCaretStr.length - 1;
    }
  } else {
    // when typed key 'backspace'(8) or 'delete' (46)
    nextCaretPos = caretPos - (pressedKey < 0);
    while(nextCaretPos >= 0 && nextCaretPos < strTotal.length && (strTotal[nextCaretPos] === ',' || strTotal[nextCaretPos] === ' '))
      nextCaretPos += pressedKey;
    aboveCaretStr = strTotal.substring(0, nextCaretPos + 1).replace(/[, ]+/g, '');
    belowCaretStr = strTotal.substring(nextCaretPos + 1).replace(/[, ]+/g, '');
    resultTotal = aboveCaretStr + belowCaretStr;
    nextCaretPos = aboveCaretStr.length - 1;
  }
  // get caret position after number modified
  nextCaretPos = modify(resultTotal, nextCaretPos);
  return [resultTotal, nextCaretPos];
}

// set caret position on contenteditable div
const setCaret = (id, pos) => {
  var el = document.getElementById(id);
  if(typeof el.childNodes[0] === 'undefined') return;
  var range = document.createRange();
  var sel = window.getSelection();
  range.setStart(el.childNodes[0], pos);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
  el.focus();
}