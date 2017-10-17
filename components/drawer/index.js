//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  defineMessages,
  FormattedMessage,
} from 'react-intl';

//  Component imports.
import DrawerComposer from './composer';
import DrawerMenu from './menu';
import DrawerPanel from './panel';

//  Common imports.
import { CommonPaneller } from 'themes/mastodon-go/components';

//  Stylesheet imports.
import './style';

//  Other imports.
import { Emojifier } from 'themes/mastodon-go/util/emojify';

//  * * * * * * *  //

//  Initial setup
//  -------------

//  Holds our localization messages.
const messages = defineMessages({
  drawer: {
    defaultMessage: 'Compose',
    id: 'drawer.drawer',
  },
  search: {
    defaultMessage: 'Search',
    id: 'drawer.search',
  },
});

//  * * * * * * *  //

//  The component
//  -------------

//  Component definition.
export default class Drawer extends React.PureComponent {

  //  Props.
  static propTypes = {
    activeRoute: PropTypes.bool,
    className: PropTypes.string,
    hash: PropTypes.string,
    history: PropTypes.object,
    '🛄': PropTypes.shape({ intl: PropTypes.object.isRequired }).isRequired,
    '💪': PropTypes.objectOf(PropTypes.func),
    '🏪': PropTypes.shape({
      defaultVisibility: PropTypes.number,
      emojos: ImmutablePropTypes.list.isRequired,
      me: PropTypes.string,
      results: PropTypes.map,
    }).isRequired,
  }
  state = { storedHash: '#' };
  emoji = (
    new Emojifier(this.props['🏪'].emojos && this.props['🏪'].emojos.toJS() || [])
  ).emoji;

  //  If our component is suddenly no longer the active route, we need
  //  to store its hash value before it disappears.  We also check for
  //  the unlikely event of changes to our `emojos`.
  componentWillReceiveProps (nextProps) {
    const {
      activeRoute,
      hash,
      '🏪': { emojos },
    } = this.props;
    if (activeRoute && !nextProps.activeRoute) {
      this.setState({ storedHash: hash });
    }
    if (emojos !== nextProps['🏪'].emojos) {
      this.emoji = (
        new Emojifier(nextProps['🏪'].emojos && nextProps['🏪'].emojos.toJS() || [])
      ).emoji;
    }
  }

  //  This is a tiny function to update our hash if needbe.
  handleSetHash = hash => {
    const { activeRoute } = this;
    if (!activeRoute) {
      this.setState({ storedHash: hash });
    }
  }

  //  Rendering.
  render () {
    const {
      emoji,
      handleSetHash,
    } = this;
    const {
      activeRoute,
      className,
      hash,
      history,
      '🛄': { intl },
      '💪': {
        submit,
        upload,
      },
      '🏪': {
        defaultVisibility,
        me,
        results,
      },
      ...rest
    } = this.props;
    const { storedHash } = this.state;
    const computedClass = classNames('MASTODON_GO--DRAWER', className);

    //  We only use our internal hash if this isn't the active route.
    const computedHash = activeRoute ? hash : storedHash;

    return (
      <CommonPaneller
        className={computedClass}
        menu={
          <DrawerMenu
            activeRoute={activeRoute}
            hash={computedHash}
            history={history}
            intl={intl}
            onSetHash={handleSetHash}
          />
        }
        panel={
          <DrawerPanel
            hash={computedHash}
            intl={intl}
            results={results}
          />
        }
        title={<FormattedMessage {...messages.drawer} />}
        {...rest}
      >
        <DrawerComposer
          defaultVisibility={defaultVisibility}
          emoji={emoji}
          intl={intl}
          me={me}
          onSubmit={submit}
          onUpload={upload}
        />
      </CommonPaneller>
    );
  }

}
