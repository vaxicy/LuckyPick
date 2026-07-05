var fs = require('fs');
var path = require('path');

var fp = path.join(__dirname, 'popup.js');
var c = fs.readFileSync(fp, 'utf8');

// Count occurrences
function count(str) {
  var matches = c.match(new RegExp(str, 'g'));
  return matches ? matches.length : 0;
}

console.log('reel:', count('reel'));
console.log('reel:', count('reel'));
console.log('eased:', count('eased'));
console.log('eased:', count('eased'));
console.log('extraSpins:', count('extraSpins'));
console.log('extraSpins:', count('extraSpins'));
console.log('winnerIdx:', count('winnerIdx'));
console.log('winnerIdx:', count('winnerIdx'));

// Try to parse the JS to check for syntax errors
try {
  new Function(c);
  console.log('\nJS syntax: OK');
} catch(e) {
  console.log('\nJS syntax ERROR:', e.message);
}
