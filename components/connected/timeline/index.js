//  <ConnectedTimeline>
//  ===================

//  This component just pulls a timeline of statuses in from the redux
//  store and renders them in a list.

//  * * * * * * *  //

//  Imports
//  -------

//  Package imports.
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { defineMessages } from 'react-intl';
import { createStructuredSelector } from 'reselect';

//  Component imports.
import {
  CommonList,
  CommonObserveäble,
  CommonTextButton,
  ConnectedStatus,
} from 'flavours/go/components';

//  Lib imports.
import connect from 'flavours/go/lib/connect';
import {
  POST_TYPE,
  connectStream,
  disconnectStream,
  expandTimeline,
  fetchTimeline,
  refreshTimeline,
  removeStatus,
  updateTimeline,
} from 'flavours/go/lib/tootledge';

//  Stylesheet imports.
import './style.scss';

//  * * * * * * *  //

//  Initial setup
//  -------------

//  This function gets our stream name from its path, and whether
//  WebSockets is supported.
function websockify (path) {
  let tag;
  switch (path) {
  case '/ap1/v1/timelines/home':
    return ['user', true];
  case '/api/v1/timelines/public':
    return ['public', true];
  case '/api/v1/timelines/public?local=true':
    return ['public:local', true];
  default:
    if ((tag = (path.match(/\/api\/v1\/timelines\/tag\/([^]*)/) || [])[1])) {
      return [`hashtag&tag=${tag}`, true];
    }
    return [`polling:${path}`, false];
  }
}

//  * * * * * * * //

//  The component
//  -------------

//  Component definition.
class Timeline extends React.Component {  //  Impure

  //  Constructor.
  constructor (props) {
    super(props);
    const { '💪': { fetch } } = this.props;

    //  State.
    this.state = { currentDetail: null };

    //  Function binding.
    const {
      handleDetail,
      handleLoadMore,
    } = Object.getPrototypeOf(this);
    this.handleDetail = handleDetail.bind(this);
    this.handleLoadMore = handleLoadMore.bind(this);

    //  Fetching the timeline.
    fetch();
  }

  //  On mounting and unmounting, we open and close our stream.
  componentWillMount () {
    const { '💪': { connect } } = this.props;
    connect();
  }
  componentWillUnmount () {
    const { '💪': { disconnect } } = this.props;
    disconnect();
  }

  //  If our path is about to change, we need to fetch the new path and
  //  open a new stream.
  componentWillReceiveProps (nextProps) {
    const {
      path,
      '💪': {
        connect,
        disconnect,
        fetch,
      },
    } = this.props;
    if (path !== nextProps.path) {
      fetch(nextProps.path);
      disconnect();
      connect(nextProps.path);
    }
  }

  //  This function sets the currently detailed status in the list.
  handleDetail (id) {
    this.setState({ currentDetail: id });
  }

  //  Loads more.
  handleLoadMore () {
    const { '💪': { expand } } = this.props;
    expand();
  }

  //  Rendering.
  render () {
    const {
      handleDetail,
      handleLoadMore,
    } = this;
    const {
      className,
      ℳ,
      '🏪': {
        isLoading,
        settings,
        statuses,
      },
      '💪': { expand },
    } = this.props;
    const { currentDetail } = this.state;
    const computedClass = classNames('MASTODON_GO--CONNECTED--TIMELINE', className);

    //  If a status in our list has an `id` which matches our
    //  `currentDetail`, we make it detailed.
    return (
      <CommonList
        className={computedClass}
        isLoading={isLoading}
        onScrollToBottom={handleLoadMore}
      >
        {statuses ? statuses.reduce(function (items, status) {
          items.push(
            <ConnectedStatus
              detailed={currentDetail === status.get('id')}
              filterRegex={settings ? settings.getIn(['regex', 'body']) : null}
              hideIf={settings ? (settings.getIn(['shows', 'reblog']) && POST_TYPE.IS_REBLOG) | (settings.getIn(['shows', 'reply']) && POST_TYPE.IS_MENTION) : null}
              id={status.get('id')}
              key={status.get('id')}
              onDetail={handleDetail}
            />
          );
          return items;
        }, []).concat(
          <CommonObserveäble
            key='loadmore'
            searchText={ℳ.loadMore}
          >
            <CommonTextButton
              disabled={isLoading}
              onClick={expand}
            >{ℳ.loadMore}</CommonTextButton>
          </CommonObserveäble>
        ) : null}
      </CommonList>
    );
  }

}

//  Props.
Timeline.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  path: PropTypes.string.isRequired,
  rehash: PropTypes.func,
  title: PropTypes.node,
  ℳ: PropTypes.func.isRequired,
  '🏪': PropTypes.shape({
    isLoading: PropTypes.bool,
    settings: ImmutablePropTypes.map,
    statuses: ImmutablePropTypes.list,
  }).isRequired,
  '💪': PropTypes.objectOf(PropTypes.func).isRequired,
};

//  * * * * * * *  //

//  Connecting
//  ----------

//  Connecting our component.
var ConnectedTimeline = connect(

  //  Component.
  Timeline,

  //  Store.
  createStructuredSelector({
    isLoading: (state, { path }) => state.getIn(['timeline', path, 'isLoading']),
    settings: (state, { path }) => state.getIn([
      'setting',
      'global',
      'timeline',
      path,
    ]),
    statuses: (state, { path }) => state.getIn(['timeline', path, 'statuses']),
  }),

  //  Messages.
  defineMessages({
    loadMore: {
      defaultMessage: 'Load more',
      description: 'Label for the "load more" button on timelines',
      id: 'timeline.load_more',
    },
  }),

  //  Handlers.
  (go, store, { path }) => ({
    connect: function (newPath = path) {
      const [name, withWebSockets] = websockify(newPath);
      if (name === 'user') {
        return;  //  Always connected
      }
      go(connectStream, name, function (data) {
        try {
          switch (data.event) {
          case 'update':
            go(updateTimeline, path, JSON.parse(data.payload));
            break;
          case 'delete':
            go(removeStatus, data.payload);
            break;
          }
        } catch (e) {}
      }, go.use(refreshTimeline, newPath), withWebSockets);
    },
    disconnect: function (newPath = path) {
      const [name] = websockify(newPath);
      if (name === 'user') {
        return;  //  Always connected
      }
      go(disconnectStream, name);
    },
    expand: go.use(expandTimeline, path),
    fetch: (newPath = path) => go(fetchTimeline, newPath),
    refresh: go.use(refreshTimeline, path),
  })
);

//  Exporting.
export { ConnectedTimeline as default };
