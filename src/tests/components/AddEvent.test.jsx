import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import expect from 'expect';

const $ = require('jquery');

import { AddEvent } from '../../features/app/components/event/AddEvent';

describe('AddEvent', () => {
  it('should exist', () => {
    expect(AddEvent).toExist();
  });

  // it('should call onAddTodo prop with valid data', () => {
  //   var todoText = 'Check mail';
  //   var spy = expect.createSpy();
  //   var addTodo = TestUtils.renderIntoDocument(<AddTodo onAddTodo={spy}/>);
  //   var $el = $(ReactDOM.findDOMNode(addTodo));
  //
  //   addTodo.refs.todoText.value = todoText;
  //   TestUtils.Simulate.submit($el.find('form')[0]);
  //
  //   expect(spy).toHaveBeenCalledWith(todoText);
  // });
  //
  // it('should not call onAddTodo prop when invalid input', () => {
  //   var todoText = '';
  //   var spy = expect.createSpy();
  //   var addTodo = TestUtils.renderIntoDocument(<AddTodo onAddTodo={spy}/>);
  //   var $el = $(ReactDOM.findDOMNode(addTodo));
  //
  //   addTodo.refs.todoText.value = todoText;
  //   TestUtils.Simulate.submit($el.find('form')[0]);
  //
  //   expect(spy).toNotHaveBeenCalled();
  // });
});
