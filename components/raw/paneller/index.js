import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { CommonButton } from 'themes/mastodon-go/components';

import './style.scss';

//  Component definition.
export default class RawPaneller extends React.Component {  //  Impure

  //  Our constructor.
  constructor (props) {
    super(props);
    const { '🎛': { menu } } = this.props;

    //  State.
    this.state = { storedHash: '#' };

    //  Function binding.
    const {
      getPassableProps,
      setHash,
    } = Object.getPrototypeOf(this);
    this.clicks = [setHash.bind(this, '#')].concat(menu ? menu.map(
      item => setHash.bind(this, item.hash)
    ) : []);
    this.getPassableProps = getPassableProps.bind(this);
    this.setHash = setHash.bind(this);
  }

  //  If our component is suddenly no longer the active route, we need
  //  to store its hash value before it disappears.
  componentWillReceiveProps (nextProps) {
    const {
      activeRoute,
      hash,
    } = this.props;
    if (activeRoute && !nextProps.activeRoute) {
      this.setState({ storedHash: hash });
    }
  }

  //  This gets the props we can pass to children.
  getPassableProps () {
    const { setHash } = this;
    const {
      activeRoute,
      className,
      children,  //  Panelled components must not have children
      hash,
      history,
      ℳ: messages,
      '🎛': config,
      '🏪': store,
      '💪': handler,
      ...rest
    } = this.props;
    return {
      activeRoute,
      history,
      ...rest,
      rehash: setHash,
      ℳ: messages,
      '🏪': store,
      '💪': handler,
    };
  }

  //  This is a tiny function to update our hash if needbe.
  setHash (hash) {
    const { activeRoute } = this.props;
    if (!activeRoute) {
      this.setState({ storedHash: hash });
    }
  }

  render () {
    const {
      clicks,
      getPassableProps,
    } = this;
    const {
      activeRoute,
      className,
      hash,
      history,
      ℳ,
      '🎛': {
        backdrop,
        className: panellerClassName,
        icon,
        menu,
        panels,
        suppressTitle,
        title,
      },
    } = this.props;
    const { storedHash } = this.state;
    const computedClass = classNames('CONNECT--PANELLER', panellerClassName, { titled: title && !suppressTitle }, className);

    const computedHash = activeRoute ? hash : storedHash;

    const panel = function () {
      let panelHash;
      if (!panels) {
        return null;
      }
      for (panelHash in panels) {
        if (computedHash === '#' + panelHash) {
          return panels[panelHash];
        }
      }
      return null;
    }();

    return (
      <div className={computedClass}>
        <nav>
          {icon ? (
            <CommonButton
              active={!computedHash || computedHash === '#'}
              destination={activeRoute ? '#' : null}
              history={history}
              icon='arrow-left'
              onClick={!activeRoute ? clicks[0] : null}
              title={typeof title === 'function' ? title(getPassableProps()) : '' + title}
            />
          ) : null}
          {(typeof menu === 'function' ? menu(getPassableProps()) : menu || []).map(
            (item, index) => (
              <CommonButton
                active={item.active !== void 0 ? item.active : item.hash && computedHash === item.hash}
                destination={function () {
                  if (item.destination) {
                    return item.destination;
                  }
                  return item.hash && activeRoute ? item.hash : null;
                }()}
                history={history}
                icon={item.icon}
                key={index}
                onClick={!item.destination && !activeRoute ? clicks[index + 1] : null}
                title={item.title}
              />
            )
          )}
          {activeRoute ? function () {
            switch (true) {
            case computedHash && computedHash !== '#' && !!ℳ['⬅']:
              return (
                <CommonButton
                  className='close'
                  destination='#'
                  history={history}
                  icon='arrow-left'
                  title={ℳ['⬅']}
                />
              );
            case !!ℳ['❌']:
              return (
                <CommonButton
                  className='close'
                  destination='/start'
                  history={history}
                  icon='times'
                  title={ℳ['❌']}
                />
              );
            default:
              return null;
            }
          }() : null}
        </nav>
        {title && !suppressTitle ? (
          <header aria-hidden={!!panel}>
            <h1>{typeof title === 'function' ? title(getPassableProps()) : '' + title}</h1>
          </header>
        ) : null}
        <div class='panel'>
          {panel ? React.createElement(panel, getPassableProps()) : null}
        </div>
        <div aria-hidden={!!panel}>
          {backdrop ? React.createElement(backdrop, getPassableProps()) : null}
        </div>
      </div>
    );
  }

}

RawPaneller.propTypes = {
  activeRoute: PropTypes.bool,
  children: PropTypes.any,  //  …but it will be ignored
  className: PropTypes.string,
  hash: PropTypes.string,
  history: PropTypes.object,
  ℳ: PropTypes.func,
  '🎛': PropTypes.shape({
    backdrop: PropTypes.oneOfType(PropTypes.string, PropTypes.func),
    className: PropTypes.string,
    icon: PropTypes.string,
    menu: PropTypes.arrayOf(PropTypes.shape({
      active: PropTypes.bool,
      destination: PropTypes.string,
      hash: PropTypes.string,
      icon: PropTypes.string.isRequired,
      title: PropTypes.string,
    })),
    panels: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.func])),
    suppressTitle: PropTypes.bool,
    title: PropTypes.oneOfType(PropTypes.string, PropTypes.func),
  }).isRequired,
  '🏪': PropTypes.object,
  '💪': PropTypes.objectOf(PropTypes.func),
};
