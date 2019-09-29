import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import PostGrid from '../components/Grid/PostGrid';
import TagsOrderBySelect from '../components/Grid/TagsOrderBySelect';
import Head from '../components/Header/Head';
import Header from '../components/Header/Header';

class TagPage extends Component {
  static async getInitialProps(props) {
    let { orderby } = props.query;
    const { tags } = props.query;
    let min_curation_score = 0;
    let selection = 0;
    let title = 'Taking Off';
    if (orderby === 'featured') {
      selection = 1;
      orderby = 'sc_trend';
      min_curation_score = 5000;
      title = 'Featured';
    } else if (orderby === 'total_votes') {
      selection = 2;
      min_curation_score = 9000;
      title = 'Favorites';
    }
    return {
      orderby,
      tags,
      min_curation_score,
      selection,
      title,
    };
  }

  render() {
    return (
      <Fragment>
        <Head
          title={`${this.props.title}: ${this.props.tags
            .charAt(0)
            .toUpperCase() +
            this.props.tags.slice(1)} - TravelFeed: The Travel Community`}
          description={`Explore posts about #${this.props.tags} on TravelFeed.`}
        />
        <Header />
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          className="pt-5 pb-3"
        >
          {this.props.tags.charAt(0).toUpperCase() + this.props.tags.slice(1)}
        </Typography>
        <TagsOrderBySelect
          tags={this.props.tags}
          selection={this.props.selection}
        />
        <div className="container" id="containerInvisibleOnMobile">
          <PostGrid
            active="topic"
            query={{
              tags: this.props.tags,
              orderby: this.props.orderby,
              min_curation_score: this.props.min_curation_score,
              limit: 9,
            }}
            grid={{ lg: 4, md: 4, sm: 6, xs: 12 }}
            cardHeight={200}
            poststyle="grid"
          />
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
  title: PropTypes.string.isRequired,
  orderby: PropTypes.string.isRequired,
  min_curation_score: PropTypes.number.isRequired,
  selection: PropTypes.number.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  query: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TagPage;
