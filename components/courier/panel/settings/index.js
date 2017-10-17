/*********************************************************************\
|                                                                     |
|   <CourierPanelSettings>                                            |
|   ======================                                            |
|                                                                     |
|   This panel provides the various courier settings.                 |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {
  defineMessages,
  FormattedMessage,
} from 'react-intl';

//  Container imports.
import { SettingContainer } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  * * * * * * *  //

//  Initial setup
//  -------------

//  Holds our localization messages.
const messages = defineMessages({
  column: {
    defaultMessage: 'Show in column',
    id: 'settings.column_notifs',
  },
  desktop: {
    defaultMessage: 'Desktop notifications',
    id: 'settings.desktop_notifs',
  },
  favourite: {
    defaultMessage: 'Favourites:',
    id: 'settings.favourite_notifs',
  },
  follow: {
    defaultMessage: 'New followers:',
    id: 'settings.follow_notifs',
  },
  mention: {
    defaultMessage: 'Mentions:',
    id: 'settings.mention_notifs',
  },
  reblog: {
    defaultMessage: 'Boosts:',
    id: 'settings.reblog_notifs',
  },
  sound: {
    defaultMessage: 'Play sound',
    id: 'settings.sound_notifs',
  },
});

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default function CourierPanelSettings ({
  className,
  ...rest
}) {
  const computedClass = classNames('MASTODON_GO--COURIER--PANEL--SETTINGS', className);

  //  Rendering.
  return (
    <div
      class={computedClass}
      {...rest}
    >
      {
        //  Follow notification settings.
      }
      <section>
        <h2><FormattedMessage {...messages.follow} /></h2>
        <SettingContainer
          global
          settingKey={['courier', 'alerts', 'follow']}
          type='toggle'
        ><FormattedMessage {...messages.desktop} /></SettingContainer>
        <SettingContainer
          global
          settingKey={['courier', 'shows', 'follow']}
          type='toggle'
        ><FormattedMessage {...messages.column} /></SettingContainer>
        <SettingContainer
          global
          settingKey={['courier', 'sounds', 'follow']}
          type='toggle'
        ><FormattedMessage {...messages.sound} /></SettingContainer>
      </section>
      {
        //  Favourite notification settings.
      }
      <section>
        <h2><FormattedMessage {...messages.favourite} /></h2>
        <SettingContainer
          global
          settingKey={['courier', 'alerts', 'favourite']}
          type='toggle'
        ><FormattedMessage {...messages.desktop} /></SettingContainer>
        <SettingContainer
          global
          settingKey={['courier', 'shows', 'favourite']}
          type='toggle'
        ><FormattedMessage {...messages.column} /></SettingContainer>
        <SettingContainer
          global
          settingKey={['courier', 'sounds', 'favourite']}
          type='toggle'
        ><FormattedMessage {...messages.sound} /></SettingContainer>
      </section>
      {
        //  Mention notification settings.
      }
      <section>
        <h2><FormattedMessage {...messages.mention} /></h2>
        <SettingContainer
          global
          settingKey={['courier', 'alerts', 'follow']}
          type='mention'
        ><FormattedMessage {...messages.desktop} /></SettingContainer>
        <SettingContainer
          global
          settingKey={['courier', 'shows', 'follow']}
          type='mention'
        ><FormattedMessage {...messages.column} /></SettingContainer>
        <SettingContainer
          global
          settingKey={['courier', 'sounds', 'follow']}
          type='mention'
        ><FormattedMessage {...messages.sound} /></SettingContainer>
      </section>
      {
        //  Reblog notification settings.
      }
      <section>
        <h2><FormattedMessage {...messages.reblog} /></h2>
        <SettingContainer
          global
          settingKey={['courier', 'alerts', 'reblog']}
          type='toggle'
        ><FormattedMessage {...messages.desktop} /></SettingContainer>
        <SettingContainer
          global
          settingKey={['courier', 'shows', 'reblog']}
          type='toggle'
        ><FormattedMessage {...messages.column} /></SettingContainer>
        <SettingContainer
          global
          settingKey={['courier', 'sounds', 'reblog']}
          type='toggle'
        ><FormattedMessage {...messages.sound} /></SettingContainer>
      </section>
    </div>
  );
};

//  Props.
CourierPanelSettings.propTypes = { className: PropTypes.string };