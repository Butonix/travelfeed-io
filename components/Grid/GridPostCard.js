import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { withStyles } from '@material-ui/styles';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import LazyLoad from 'vanilla-lazyload';
import { imageProxy } from '../../helpers/getImage';
import Link from '../../lib/Link';
import IsCurated from '../Post/IsCurated';
import SubHeader from '../Post/SubHeader';
import VoteSlider from '../Post/VoteSlider';
import ProfileAvatar from '../Profile/ProfileAvatar';
import ProfileName from '../Profile/ProfileName';
import Excerpt from './Excerpt';

const styles = () => ({
  card: {
    borderRadius: 12,
  },
  cardHeader: {
    padding: 12,
  },
});

class GridPostCard extends Component {
  constructor(props) {
    super(props);
    this.myInput = React.createRef();
  }

  state = { show: true, cardWidth: 800 };

  componentDidMount() {
    if (this.myInput.current) {
      const cardWidth = Math.ceil(this.myInput.current.offsetWidth / 100) * 100;
      this.setState({ cardWidth });
    }
    if (!document.lazyLoadInstance) {
      document.lazyLoadInstance = new LazyLoad({
        elements_selector: '.lazy',
        threshold: 1200,
      });
    }
    document.lazyLoadInstance.update();
  }

  // Update lazyLoad after rerendering of every image
  componentDidUpdate() {
    document.lazyLoadInstance.update();
  }

  hide = () => {
    this.setState({ show: false });
  };

  render() {
    const { classes } = this.props;

    // Prevent SSR
    const BookmarkIcon = dynamic(() => import('../Post/BookmarkIcon'), {
      ssr: false,
    });
    // Hide if deleted (for bookmarks)
    if (!this.state.show) {
      return <Fragment />;
    }
    let action = <Fragment />;
    if (this.props.showBookmark === true) {
      action = (
        <BookmarkIcon
          author={this.props.post.author}
          permlink={this.props.post.permlink}
        />
      );
    } else if (this.props.isBookmark === true) {
      action = (
        <BookmarkIcon
          author={this.props.post.author}
          permlink={this.props.post.permlink}
          onBmChange={this.hide}
        />
      );
    } else {
      action = (
        <Fragment>
          <IsCurated
            app={this.props.post.app}
            curationScore={this.props.post.curation_score}
          />
        </Fragment>
      );
    }
    const cardImage = this.props.post.img_url
      ? imageProxy(
          this.props.post.img_url,
          this.state.cardWidth,
          this.props.cardHeight,
          undefined,
          'webp',
        )
      : undefined;
    let titleUri = '';
    let bodyUri = '';
    let displayNameUri = '';
    try {
      titleUri = encodeURIComponent(this.props.post.title);
    } catch {
      console.warn('Could not encode URI');
    }
    try {
      bodyUri = encodeURIComponent(this.props.post.body);
    } catch {
      console.warn('Could not encode URI');
    }
    try {
      displayNameUri = encodeURIComponent(this.props.post.display_name);
    } catch {
      console.warn('Could not encode URI');
    }

    return (
      <Card
        key={this.props.post.permlink}
        className={`mb-0 mt-2 mr-2 ml-2 ${classes.card}`}
      >
        <CardHeader
          className={classes.cardHeader}
          avatar={<ProfileAvatar author={this.props.post.author} />}
          action={<Fragment>{action}</Fragment>}
          title={
            <ProfileName
              author={this.props.post.author}
              displayName={this.props.post.display_name}
            />
          }
          subheader={
            <SubHeader
              created_at={this.props.post.created_at}
              readtime={this.props.post.readtime}
              location={{
                country_code: this.props.post.country_code,
                subdivision: this.props.post.subdivision,
              }}
            />
          }
        />
        <Link
          color="textPrimary"
          as={`/@${this.props.post.author}/${this.props.post.permlink}`}
          href={`/post?author=${this.props.post.author}&permlink=${
            this.props.post.permlink
          }&title=${titleUri}&body=${bodyUri}&display_name=${displayNameUri}&img_url=${encodeURIComponent(
            this.props.post.img_url,
          )}&lazy_img_url=${encodeURIComponent(
            cardImage,
          )}&created_at=${encodeURIComponent(
            this.props.post.created_at,
          )}&depth=0`}
        >
          <CardActionArea>
            {this.props.post.img_url !== undefined &&
              this.props.post.img_url !== '' && (
                <picture ref={this.myInput} className="lazyImage">
                  <source
                    className="lazyImage"
                    height={this.props.cardHeight}
                    type="image/webp"
                    data-srcset={`${cardImage}`}
                    data-sizes="100w"
                  />
                  <img
                    height={this.props.cardHeight}
                    width="100%"
                    alt={this.props.post.title}
                    className="lazy"
                    src={`${imageProxy(
                      this.props.post.img_url,
                      this.state.cardWidth * 0.1,
                      this.props.cardHeight * 0.1,
                    )}`}
                    data-src={`${imageProxy(
                      this.props.post.img_url,
                      this.state.cardWidth,
                      this.props.cardHeight,
                    )}`}
                    data-sizes="100w"
                  />
                </picture>
              )}
            <CardContent>
              <Excerpt
                title={this.props.post.title}
                text={this.props.post.excerpt}
              />
            </CardContent>
          </CardActionArea>
        </Link>
        <VoteSlider
          author={this.props.post.author}
          permlink={this.props.post.permlink}
          votes={this.props.post.votes}
          total_votes={this.props.post.total_votes}
          tags={this.props.post.tags}
          mode="gridcard"
          depth={this.props.post.depth}
        />{' '}
      </Card>
    );
  }
}

GridPostCard.defaultProps = {
  showBookmark: false,
  isBookmark: false,
};

GridPostCard.propTypes = {
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  cardHeight: PropTypes.number.isRequired,
  showBookmark: PropTypes.bool,
  isBookmark: PropTypes.bool,
};

export default withStyles(styles)(GridPostCard);
