import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { red } from '@material-ui/core/colors';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Create';
import LocationIcon from '@material-ui/icons/LocationOn';
import NoLocationIcon from '@material-ui/icons/NotListedLocation';
import ViewIcon from '@material-ui/icons/OpenInBrowser';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { nameFromCC } from '../../helpers/countryCodes';
import { imageProxy } from '../../helpers/getImage';
import { markdownComment, swmregex } from '../../helpers/regex';
import Link from '../../lib/Link';
import DeleteDraftButton from '../Dashboard/Drafts/DeleteDraftButton';
import Excerpt from './Excerpt';

const styles = theme => ({
  card: {
    borderRadius: 12,
  },
  areabg: {
    background: theme.palette.background.light,
  },
  areahidden: {
    background: red[600],
  },
});
class PostListItem extends Component {
  state = { show: true };

  hide = () => {
    this.setState({ show: false });
  };

  render() {
    const { classes } = this.props;

    const cleanBody = this.props.post.body
      .replace(markdownComment, '')
      .replace(swmregex, '');

    // Hide if deleted (for drafts)
    if (!this.state.show) {
      return <Fragment />;
    }
    let appIcon = <Fragment />;
    if (
      this.props.post.app &&
      this.props.post.app.split('/')[0] === 'travelfeed'
    ) {
      appIcon = (
        <Tooltip title="Published with TravelFeed" placement="bottom">
          <img
            alt="TravelFeed"
            width="25"
            className="mr-1"
            src="https://travelfeed.io/favicon.ico"
          />
        </Tooltip>
      );
    }
    let button2 = (
      <Link
        color="textPrimary"
        as={`/@${this.props.post.author}/${this.props.post.permlink}`}
        href={`/post?author=${this.props.post.author}&permlink=${
          this.props.post.permlink
        }&title=${encodeURIComponent(
          this.props.post.title,
        )}&body=${encodeURIComponent(
          this.props.post.body,
        )}&display_name=${encodeURIComponent(
          this.props.post.display_name,
        )}&img_url=${encodeURIComponent(
          this.props.post.img_url,
        )}&created_at=${encodeURIComponent(
          this.props.post.created_at,
        )}&depth=0`}
      >
        <a className="textPrimary">
          <Button color="inherit" className="p-0 pr-2 pl-2">
            <span className="pr-1">View</span> <ViewIcon />
          </Button>
        </a>
      </Link>
    );
    if (this.props.isDraftMode) {
      button2 = <DeleteDraftButton id={this.props.id} onDelete={this.hide} />;
    }
    let colsize = 'col-12';
    if (this.props.post.img_url !== undefined) {
      colsize = 'col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12 pl-0';
    }
    const country =
      this.props.post.country_code !== null
        ? nameFromCC(this.props.post.country_code)
        : undefined;
    let titleUri = '';
    try {
      titleUri = encodeURIComponent(this.props.post.title);
    } catch {
      console.warn('Could not encode URI');
    }
    const content = (
      <div className="row">
        {this.props.post.img_url !== undefined && (
          <div className="col-lg-4 p-0">
            <CardMedia
              className="h-100"
              style={{ minHeight: '150px' }}
              image={imageProxy(this.props.post.img_url, undefined, 400, 'fit')}
            />
          </div>
        )}
        <div className={colsize}>
          <CardContent>
            <div className="pr-2 pl-2 pb-2">
              <Typography gutterBottom variant="h6" component="h2">
                {this.props.warnWhenHidden && (
                  <Tooltip
                    title="This post was blacklisted after manual review by the TravelFeed content team. It will not appear on TravelFeed. If you believe this is a mistake, please contact us."
                    placement="bottom"
                  >
                    <div className="pr-2 d-inline">
                      <WarningIcon />
                    </div>
                  </Tooltip>
                )}
                {this.props.post.title || 'Untitled'}
              </Typography>
              <Excerpt text={this.props.post.excerpt} />
            </div>
          </CardContent>
          <CardActions
            className={
              this.props.warnWhenHidden
                ? classNames(classes.areahidden)
                : classNames(classes.areabg)
            }
          >
            <div className="container-fluid">
              <div className="row w-100">
                <div className="col-7 my-auto">
                  <span className="textPrimary pl-2">
                    <Link
                      className="textPrimary"
                      href={`/dashboard/publish?id=${
                        this.props.post.id
                      }&permlink=${encodeURIComponent(
                        this.props.post.permlink,
                      )}&title=${titleUri}&body=${encodeURIComponent(
                        cleanBody,
                      )}&isCodeEditor=${encodeURIComponent(
                        this.props.post.isCodeEditor,
                      )}&jsonMeta=${encodeURIComponent(
                        this.props.isDraftMode ? '' : this.props.post.json,
                      )}&json=${(this.props.isDraftMode &&
                        this.props.post.json) ||
                        JSON.stringify({
                          tags: this.props.post.tags,
                          location: {
                            latitude: this.props.post.latitude,
                            longitude: this.props.post.longitude,
                          },
                          featuredImage: this.props.post.img_url,
                          category: this.props.post.category,
                        })}&editmode=${(this.props.isDraftMode && 'false') ||
                        'true'}`}
                      as="/dashboard/publish"
                    >
                      <Button className="p-0 pl-2 pr-2">
                        <span className="textPrimary pr-1">Edit</span>{' '}
                        <EditIcon />
                      </Button>
                    </Link>
                  </span>
                  {button2}
                </div>
                <div className="col-5 my-auto text-right pt-1">
                  {(country && (
                    <Tooltip
                      title={`${
                        this.props.post.subdivision !== null
                          ? `${this.props.post.subdivision}, `
                          : ''
                      } ${country}`}
                      placement="bottom"
                    >
                      <span className="textPrimary pr-1">
                        <LocationIcon />
                      </span>
                    </Tooltip>
                  )) || (
                    <Tooltip
                      title="Edit the post to add a location"
                      placement="bottom"
                    >
                      <NoLocationIcon />
                    </Tooltip>
                  )}
                  {appIcon}
                  {// if post is paid out (= older than 7 days), display payout, otherwise display time until payour
                  !this.props.isDraftMode &&
                    ((new Date(this.props.post.created_at) <
                      new Date(
                        new Date().setDate(new Date().getDate() - 7),
                      ) && (
                      <span className="textPrimary pl-2 font-weight-bold">
                        ${(this.props.post.payout * 0.75).toFixed(2)}
                      </span>
                    )) || (
                      <span className="textPrimary pl-2 font-weight-bold">
                        Payout in{' '}
                        {Math.ceil(
                          7 -
                            Math.abs(
                              new Date().getTime() -
                                new Date(this.props.post.created_at).getTime(),
                            ) /
                              (1000 * 60 * 60 * 24),
                        )}{' '}
                        days
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </CardActions>
        </div>
      </div>
    );
    return (
      <div className="pt-2 pr-2 pl-2">
        <Card className={classes.card} key={this.props.post.permlink}>
          {content}
        </Card>
      </div>
    );
  }
}

PostListItem.defaultProps = {
  isDraftMode: undefined,
};

PostListItem.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  isDraftMode: PropTypes.bool,
  id: PropTypes.string.isRequired,
};

export default withStyles(styles, { withTheme: true })(PostListItem);
