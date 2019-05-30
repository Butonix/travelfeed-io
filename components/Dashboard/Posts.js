import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import React, { Component, Fragment } from "react";
import { getUser } from "../../helpers/token";
import PostGrid from "../Grid/PostGrid";

class Posts extends Component {
  render() {
    return (
      <Fragment>
        <Grid
          container
          spacing={0}
          alignItems="center"
          justify="center"
          className="pt-4 pb-4"
        >
          <Grid item lg={8} md={10} sm={11} xs={12} className="pb-4">
            <div className="text-center">
              <h1>Your Published Posts</h1>
            </div>
          </Grid>
          <PostGrid
            query={{ author: getUser(), limit: 10 }}
            grid={{ lg: 8, md: 10, sm: 11, xs: 12 }}
            cardHeight={140}
            poststyle="list"
          />
        </Grid>
      </Fragment>
    );
  }
}

Posts.propTypes = {
  user: PropTypes.string
};

export default Posts;
