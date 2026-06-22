/*!
 * mini-validate.lib.js v1.8.0
 * Schema validation utility (vendored copy, not part of project source)
 * (c) 2023-2025 — ISC License
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.MiniValidate = factory());
}(this, (function () {
  'use strict';

  function createSchema(rules) {
    return {
      rules: rules,
      validate: function (data) {
        var errors = {};
        var isValid = true;
        for (var key in rules) {
          if (!Object.prototype.hasOwnProperty.call(rules, key)) continue;
          var rule = rules[key];
          var value = data[key];
          var fieldErrors = [];

          if (rule.required && (value === undefined || value === null || value === '')) {
            fieldErrors.push(rule.requiredMessage || (key + ' is required'));
          }
          if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
            fieldErrors.push(key + ' must be at least ' + rule.minLength + ' characters');
          }
          if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
            fieldErrors.push(key + ' must be at most ' + rule.maxLength + ' characters');
          }
          if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
            fieldErrors.push(rule.patternMessage || (key + ' has invalid format'));
          }
          if (rule.enum && rule.enum.indexOf(value) === -1) {
            fieldErrors.push(key + ' must be one of: ' + rule.enum.join(', '));
          }
          if (rule.custom && typeof rule.custom === 'function') {
            var customResult = rule.custom(value, data);
            if (customResult !== true) {
              fieldErrors.push(customResult || (key + ' is invalid'));
            }
          }

          if (fieldErrors.length > 0) {
            errors[key] = fieldErrors;
            isValid = false;
          }
        }
        return { valid: isValid, errors: errors };
      }
    };
  }

  function string() {
    var rule = {};
    return {
      required: function (message) { rule.required = true; rule.requiredMessage = message; return this; },
      min: function (n) { rule.minLength = n; return this; },
      max: function (n) { rule.maxLength = n; return this; },
      pattern: function (regex, message) { rule.pattern = regex; rule.patternMessage = message; return this; },
      oneOf: function (values) { rule.enum = values; return this; },
      custom: function (fn) { rule.custom = fn; return this; },
      _build: function () { return rule; }
    };
  }

  return {
    createSchema: createSchema,
    string: string
  };
})));
