import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import Contest from '../../components/Dashboard/Contest';
import Head from '../../components/Header/Head';

class ContestPage extends Component {
  static async getInitialProps(props) {
    const { open } = props.query;
    return { open };
  }

  render() {
    const DashboardHeader = dynamic(
      () => import('../../components/Dashboard/DashboardMenu'),
      {
        ssr: false,
      },
    );
    const { open } = this.props;
    return (
      <Fragment>
        <Head title="TravelBlog: Steemfest Contest - TravelFeed: The Travel Community" />
        <DashboardHeader active="contest" content={<Contest />} open={open} />
      </Fragment>
    );
  }
}

ContestPage.defaultProps = {
  query: undefined,
  open: undefined,
};

ContestPage.propTypes = {
  open: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  query: PropTypes.arrayOf(PropTypes.string),
};
export default ContestPage;
