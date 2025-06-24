import React from 'react';
import {
  authenticatedUser, initializeMockApp, render, screen,
} from '../setupTest';
import { LearningHeader as Header } from '../index';

jest.mock('react-responsive', () => ({
  __esModule: true,
  default: ({ minWidth, maxWidth, children }) => {
    const screenWidth = 1200; // Simulate desktop
    const matchesMin = minWidth !== undefined ? screenWidth >= minWidth : true;
    const matchesMax = maxWidth !== undefined ? screenWidth <= maxWidth : true;
    return matchesMin && matchesMax ? children : null;
  },
}));

describe('Header', () => {
  beforeAll(async () => {
    // We need to mock AuthService to implicitly use `getAuthenticatedUser` within `AppContext.Provider`.
    await initializeMockApp();
  });

  it('displays user button', () => {
    render(<Header />);
    expect(screen.getByText(authenticatedUser.username)).toBeInTheDocument();
  });

  it('displays course data', () => {
    const courseData = {
      courseOrg: 'course-org',
      courseNumber: 'course-number',
      courseTitle: 'course-title',
    };
    render(<Header {...courseData} />);

    expect(screen.getByText(`${courseData.courseOrg} ${courseData.courseNumber}`)).toBeInTheDocument();
    expect(screen.getByText(courseData.courseTitle)).toBeInTheDocument();
  });
});
