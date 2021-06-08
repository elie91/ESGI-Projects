import React from 'react';
import {shallow, mount} from 'enzyme';

import Cart from './cart.component';
import EditFruit from "../edit-fruit/edit-fruit";

describe('Cart component', () => {

  let wrapper;
  let mockProps;
  let mockCart;
  let mockHandleDelete;

  beforeEach(() => {
    mockCart = [
      {
        '@id': "/fruits/14",
        '@type': "Fruit",
        cartFruits: [],
        id: 14,
        name: "test"
      },
      {
        '@id': "/fruits/15",
        '@type': "Fruit",
        cartFruits: [],
        id: 15,
        name: "toto"
      }
    ]

    mockHandleDelete = jest.fn();

    mockProps = {
      cart: mockCart,
      handleDelete: mockHandleDelete
    };

    wrapper = shallow(<Cart {...mockProps} />)
  });


  it('should render Cart component', () => {
    expect(wrapper).toMatchSnapshot();
  });


});
