# mongoose-validatorjs
Validators for Mongoose schemas using [validator.js](https://github.com/chriso/validator.js)

[![Build Status](https://travis-ci.org/evyros/mongoose-validatorjs.svg?branch=master)](https://travis-ci.org/evyros/mongoose-validatorjs)
[![Dependency Status](https://www.versioneye.com/user/projects/593d31300fb24f0058fe07ad/badge.svg)](https://www.versioneye.com/user/projects/593d31300fb24f0058fe07ad)
[![Coverage Status](https://coveralls.io/repos/github/evyros/mongoose-validatorjs/badge.svg?branch=master)](https://coveralls.io/github/evyros/mongoose-validatorjs?branch=master)

## Installation
```npm install mongoose-validatorjs --save```

## Usage example
##### ES6
```javascript
import MongooseValidatorjs from 'mongoose-validatorjs';
```
##### ES2015
```javascript
var MongooseValidatorjs = require('mongoose-validatorjs');
```
then...
```javascript
const UserSchema = new mongoose.Schema({
    email: { type: String, default: null },
    username: { type: String, default: null }
});

const validate = new MongooseValidatorjs(UserSchema);
validate.field('email').required().isEmail();
validate.field('username').isAlphanumeric();
```
You can chain as many validators as you need. That simple!



## Required fields
validator.js will always pass a validation if the field is `null`, `undefined` or empty string.

Use ```required()``` to prevent this behavior.



## Validators

This module utilises [validator.js](https://github.com/chriso/validator.js) so the API is pretty much the same.
For your convenience, here is the official docs, modified according to the use of this package:

- **contains(seed)** - check if the string contains the seed.
- **equals(comparison)** - check if the string matches the comparison.
- **isAfter([date])** - check if the string is a date that's after the specified date (defaults to now).
- **isAlpha([locale])** - check if the string contains only letters (a-zA-Z). Locale is one of `['ar', 'ar-AE', 'ar-BH', 'ar-DZ', 'ar-EG', 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-LB', 'ar-LY', 'ar-MA', 'ar-QA', 'ar-QM', 'ar-SA', 'ar-SD', 'ar-SY', 'ar-TN', 'ar-YE', 'cs-CZ', 'da-DK', 'de-DE', 'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-US', 'en-ZA', 'en-ZM', 'es-ES', 'fr-FR', 'hu-HU', 'nl-NL', 'pl-PL', 'pt-BR', 'pt-PT', 'ru-RU', 'sr-RS', 'sr-RS@latin', 'tr-TR', 'uk-UA']`) and defaults to `en-US`.
- **isAlphanumeric([locale])** - check if the string contains only letters and numbers. Locale is one of `['ar', 'ar-AE', 'ar-BH', 'ar-DZ', 'ar-EG', 'ar-IQ', 'ar-JO', 'ar-KW', 'ar-LB', 'ar-LY', 'ar-MA', 'ar-QA', 'ar-QM', 'ar-SA', 'ar-SD', 'ar-SY', 'ar-TN', 'ar-YE', 'cs-CZ', 'da-DK', 'de-DE', 'en-AU', 'en-GB', 'en-HK', 'en-IN', 'en-NZ', 'en-US', 'en-ZA', 'en-ZM', 'es-ES', 'fr-FR', 'fr-BE', 'hu-HU', 'nl-BE', 'nl-NL', 'pl-PL', 'pt-BR', 'pt-PT', 'ru-RU', 'sr-RS', 'sr-RS@latin', 'tr-TR', 'uk-UA']`) and defaults to `en-US`.
- **isAscii()** - check if the string contains ASCII chars only.
- **isBase64()** - check if a string is base64 encoded.
- **isBefore([date])** - check if the string is a date that's before the specified date.
- **isBoolean()** - check if a string is a boolean.
- **isByteLength(options)** - check if the string's length (in UTF-8 bytes) falls in a range. `options` is an object which defaults to `{min:0, max: undefined}`.
- **isCreditCard()** - check if the string is a credit card.
- **isCurrency(options)** - check if the string is a valid currency amount. `options` is an object which defaults to `{symbol: '$', require_symbol: false, allow_space_after_symbol: false, symbol_after_digits: false, allow_negatives: true, parens_for_negatives: false, negative_sign_before_digits: false, negative_sign_after_digits: false, allow_negative_sign_placeholder: false, thousands_separator: ',', decimal_separator: '.', allow_space_after_digits: false }`.
- **isDataURI()** - check if the string is a [data uri format](https://developer.mozilla.org/en-US/docs/Web/HTTP/data_URIs).
- **isDecimal()** - check if the string represents a decimal number, such as 0.1, .3, 1.1, 1.00003, 4.0, etc.
- **isDivisibleBy(number)** - check if the string is a number that's divisible by another.
- **isEmail([options])** - check if the string is an email. `options` is an object which defaults to `{ allow_display_name: false, require_display_name: false, allow_utf8_local_part: true, require_tld: true }`. If `allow_display_name` is set to true, the validator will also match `Display Name <email-address>`. If `require_display_name` is set to true, the validator will reject strings without the format `Display Name <email-address>`. If `allow_utf8_local_part` is set to false, the validator will not allow any non-English UTF8 character in email address' local part. If `require_tld` is set to false, e-mail addresses without having TLD in their domain will also be matched.
- **isEmpty()** - check if the string has a length of zero.
- **isFQDN([options])** - check if the string is a fully qualified domain name (e.g. domain.com). `options` is an object which defaults to `{ require_tld: true, allow_underscores: false, allow_trailing_dot: false }`.
- **isFloat([options])** - check if the string is a float. `options` is an object which can contain the keys `min`, `max`, `gt`, and/or `lt` to validate the float is within boundaries (e.g. `{ min: 7.22, max: 9.55 }`). `min` and `max` are equivalent to 'greater or equal' and 'less or equal', respectively while `gt` and `lt` are their strict counterparts.
- **isFullWidth()** - check if the string contains any full-width chars.
- **isHalfWidth()** - check if the string contains any half-width chars.
- **isHexColor()** - check if the string is a hexadecimal color.
- **isHexadecimal()** - check if the string is a hexadecimal number.
- **isIP([version])** - check if the string is an IP (version 4 or 6).
- **isISBN([version])** - check if the string is an ISBN (version 10 or 13).
- **isISSN([options])** - check if the string is an [ISSN](https://en.wikipedia.org/wiki/International_Standard_Serial_Number). `options` is an object which defaults to `{ case_sensitive: false, require_hyphen: false }`. If `case_sensitive` is true, ISSNs with a lowercase `'x'` as the check digit are rejected.
- **isISIN()** - check if the string is an [ISIN][ISIN] (stock/security identifier).
- **isISO8601()** - check if the string is a valid [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date.
- **isIn(values)** - check if the string is in a array of allowed values.
- **isInt([options])** - check if the string is an integer. `options` is an object which can contain the keys `min` and/or `max` to check the integer is within boundaries (e.g. `{ min: 10, max: 99 }`). `options` can also contain the key `allow_leading_zeroes`, which when set to false will disallow integer values with leading zeroes (e.g. `{ allow_leading_zeroes: false }`). Finally, `options` can contain the keys `gt` and/or `lt` which will enforce integers being greater than or less than, respectively, the value provided (e.g. `{gt: 1, lt: 4}` for a number between 1 and 4).
- **isJSON()** - check if the string is valid JSON (note: uses JSON.parse).
- **isLength(options)** - check if the string's length falls in a range. `options` is an object which defaults to `{min:0, max: undefined}`. Note: this function takes into account surrogate pairs.
- **isLowercase()** - check if the string is lowercase.
- **isMACAddress()** - check if the string is a MAC address.
- **isMD5()** - check if the string is a MD5 hash.
- **isMobilePhone(locale)** - check if the string is a mobile phone number, (locale is one of `['ar-DZ', 'ar-SA', 'ar-SY', 'cs-CZ', 'de-DE', 'da-DK', 'el-GR', 'en-AU', 'en-GB', 'en-HK', 'en-IN',  'en-NG', 'en-NZ', 'en-US', 'en-CA', 'en-ZA', 'en-ZM', 'es-ES', 'en-PK', 'fi-FI', 'fr-FR', 'he-IL', 'hu-HU', 'it-IT', 'ja-JP', 'ms-MY', 'nb-NO', 'nn-NO', 'pl-PL', 'pt-PT', 'ro-RO', 'ru-RU', 'sr-RS', 'tr-TR', 'vi-VN', 'zh-CN', 'zh-HK', 'zh-TW']`).
- **isMongoId()** - check if the string is a valid hex-encoded representation of a [MongoDB ObjectId][mongoid].
- **isMultibyte()** - check if the string contains one or more multibyte chars.
- **isNumeric()** - check if the string contains only numbers.
- **isSurrogatePair()** - check if the string contains any surrogate pairs chars.
- **isURL([options])** - check if the string is an URL. `options` is an object which defaults to `{ protocols: ['http','https','ftp'], require_tld: true, require_protocol: false, require_host: true, require_valid_protocol: true, allow_underscores: false, host_whitelist: false, host_blacklist: false, allow_trailing_dot: false, allow_protocol_relative_urls: false }`.
- **isUUID([version])** - check if the string is a UUID (version 3, 4 or 5).
- **isUppercase()** - check if the string is uppercase.
- **isVariableWidth()** - check if the string contains a mixture of full and half-width chars.
- **isWhitelisted(chars)** - checks characters if they appear in the whitelist.
- **matches(pattern)** - check if string matches the pattern. `matches(/foo/i)` .


## Custom validator
You can also add a custom validator of your own.
Just chain `custom()`, see example:
```javascript
validate.field('hobbies').custom((value) => {
  return value.length > 3;
});
```
Note: you can pass a second argument to `custom()` to make a custom error message.
See examples below.


## Custom error messages
Set a custom error message to be used when the validator fails.
If you don't set it, mongoose-validatorjs will use its corresponding default.
Enhanced message templating is supported by giving the ability to use the validator arguments. You can use these like `{ARGS[argument index position]}`.

```javascript
validate.field('email')
	.required({message: 'Cannot be blank'});
```
```javascript
validate.field('username')
	.contains('user_', {message: 'The prefix {ARGS[0]} is missing'});
```
Note: You can use `{ARGS[0]}` even if your arguments is an object or string.



## NPM scripts
- **`npm test`** - run unit tests
- **`npm run lint`** - run eslint
- **`npm run build`** - build the project, using babel

