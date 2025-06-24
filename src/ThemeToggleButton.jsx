import React, { useState } from 'react';
import { getConfig } from '@edx/frontend-platform';
import Cookies from 'universal-cookie';
import { Icon } from '@openedx/paragon';
import { WbSunny, Nightlight } from '@openedx/paragon/icons';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import messages from './Header.messages';

const themeCookie = 'indigo-toggle-dark';
const themeCookieExpiry = 90; // days

const ThemeToggleButton = ({ intl }) => {
  const [isDarkThemeEnabled, setIsDarkThemeEnabled] = useState(false);
  const cookies = new Cookies();
  const isThemeToggleEnabled = getConfig().INDIGO_ENABLE_DARK_TOGGLE;

  const getCookieExpiry = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() + themeCookieExpiry);
  };

  const getCookieOptions = (serverURL) => ({ domain: serverURL.hostname, path: '/', expires: getCookieExpiry() });

  const addDarkThemeToIframes = () => {
    const iframes = document.getElementsByTagName('iframe');
    const iframesLength = iframes.length;
    if (iframesLength > 0) {
      Array.from({ length: iframesLength }).forEach((_, ind) => {
        const style = document.createElement('style');
        style.textContent = `
          body{
            background-color: #0D0D0E;
            color: #ccc;
          }
          a {color: #ccc;}
          a:hover{color: #d3d3d3;}
          `;
        if (iframes[ind].contentDocument) { iframes[ind].contentDocument.head.appendChild(style); }
      });
    }
  };

  const removeDarkThemeFromiframes = () => {
    const iframes = document.getElementsByTagName('iframe');
    const iframesLength = iframes.length;

    Array.from({ length: iframesLength }).forEach((_, ind) => {
      if (iframes[ind].contentDocument) {
        const iframeHead = iframes[ind].contentDocument.head;
        const styleTag = Array.from(iframeHead.querySelectorAll('style')).find(
          (style) => style.textContent.includes('background-color: #0D0D0E;') && style.textContent.includes('color: #ccc;'),
        );
        if (styleTag) {
          styleTag.remove();
        }
      }
    });
  };

  const onToggleTheme = () => {
    const serverURL = new URL(getConfig().LMS_BASE_URL);
    let theme = '';

    if (cookies.get(themeCookie) === 'dark') {
      document.body.classList.remove('indigo-dark-theme');
      removeDarkThemeFromiframes();
      setIsDarkThemeEnabled(false);
      theme = 'light';
    } else {
      document.body.classList.add('indigo-dark-theme');
      addDarkThemeToIframes();
      setIsDarkThemeEnabled(true);
      theme = 'dark';
    }
    cookies.set(themeCookie, theme, getCookieOptions(serverURL));

    const learningMFEUnitIframe = document.getElementById('unit-iframe');
    if (learningMFEUnitIframe) {
      learningMFEUnitIframe.contentWindow.postMessage({ 'indigo-toggle-dark': theme }, serverURL.origin);
    }
  };

  const hanldeKeyUp = (event) => {
    if (event.key === 'Enter') {
      onToggleTheme();
    }
  };

  if (!isThemeToggleEnabled) {
    return <div />;
  }

  return (
    <div className="theme-toggle-button">
      <div className="light-theme-icon"><Icon src={WbSunny} /></div>
      <div className="toggle-switch">
        <label htmlFor="theme-toggle-checkbox" className="switch">
          <input id="theme-toggle-checkbox" defaultChecked={cookies.get(themeCookie) === 'dark'} onChange={onToggleTheme} onKeyUp={hanldeKeyUp} type="checkbox" title={intl.formatMessage(messages['header.user.theme'])} />
          <span className="slider round" />
          <span id="theme-label" className="sr-only">{`Switch to ${isDarkThemeEnabled ? 'Light' : 'Dark'} Mode`}</span>
        </label>
      </div>
      <div className="dark-theme-icon"><Icon src={Nightlight} /></div>
    </div>
  );
};

ThemeToggleButton.propTypes = {
  // i18n
  intl: intlShape.isRequired,
};

export default injectIntl(ThemeToggleButton);
