import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import PostGrid from '../components/Grid/PostGrid';
import Head from '../components/Header/Head';
import Header from '../components/Header/Header';
import capitalize from '../helpers/capitalize';

class TagPage extends Component {
  static async getInitialProps(props) {
    const { tags } = props.query;
    console.log(tags);
    return {
      tags,
    };
  }

  render() {
    return (
      <Fragment>
        <Head
          title={`${capitalize(
            this.props.tags,
          )} - TravelFeed: The Travel Community`}
          description={`Explore posts about #${this.props.tags} on TravelFeed.`}
        />
        <Header active="tag" />
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          className="pt-5 pb-3"
        >
          {this.props.tags.charAt(0).toUpperCase() + this.props.tags.slice(1)}
        </Typography>
        <div className="pb-2">
          <div className="container" id="containerInvisibleOnMobile">
            <PostGrid
              active="topic"
              query={{
                tags: this.props.tags,
                orderby: 'curation_score DESC, total_votes',
                limit: 9,
              }}
              grid={{ lg: 4, md: 4, sm: 6, xs: 12 }}
              cardHeight={200}
              poststyle="grid"
            />
          </div>
        </div>
        <style>{`
        @media (max-width: 992px) {
          #containerInvisibleOnMobile {
            padding: 0;
            margin: 0;
          }
        }
        `}</style>
      </Fragment>
    );
  }
}

TagPage.propTypes = {
  tags: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  query: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TagPage;
