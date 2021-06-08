import React from 'react';
import {shallow} from 'enzyme';

import Navbar from './navbar.component';

describe('Navbar component', () => {
  it('should render Navbar component', () => {
    const wrapper = shallow(<Navbar />);
    expect(wrapper).toMatchSnapshot();
  });

});
