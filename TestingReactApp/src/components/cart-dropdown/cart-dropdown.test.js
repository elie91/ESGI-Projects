import React from 'react';
import {shallow, mount} from 'enzyme';

import CartDropdown from './cart-dropdown.component';
import CartItem from "../cart-item/cart-item.component";

describe('CartDropdown component', () => {

  it('should render CartDropdown component', () => {
    const wrapper = shallow(<CartDropdown cartItems={[]}/>);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render CartDropdown component with empty message', () => {
    const wrapper = shallow(<CartDropdown cartItems={[]}/>);
    expect(wrapper.find('.cart__message').text()).toBe('Votre panier est vide')
  });

  it('should render CartDropdown with items ', () => {
    const cartItems = [
      {
        id: "/fruits/14",
        name: "pomme",
        quantity: 2
      },
      {
        id: "/fruits/13",
        name: "tomate",
        quantity: 2
      }
    ];
    const wrapper = mount(<CartDropdown cartItems={cartItems}/>);
    expect(wrapper.find(CartItem).length).toBe(cartItems.length);
    wrapper.unmount();
  });

});
