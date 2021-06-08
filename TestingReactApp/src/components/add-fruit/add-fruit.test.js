import React from 'react';
import {shallow} from 'enzyme';

import AddFruit from './add-fruit.component';

describe('AddFruit component', () => {
  let wrapper;
  let mockMatch;
  let mockHistory;
  const mockRouteName = '/';
  let mockSubmitForm;

  beforeEach(() => {
    mockMatch = {
      path: '/add-fruit'
    };

    mockHistory = {
      push: jest.fn()
    };

    mockSubmitForm = jest.fn()

    const mockProps = {
      match: mockMatch,
      history: mockHistory,
      routeName: mockRouteName
    };

    wrapper = shallow(<AddFruit {...mockProps} />);
  });

  it('should render AddFruit component', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
