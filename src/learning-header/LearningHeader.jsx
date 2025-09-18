import React, { useContext } from 'react';
import Responsive from 'react-responsive';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';

import AnonymousUserMenu from './AnonymousUserMenu';
import AuthenticatedUserDropdown from './AuthenticatedUserDropdown';
import LogoSlot from '../plugin-slots/LogoSlot';
import CourseInfoSlot from '../plugin-slots/CourseInfoSlot';
import { courseInfoDataShape } from './LearningHeaderCourseInfo';
import messages from './messages';
import LearningHelpSlot from '../plugin-slots/LearningHelpSlot';
import ThemeToggleButton from '../ThemeToggleButton';

const LearningHeader = ({
  courseOrg, courseNumber, courseTitle, intl, showUserDropdown,
}) => {
  const { authenticatedUser } = useContext(AppContext);

  const headerLogo = (
    <LogoSlot
      href={`${getConfig().LMS_BASE_URL}/dashboard`}
      src={getConfig().LOGO_URL}
      alt={getConfig().SITE_NAME}
    />
  );

  return (
    <header className="learning-header customise indigo-header-version">
      <a className="sr-only sr-only-focusable" href="#main-content">{intl.formatMessage(messages.skipNavLink)}</a>
      <div className="container-xl py-2 d-flex align-items-center">
        {showUserDropdown && authenticatedUser && (
          <Responsive maxWidth={991}>
            <AuthenticatedUserDropdown
              username={authenticatedUser.username}
              displayname={authenticatedUser.displayname}
            />
          </Responsive>
        )}
        {headerLogo}
        <div className="flex-grow-1 course-title-lockup d-flex" style={{ lineHeight: 1 }}>
          <CourseInfoSlot courseOrg={courseOrg} courseNumber={courseNumber} courseTitle={courseTitle} />
          <div className="nav-course">
            <a href={`${getConfig().LMS_BASE_URL}/dashboard`}>
              {intl.formatMessage(messages.mycourses)}
            </a>
          </div>
          <div className="nav-course">
            <a href={`${getConfig().LMS_BASE_URL}/courses`}>
              {intl.formatMessage(messages.discover)}
            </a>
          </div>
        </div>
        <ThemeToggleButton />
        {showUserDropdown && authenticatedUser && (
          <>
            <LearningHelpSlot />
            <Responsive minWidth={992}>
              <AuthenticatedUserDropdown
                username={authenticatedUser.username}
                displayname={authenticatedUser.displayname}
              />
            </Responsive>
          </>
        )}
        {showUserDropdown && !authenticatedUser && (
        <AnonymousUserMenu />
        )}
      </div>
    </header>
  );
};

LearningHeader.propTypes = {
  courseOrg: courseInfoDataShape.courseOrg,
  courseNumber: courseInfoDataShape.courseNumber,
  courseTitle: courseInfoDataShape.courseTitle,
  intl: intlShape.isRequired,
  showUserDropdown: PropTypes.bool,
};

LearningHeader.defaultProps = {
  courseOrg: null,
  courseNumber: null,
  courseTitle: null,
  showUserDropdown: true,
};

export default injectIntl(LearningHeader);
