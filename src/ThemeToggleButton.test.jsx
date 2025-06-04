/* eslint-disable react/prop-types */
import React from 'react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { render, fireEvent } from '@testing-library/react';
import { getConfig } from '@edx/frontend-platform';
import ThemeToggleButton from './ThemeToggleButton';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

const mockCookiesGet = jest.fn();
const mockCookiesSet = jest.fn();
jest.mock('universal-cookie', () => jest.fn().mockImplementation(() => ({
  get: mockCookiesGet, // Simulate initial light mode
  set: mockCookiesSet,
})));

describe('ThemeToggleButton', () => {
  beforeEach(() => {
    getConfig.mockReturnValue({
      LMS_BASE_URL: 'https://fake.url',
      INDIGO_ENABLE_DARK_TOGGLE: true,
    });

    // Reset body class
    document.body.classList.remove('indigo-dark-theme');
  });

  it('calls onToggleTheme when Enter key is pressed', () => {
    mockCookiesGet.mockReturnValue('light');

    const { container } = render(
      <IntlProvider locale="en" messages={{}}>
        <ThemeToggleButton />
      </IntlProvider>,
    );
    const checkbox = container.querySelector('#theme-toggle-checkbox');
    checkbox.focus();
    fireEvent.keyUp(checkbox, { key: 'Enter' });

    expect(mockCookiesSet).toHaveBeenCalledWith(
      'indigo-toggle-dark',
      'dark',
      expect.objectContaining({
        domain: 'fake.url',
        path: '/',
        expires: expect.any(Date),
      }),
    );
  });
});
