'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = chaiJestDiff;

var _jestDiff = require('jest-diff');

var _jestDiff2 = _interopRequireDefault(_jestDiff);

var _jestMatcherUtils = require('jest-matcher-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function chaiJestDiff() {
  var expand = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  return function (_chai, _ref) {
    var flag = _ref.flag,
        eql = _ref.eql;

    var Assertion = _chai.Assertion;

    var assertEqual = createAssertion({
      deepPassAssert: 'eql',
      expand: expand,
      flag: flag,
      kind: 'equal',
      name: 'assertEqual',
      passFx: function passFx(a, b) {
        return a === b;
      }
    });
    Assertion.addMethod('equal', assertEqual);
    Assertion.addMethod('equals', assertEqual);
    Assertion.addMethod('eq', assertEqual);

    var assertEql = createAssertion({
      expand: expand,
      flag: flag,
      kind: 'deep equal',
      name: 'assertEql',
      passFx: eql
    });
    Assertion.addMethod('eql', assertEql);
    Assertion.addMethod('eqls', assertEql);

    Assertion.overwriteMethod('members', createMethodWrapper(expand, function (assertion) {
      var chainedFlags = [flag(assertion, 'contains') ? 'include' : 'have'];
      if (flag(assertion, 'ordered')) {
        chainedFlags.push('ordered');
      }
      if (flag(assertion, 'deep')) {
        chainedFlags.push('deep');
      }
      chainedFlags.push('members');

      return chainedFlags.join('.');
    }));
  };
}

function buildMessage(_ref2) {
  var expected = _ref2.expected,
      received = _ref2.received,
      hintParam = _ref2.hintParam,
      introSuffix = _ref2.introSuffix,
      showDiff = _ref2.showDiff,
      expand = _ref2.expand;

  var diffString = showDiff ? (0, _jestDiff2.default)(expected, received, { expand: expand }) : null;

  return (0, _jestMatcherUtils.matcherHint)(hintParam) + '\n\n' + ('Expected value ' + introSuffix + ':\n') + ('  ' + (0, _jestMatcherUtils.printExpected)(expected) + '\n') + 'Received:\n' + ('  ' + (0, _jestMatcherUtils.printReceived)(received)) + (diffString ? '\n\nDifference:\n\n' + diffString : '');
}

function createAssertion(_ref3) {
  var deepPassAssert = _ref3.deepPassAssert,
      expand = _ref3.expand,
      flag = _ref3.flag,
      kind = _ref3.kind,
      name = _ref3.name,
      passFx = _ref3.passFx;

  var result = function syntheticAssert(expected, msg) {
    if (msg) {
      flag(this, 'message', msg);
    }
    if (deepPassAssert && flag(this, 'deep')) {
      return this[deepPassAssert](expected);
    }

    var received = flag(this, 'object');
    var pass = passFx(received, expected);
    var hintSegment = kind.replace(/\s+/, '.');
    var message = pass ? buildMessage({ expected: expected, received: received, hintParam: '.not.to.' + hintSegment, introSuffix: 'not to ' + kind, expand: expand }) : buildMessage({ expected: expected, received: received, hintParam: '.to.' + hintSegment, introSuffix: 'to ' + kind, showDiff: true, expand: expand });

    this.assert(pass, message, message, expected, received, false);
  };

  result.displayName = name;

  return result;
}

function createMethodWrapper(expand, buildHint) {
  return function wrapMethod(_super) {
    return function wrappedAssertion() {
      var _this = this;

      var fauxThis = Object.create(this);
      fauxThis.assert = function (pass, failMsg, failNegateMsg, expected, received, showDiff) {
        var hintParam = '.to.' + buildHint(_this);
        failMsg = buildMessage({ expected: expected, received: received, hintParam: hintParam, introSuffix: cleanChaiMessage(failMsg), expand: expand, showDiff: showDiff });
        failNegateMsg = buildMessage({ expected: expected, received: received, hintParam: '.not' + hintParam, introSuffix: cleanChaiMessage(failNegateMsg), expand: expand, showDiff: showDiff });
        _this.assert(pass, failMsg, failNegateMsg, expected, received, showDiff);
      };

      _super.apply(fauxThis, arguments);
    };
  };
}

function cleanChaiMessage(message) {
  return message.replace(/#{this}/g, 'value').replace(/^Expected (value )?/i, '').replace(/( as)? #{exp}$/, '');
}