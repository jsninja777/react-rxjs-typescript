import React from 'react';
import { render } from '@testing-library/react';
import Dashboard from '../source/Dashboard';
import '@testing-library/jest-dom/extend-expect';

test('render 3 systems', () => {
  const { getByText } = render(<Dashboard />);

  const temperature = getByText(/Temperature/i);
  const airPressure = getByText(/Air Pressure/i);
  const humidity = getByText(/Humidity/i);

  expect(airPressure).toBeInTheDocument();
  expect(temperature).toBeInTheDocument();
  expect(humidity).toBeInTheDocument();
});