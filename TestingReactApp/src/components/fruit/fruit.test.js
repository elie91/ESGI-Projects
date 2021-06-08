import React from 'react';
import {shallow} from 'enzyme';
import Fruit from './fruit.component';

describe('Fruit component', () => {
  let wrapper;
  let mockAddToCart;
  let mockhHandleDelete;
  const fruit = {id: 1, name: 'poire'};
  const mockItems = [];

  beforeEach(() => {
    mockAddToCart = jest.fn();
    mockhHandleDelete = jest.fn();

    const mockProps = {
      fruit,
      cartItems: mockItems,
      addToCart: mockAddToCart,
      handleDelete: mockhHandleDelete
    };

    wrapper = shallow(<Fruit {...mockProps} />);
  });

  it('should render Fruit component', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render fruit name as a prop ', () => {
    expect(wrapper.find('.fruit-title').text()).toBe(fruit.name);
  });

  it('should call addToCart when button clicked', () => {
    wrapper.find('.btn-add').simulate('click');
    expect(mockAddToCart).toHaveBeenCalled();
  });

  it('should call handleDelete when button clicked', () => {
    wrapper.find('.btn-delete').simulate('click');
    expect(mockhHandleDelete).toHaveBeenCalled();
  });
});
