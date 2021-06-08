import React from 'react';
import {shallow,} from 'enzyme';
import EditFruit from "./edit-fruit";

describe('EditFruit component', () => {

  let wrapper;
  let mockFruits;
  let mockLocation;
  let mockProps;

  beforeEach(() => {
    mockFruits = [];
    mockLocation = {
      state: {
        fruit: {
          '@id': "/fruits/14",
          '@type': "Fruit",
          cartFruits: [],
          id: 14,
          name: "test"
        }
      }
    }

    mockProps = {
      location: mockLocation,
      fruits: mockFruits
    };

    wrapper = shallow(<EditFruit {...mockProps} />)
  });


  it('should render EditFruit component', () => {
    expect(wrapper).toMatchSnapshot();
  });

});

