// Use TypeScript's polyfill if applicable
var tslib = require('tslib');

// Shortcut for object functions
function extendObject(name, value) {
  if (typeof Object[name] !== 'function') {
    Object.defineProperty(Object, "assign", {
      value: value,
      writable: true,
      configurable: true
    });
  }
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
extendObject('assign', tslib.__assign);

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values
extendObject('values', function(obj) {
  return Object.keys(obj).map(function(key) {
    return obj[key];
  });
});

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
extendObject('entries', function(obj) {
  return Object.keys(obj).map(function(key) {
    return [key, obj[key]];
  });
});
