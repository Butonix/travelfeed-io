import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import ErrorPage from '../components/General/ErrorPage';
import Header from '../components/Header/Header';
import AuthorProfile from '../components/Profile/AuthorProfile';
import ProfileTabs from '../components/Profile/ProfileTabs';
import { getAccount } from '../helpers/steem';

class BlogPage extends Component {
  static async getInitialProps(props) {
    const { author } = props.query;

    const account = await getAccount(author);

    return account;
  }

  render() {
    const {
      name,
      display_name,
      cover_image,
      about,
      location,
      website,
      twitter,
      facebook,
      instagram,
      youtube,
      couchsurfing,
      pinterest,
    } = this.props;

    return (
      <Fragment>
        {(name && (
          <>
            <AuthorProfile
              profile={{
                name,
                display_name,
                cover_image,
                about,
                location,
                website,
                twitter,
                facebook,
                instagram,
                youtube,
                couchsurfing,
                pinterest,
              }}
            />
            <ProfileTabs author={name} />
          </>
        )) || (
          <>
            <Header />
            <ErrorPage statusCode={404} />
          </>
        )}
      </Fragment>
    );
  }
}

BlogPage.propTypes = {
  name: PropTypes.string,
  display_name: PropTypes.string,
  cover_image: PropTypes.string,
  about: PropTypes.string,
  location: PropTypes.string,
  website: PropTypes.string,
  twitter: PropTypes.string,
  facebook: PropTypes.string,
  instagram: PropTypes.string,
  youtube: PropTypes.string,
  couchsurfing: PropTypes.string,
  pinterest: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  query: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default BlogPage;
