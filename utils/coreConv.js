'use strict';

const config = require('../store');
const money = require('../lib/money');
const defaultRates = require('./defaultRates');

/**
 * The supported weight units
 * The property is the abbreviation of supported units.
 * The value needed to convert to or from gram.
 * Unit's abbreviations could be found in https://www.weightconversions.org/abbreviations.htm
 */
const weightUnits = {
	mg: 1000,
	cg: 100,
	gr: 15.43236,
	dg: 10,
	g: 1,
	dr: 0.5643834,
	dag: 0.1,
	oz: 0.03527396,
	hg: 0.01,
	lb: 0.002204623,
	kg: 0.001,
	st: 0.000157473,
	ton: 0.000001102311
};

/**
 * The supported length units
 * The property is the abbreviation of supported units.
 * The value needed to convert to or from meter.
 */
const lengthUnits = {
	nm: 1000000000,
	mm: 1000,
	cm: 100,
	in: 39.37008,
	dm: 10,
	ft: 3.28084,
	yd: 1.093613,
	m: 1,
	hm: 0.01,
	km: 0.001,
	mi: 0.0006213712
};

/**
 * The supported volume units.
 * The property is the abbreviation of supported units.
*/
const volumeUnits = {
	l: 999.99,
	ml: 999998.87,
	cm3: 1000000,
	m3: 1,
	pint: 2113.374,
	gal: 219.96,
	tablespoon: 67627.96,
	cfeet: 35.31,
	cinch: 61023.80
};

/**
 * The supported base units of numbers.
 * bin for binary, dec for decimal, oct for octal, and finally hex for hexadecimal.
*/
const baseUnits = {
	bin: 2,
	dec: 10,
	oct: 8,
	hex: 16
};

/**
 * get cached currency rates
 */
const currencyUnits = config.has('rates') ? config.get('rates') : defaultRates;

/**
 * Setup money.fx for currencry conversion
 */
money.fx.base = 'USD';
money.fx.rates = currencyUnits;

/**
 * This is a function to perform conversion
 * @param {String} mode - Type of conversion
 * @param {Number} value - Value on which conversion is to be performed
 * @param {String} oldUnit - Unit to be converted from
 * @param {String} newUnit - Unit to be converted to
 * @returns {Number} - result after performing conversion
 */
const convert = (mode, value, oldUnit, newUnit) => {
	switch (mode) {
		case 'b':
			return convertBase(value, oldUnit, newUnit);
		case 'w':
			return convertWeight(value, oldUnit, newUnit);
		case 'l':
			return convertLength(value, oldUnit, newUnit);
		case 't':
			return convertTemp(value, oldUnit, newUnit);
		case 'c':
			return convertCurrency(value, oldUnit, newUnit);
		case 'r':
			return convertRatio(value, oldUnit, newUnit);
		case 'p':
			return convertPercent(value, oldUnit, newUnit);
		case 'v':
			return convertVolume(value, oldUnit, newUnit);
	}
};

/**
 * This is a function to perform ratio conversions
 * @param {Number} ratio - Value on which conversion is to be performed
 * @param {String} ofValue - Unit to be converted from
 * @returns {Number} - result after performing conversion
 */
const convertRatio = (ratio, ofValue) => {
	ratio = eval(ratio);
	return ratio * ofValue;
};

/**
 * This is a function to perform weight conversion
 * @param {Number} value - Value on which conversion is to be performed
 * @param {String} oldUnit - Unit to be converted from
 * @param {String} newUnit - Unit to be converted to
 * @returns {Number} - result after performing conversion
 */
const convertPercent = (percent, _, ofValue) => {
	return (percent / 100) * ofValue;
};

/**
 * This is a function to perform weight conversion
 * @param {Number} value - Value on which conversion is to be performed
 * @param {String} oldUnit - Unit to be converted from
 * @param {String} newUnit - Unit to be converted to
 * @returns {Number} - result after performing conversion
 */
const convertWeight = (value, oldUnit, newUnit) => {
	if (oldUnit === newUnit) return value;
	return (value / weightUnits[oldUnit]) * weightUnits[newUnit];
};

