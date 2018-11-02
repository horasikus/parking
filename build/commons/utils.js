"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const groupBy = exports.groupBy = (xs, key) => xs.reduce((rv, x) => {
  (rv[x[key]] = rv[x[key]] || []).push(x);
  return rv;
}, {});

const objectMap = exports.objectMap = (object, mapFn) => Object.keys(object).reduce((result, key) => {
  result[key] = mapFn(object[key]);
  return result;
}, {});