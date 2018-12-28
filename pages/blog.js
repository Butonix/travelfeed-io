import "@babel/polyfill";
import React, { Component, Fragment } from "react";
import isBlacklisted from "../helpers/isBlacklisted";
import { Client } from "dsteem";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import PostGrid from "../components/PostGrid";
import AuthorProfile from "../components/AuthorProfile";
import Helmet from "react-helmet";
import Header from "../components/Header";

const client = new Client("https://api.steemit.com");

class Blog extends Component {
  static async getInitialProps(props) {
    let { author } = props.query;
    if (isBlacklisted(author, "none") === true) {
      const stream = { args: { stream: { blacklisted: true } } };
      return stream;
    }
    const args = { tag: author, limit: 24 };
    try {
      const stream = await client.database.getDiscussions("blog", args);
      return { args: { author: author, stream: stream } };
    } catch {
      const stream = { args: { stream: { notfound: true } } };
      return stream;
    }
  }
  render() {
    if (typeof this.props.args.stream.notfound !== "undefined") {
      return (
        <Fragment>
          <Helmet>
            <title>{"404 - Not Found"}</title>
          </Helmet>
          <Header />
          <Grid container spacing={0} alignItems="center" justify="center">
            <Grid item lg={7} md={8} sm={11} xs={12}>
              <Card>
                <CardContent>
                  <Typography>This author is not a valid account.</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Fragment>
      );
    } else if (typeof this.props.args.stream.blacklisted !== "undefined") {
      return (
        <Fragment>
          <Helmet>
            <title>{"404 - Not Found"}</title>
          </Helmet>
          <Grid container spacing={0} alignItems="center" justify="center">
            <Grid item lg={7} md={8} sm={11} xs={12}>
              <Card>
                <CardContent>
                  <Typography>
                    This author is blacklisted from TravelFeed.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Fragment>
      );
    } else {
      const author = this.props.args.author.replace(/^\w/, c =>
        c.toUpperCase()
      );
      const description =
        author +
        "'s Blog on TravelFeed. Join the TravelFeed community, write your own travel blog and start earning!";
      return (
        <Fragment>
          <Helmet>
            <title>
              {author + "'s Blog on TravelFeed: The Travel Community"}
            </title>
            <meta property="description" content={description} />
            <meta property="og:description" content={description} />
          </Helmet>
          <Header />
          <AuthorProfile author={this.props.args.author} />
          <PostGrid
            stream={this.props.args.stream}
            type="blog"
            filter={this.props.args.author}
          />
        </Fragment>
      );
    }
  }
}

Blog.propTypes = {
  args: PropTypes.array
};

export default Blog;
