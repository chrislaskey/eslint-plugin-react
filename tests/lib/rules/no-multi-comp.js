/**
 * @fileoverview Prevent multiple component definition per file
 * @author Yannick Croissant
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-multi-comp');
var RuleTester = require('eslint').RuleTester;

var parserOptions = {
  ecmaVersion: 6,
  ecmaFeatures: {
    jsx: true
  }
};

require('babel-eslint');

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('no-multi-comp', rule, {

  valid: [{
    code: [
      'var Hello = require(\'./components/Hello\');',
      'var HelloJohn = React.createClass({',
      '  render: function() {',
      '    return <Hello name="John" />;',
      '  }',
      '});'
    ].join('\r'),
    parserOptions: parserOptions
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}'
    ].join('\r'),
    parserOptions: parserOptions
  }, {
    code: [
      'var Heading = React.createClass({',
      '  render: function() {',
      '    return (',
      '      <div>',
      '        {this.props.buttons.map(function(button, index) {',
      '          return <Button {...button} key={index}/>;',
      '        })}',
      '      </div>',
      '    );',
      '  }',
      '});'
    ].join('\r'),
    parserOptions: parserOptions
  }, {
    code: [
      'export default {',
      '  renderHello() {',
      '    let {name} = this.props;',
      '    return <div>{name}</div>;',
      '  },',
      '  renderHello2() {',
      '    let {name2} = this.props;',
      '    return <div>{name2}</div>;',
      '  }',
      '};'
    ].join('\n'),
    parser: 'babel-eslint'
  }, {
    code: [
      'function Hello(props) {',
      '  return <div>Hello {props.name}</div>;',
      '}',
      'function HelloAgain(props) {',
      '  return <div>Hello again {props.name}</div>;',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    options: [{
      ignoreStateless: true
    }]
  }, {
    code: [
      'function Hello(props) {',
      '  return <div>Hello {props.name}</div>;',
      '}',
      'class HelloJohn extends React.Component {',
      '  render() {',
      '    return <Hello name="John" />;',
      '  }',
      '}'
    ].join('\r'),
    parserOptions: parserOptions,
    options: [{
      ignoreStateless: true
    }]
  }],

  invalid: [{
    code: [
      'var Hello = React.createClass({',
      '  render: function() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '});',
      'var HelloJohn = React.createClass({',
      '  render: function() {',
      '    return <Hello name="John" />;',
      '  }',
      '});'
    ].join('\r'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Declare only one React component per file',
      line: 6
    }]
  }, {
    code: [
      'class Hello extends React.Component {',
      '  render() {',
      '    return <div>Hello {this.props.name}</div>;',
      '  }',
      '}',
      'class HelloJohn extends React.Component {',
      '  render() {',
      '    return <Hello name="John" />;',
      '  }',
      '}',
      'class HelloJohnny extends React.Component {',
      '  render() {',
      '    return <Hello name="Johnny" />;',
      '  }',
      '}'
    ].join('\r'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Declare only one React component per file',
      line: 6
    }, {
      message: 'Declare only one React component per file',
      line: 11
    }]
  }, {
    code: [
      'function Hello(props) {',
      '  return <div>Hello {props.name}</div>;',
      '}',
      'function HelloAgain(props) {',
      '  return <div>Hello again {props.name}</div>;',
      '}'
    ].join('\n'),
    parser: 'babel-eslint',
    errors: [{
      message: 'Declare only one React component per file',
      line: 4
    }]
  }, {
    code: [
      'function Hello(props) {',
      '  return <div>Hello {props.name}</div>;',
      '}',
      'class HelloJohn extends React.Component {',
      '  render() {',
      '    return <Hello name="John" />;',
      '  }',
      '}'
    ].join('\r'),
    parserOptions: parserOptions,
    errors: [{
      message: 'Declare only one React component per file',
      line: 4
    }]
  }]
});
