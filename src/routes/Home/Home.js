import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HomeTopics } from './components';
import { getTopicsData, getMoreTopicsData } from './HomeRedux';

@connect(
  state => ({
    tab: state.basic.tab,
    loading: state.home.loading,
    loadingMore: state.home.loadingMore,
    hasMore: state.home.hasMore,
    topicsData: state.home.topicsData,
  }),
  dispatch => ({
    getTopicsData: bindActionCreators(getTopicsData, dispatch),
    getMoreTopicsData: bindActionCreators(getMoreTopicsData, dispatch),
  }),
)
class Home extends React.PureComponent {
  static propTypes = {
    tab: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    loadingMore: PropTypes.bool.isRequired,
    hasMore: PropTypes.bool.isRequired,
    topicsData: PropTypes.array.isRequired,
    getTopicsData: PropTypes.func,
    getMoreTopicsData: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      topicsPage: 1,
    };
  }

  componentDidMount() {
    const { tab } = this.props;
    this.props.getTopicsData(tab, 1, () => {});
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tab !== this.props.tab) {
      const { tab } = this.props;
      this.props.getTopicsData(tab, 1, () => {
        this.setState({
          topicsPage: 1,
        });
      });
    }
  }

  handleInfiniteOnLoad = async () => {
    const { tab, hasMore } = this.props;
    if (hasMore) {
      const { topicsPage } = this.state;
      this.props.getMoreTopicsData(tab, topicsPage + 1, () => {
        this.setState({
          topicsPage: topicsPage + 1,
        });
      });
    }
  };

  render() {
    const { tab, loading, loadingMore, hasMore, topicsData } = this.props;
    return (
      <HomeTopics
        tab={tab}
        loading={loading}
        loadingMore={loadingMore}
        topicsData={topicsData}
        hasMore={hasMore}
        handleInfiniteOnLoad={this.handleInfiniteOnLoad}
      />
    );
  }
}

export default Home;
