import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import NotFound from '../components/General/NotFound';
import Header from '../components/Header/Header';

export default class Error extends React.Component {
  static getInitialProps({ res, err }) {
    let statusCode = null;
    if (res) ({ statusCode } = res);
    else if (err) ({ statusCode } = err);
    return { statusCode };
  }

  render() {
    const { statusCode } = this.props;
    return (
      <Fragment>
        <Header />
        <NotFound statusCode={statusCode} />
      </Fragment>
    );
  }
}

Error.propTypes = {
  statusCode: PropTypes.number.isRequired,
};