/**
 * This is a function to perform length conversion
 * @param {Number} value - Value on which conversion is to be performed
 * @param {String} oldUnit - Unit to be converted from
 * @param {String} newUnit - Unit to be converted to
 * @returns {Number} - result after performing conversion
 */
const convertLength = (value, oldUnit, newUnit) => {
	if (oldUnit === newUnit) return value;
	return (value / lengthUnits[oldUnit]) * lengthUnits[newUnit];
};

/**
 * This is a function to perform temperature conversion
 * @param {Number} value - Value on which conversion is to be performed
 * @param {String} oldUnit - Unit to be converted from
 * @param {String} newUnit - Unit to be converted to
 * @returns {Number} - result after performing conversion
 * Not working - Need a fix...
 */
const convertTemp = (value, oldUnit, newUnit) => {
	value = Number(value);

	if (oldUnit === newUnit) {
		return value;
	} else if (oldUnit === 'C' && newUnit === 'F') {
		return (9 / 5) * value + 32;
	} else if (oldUnit === 'K' && newUnit === 'F') {
		return (9 / 5) * (value - 273) + 32;
	} else if (oldUnit === 'F' && newUnit === 'C') {
		return (5 / 9) * (value - 32);
	} else if (oldUnit === 'C' && newUnit === 'K') {
		return value + 273;
	} else if (oldUnit === 'K' && newUnit === 'C') {
		return value - 273;
	} else if (oldUnit === 'F' && newUnit === 'K') {
		return (5 / 9) * (value - 32) + 273;
	}
};

/**
 * This is a function to perform volume conversion
 * @param {Number} value - Value on which conversion is to be performed
 * @param {String} oldUnit - Unit to be converted from
 * @param {String} newUnit - Unit to be converted to
 * @returns {Number} - result after performing conversion
 */
const convertVolume = (value, oldUnit, newUnit) => {
	if (oldUnit === newUnit) return value;
	return (value / volumeUnits[oldUnit]) * volumeUnits[newUnit];
}

/**
 * This is a function to perform base conversion
 * @param {Number} value - Value on which conversion is to be performed
 * @param {String} oldUnit - Unit to be converted from
 * @param {String} newUnit - Unit to be converted to
 * @returns {Number} - result after performing conversion
 */
const convertBase = (value, oldUnit, newUnit) => {
	value = Number(value);

	if(oldUnit === newUnit){
		return value;
	} else if(oldUnit === 'bin' && newUnit === 'dec'){

	} else if(oldUnit === 'dec' && newUnit === 'bin'){

	} else if(oldUnit === 'dec' && newUnit === 'oct'){

	} else if(oldUnit === 'oct' && newUnit === 'dec') {

	} else if(oldUnit === 'bin' && newUnit === 'oct') {

	} else if(oldUnit === 'oct' && newUnit === 'bin') {

	} else if(oldUnit === 'oct' && newUnit === 'dec') {

	} else if(oldUnit === 'bin' && newUnit === 'hex') {

	} else if(oldUnit === 'hex' && newUnit === 'bin') {

	} else if(oldUnit === 'dec' && newUnit === 'hex') {

	} else if(oldUnit === 'hex' && newUnit === 'dec') {

	} else if(oldUnit === 'oct' && newUnit === 'hex') {

	} else if(oldUnit === 'hex' && newUnit === 'oct') {

	} 
}

/**
 * This is a function to perform currency conversion
 * @param {Number} value - Value on which conversion is to be performed
 * @param {String} oldUnit - Unit to be converted from
 * @param {String} newUnit - Unit to be converted to
 * @returns {Number} - result after performing conversion
 */
const convertCurrency = (value, oldUnit, newUnit) => {
	if (oldUnit === newUnit) return value;
	return money.fx
		.convert(Number(value), { from: oldUnit, to: newUnit })
		.toFixed(2);
};

module.exports = {
	convert,
	lengthUnits,
	weightUnits,
	currencyUnits,
	volumeUnits,
	baseUnits
};
