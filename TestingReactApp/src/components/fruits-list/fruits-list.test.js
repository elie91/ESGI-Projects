import React from 'react';
import {shallow, mount} from 'enzyme';
import {FruitsList} from "./fruits-list.component";
import Fruit from "../fruit/fruit.component";
import {BrowserRouter} from 'react-router-dom';

describe('FruitList component', () => {

  let wrapper;
  let mockFruits;
  let mockAddToCart;
  let mockHistory;
  let mockProps;

  beforeEach(() => {
    mockFruits = [
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
    mockAddToCart = jest.fn();
    mockHistory = {
      push: jest.fn()
    };

    mockProps = {
      fruits: mockFruits,
      carts: [],
      history: mockHistory,
      title: 'hats',
      cartItems: [],
      addToCart: mockAddToCart
    };

    wrapper = mount(
      <BrowserRouter>
        <FruitsList {...mockProps} />
      </BrowserRouter>
    );
  });

  afterEach(() => {
    wrapper.unmount();
  })

  it('should render FruitList component', () => {
    const wrapper = shallow(<FruitsList fruits={[]} carts={[]} cartItems={[]}/>);
    expect(wrapper).toMatchSnapshot();
  });

  it('sould render Fruit components with title', () => {
    expect(wrapper.find('.mt-3').text()).toBe('Mes fruits')
  });

  it('sould render Fruit components with fruits childs', () => {
    expect(wrapper.find(Fruit).length).toBe(mockFruits.length);
  });


});

