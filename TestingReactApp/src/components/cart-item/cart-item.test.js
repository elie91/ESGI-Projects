import React from 'react';
import {shallow} from 'enzyme';
import CartItem from './cart-item.component';

describe('CartItem component', () => {
  let cartItem;

  beforeEach(() => {
    cartItem = {
      id: "/fruits/14",
      name: "pomme",
      quantity: 2
    }
  });

  it('should render CartItem component', () => {
    const wrapper = shallow(<CartItem item={cartItem}/>);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render CartItem details', () => {
    const wrapper = shallow(<CartItem item={cartItem}/>);
    expect(wrapper.find('.cart-item__price').text()).toBe('2 x pomme');
  });


});
