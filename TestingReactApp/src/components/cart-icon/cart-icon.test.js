import React from 'react';
import {shallow} from 'enzyme';
import CartIcon from './cart-icon.component';

describe('CartIcon component', () => {
  let setCartHidden;

  beforeEach(() => {
    setCartHidden = jest.fn();
  });

  it('should render CartIcon component', () => {
    const wrapper = shallow(<CartIcon cartItems={[]} hidden={true} setCartHidden={setCartHidden}/>);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render count 0 if empty items ', () => {
    const wrapper = shallow(<CartIcon cartItems={[]} hidden={true} setCartHidden={setCartHidden}/>);
    expect(wrapper.find('.item-count').text()).toBe("0");
  });

  it('should render count 4 if items ', () => {
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
    const wrapper = shallow(<CartIcon cartItems={cartItems} hidden={true} setCartHidden={setCartHidden}/>);
    expect(wrapper.find('.item-count').text()).toBe("4");
  });

  it('should call setCartHidden if clicked ', () => {
    const wrapper = shallow(<CartIcon cartItems={[]} hidden={true} setCartHidden={setCartHidden}/>);
    wrapper.find('.cart-icon').simulate('click');
    expect(setCartHidden).toHaveBeenCalled();
  });

});
