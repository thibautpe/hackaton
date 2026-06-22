/*!
 * date-utils.lib.js v2.4.1
 * A lightweight date manipulation library (vendored copy)
 * (c) 2024-2025 — MIT License
 * This file is auto-generated, do not edit manually.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.DateUtils = factory());
}(this, (function () {
  'use strict';

  var MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  function daysInMonth(year, month) {
    var days = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return days[month];
  }

  function addDays(date, amount) {
    var result = new Date(date);
    result.setDate(result.getDate() + amount);
    return result;
  }

  function addMonths(date, amount) {
    var result = new Date(date);
    var day = result.getDate();
    result.setMonth(result.getMonth() + amount);
    if (result.getDate() !== day) result.setDate(0);
    return result;
  }

  function addYears(date, amount) {
    return addMonths(date, amount * 12);
  }

  function startOfDay(date) {
    var result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  function endOfDay(date) {
    var result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  function startOfWeek(date, weekStartsOn) {
    weekStartsOn = weekStartsOn || 0;
    var result = new Date(date);
    var day = result.getDay();
    var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    result.setDate(result.getDate() - diff);
    return startOfDay(result);
  }

  function endOfWeek(date, weekStartsOn) {
    var start = startOfWeek(date, weekStartsOn);
    return endOfDay(addDays(start, 6));
  }

  function startOfMonth(date) {
    var result = new Date(date);
    result.setDate(1);
    return startOfDay(result);
  }

  function endOfMonth(date) {
    var result = new Date(date);
    result.setMonth(result.getMonth() + 1, 0);
    return endOfDay(result);
  }

  function differenceInDays(dateLeft, dateRight) {
    var diff = startOfDay(dateLeft) - startOfDay(dateRight);
    return Math.round(diff / (1000 * 60 * 60 * 24));
  }

  function differenceInHours(dateLeft, dateRight) {
    var diff = dateLeft - dateRight;
    return Math.floor(diff / (1000 * 60 * 60));
  }

  function differenceInMinutes(dateLeft, dateRight) {
    var diff = dateLeft - dateRight;
    return Math.floor(diff / (1000 * 60));
  }

  function isSameDay(dateLeft, dateRight) {
    return startOfDay(dateLeft).getTime() === startOfDay(dateRight).getTime();
  }

  function isWeekend(date) {
    var day = date.getDay();
    return day === 0 || day === 6;
  }

  function isToday(date) {
    return isSameDay(date, new Date());
  }

  function isYesterday(date) {
    return isSameDay(date, addDays(new Date(), -1));
  }

  function isTomorrow(date) {
    return isSameDay(date, addDays(new Date(), 1));
  }

  function isPast(date) {
    return date.getTime() < Date.now();
  }

  function isFuture(date) {
    return date.getTime() > Date.now();
  }

  function format(date, pattern) {
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var pad = function (n) { return String(n).padStart(2, '0'); };

    return pattern
      .replace('yyyy', year)
      .replace('MMMM', MONTH_NAMES[month])
      .replace('MMM', MONTH_NAMES[month].slice(0, 3))
      .replace('MM', pad(month + 1))
      .replace('dd', pad(day))
      .replace('EEEE', DAY_NAMES[date.getDay()])
      .replace('EEE', DAY_NAMES[date.getDay()].slice(0, 3))
      .replace('HH', pad(hours))
      .replace('mm', pad(minutes))
      .replace('ss', pad(seconds));
  }

  function parseISO(isoString) {
    return new Date(isoString);
  }

  function formatDistance(date, baseDate) {
    var diffMs = date - baseDate;
    var diffSec = Math.round(diffMs / 1000);
    var diffMin = Math.round(diffSec / 60);
    var diffHour = Math.round(diffMin / 60);
    var diffDay = Math.round(diffHour / 24);

    if (Math.abs(diffSec) < 60) return 'just now';
    if (Math.abs(diffMin) < 60) return diffMin > 0 ? diffMin + ' minutes from now' : Math.abs(diffMin) + ' minutes ago';
    if (Math.abs(diffHour) < 24) return diffHour > 0 ? diffHour + ' hours from now' : Math.abs(diffHour) + ' hours ago';
    if (Math.abs(diffDay) < 30) return diffDay > 0 ? diffDay + ' days from now' : Math.abs(diffDay) + ' days ago';
    return format(date, 'MMM dd, yyyy');
  }

  function getQuarter(date) {
    return Math.floor(date.getMonth() / 3) + 1;
  }

  function getWeekOfYear(date) {
    var start = new Date(date.getFullYear(), 0, 1);
    var diff = date - start;
    var oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.ceil((diff + start.getDay() * 86400000) / oneWeek);
  }

  function clamp(date, minDate, maxDate) {
    if (date < minDate) return minDate;
    if (date > maxDate) return maxDate;
    return date;
  }

  function isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
  }

  function eachDayOfInterval(start, end) {
    var days = [];
    var current = startOfDay(start);
    var last = startOfDay(end);
    while (current <= last) {
      days.push(new Date(current));
      current = addDays(current, 1);
    }
    return days;
  }

  return {
    isLeapYear: isLeapYear,
    daysInMonth: daysInMonth,
    addDays: addDays,
    addMonths: addMonths,
    addYears: addYears,
    startOfDay: startOfDay,
    endOfDay: endOfDay,
    startOfWeek: startOfWeek,
    endOfWeek: endOfWeek,
    startOfMonth: startOfMonth,
    endOfMonth: endOfMonth,
    differenceInDays: differenceInDays,
    differenceInHours: differenceInHours,
    differenceInMinutes: differenceInMinutes,
    isSameDay: isSameDay,
    isWeekend: isWeekend,
    isToday: isToday,
    isYesterday: isYesterday,
    isTomorrow: isTomorrow,
    isPast: isPast,
    isFuture: isFuture,
    format: format,
    parseISO: parseISO,
    formatDistance: formatDistance,
    getQuarter: getQuarter,
    getWeekOfYear: getWeekOfYear,
    clamp: clamp,
    isValidDate: isValidDate,
    eachDayOfInterval: eachDayOfInterval,
    MONTH_NAMES: MONTH_NAMES,
    DAY_NAMES: DAY_NAMES,
  };
})));
