import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import FollowButton from "./FollowButton";
import Head from "./Head";
import { Query } from "react-apollo";
import { GET_PROFILE } from "../helpers/graphql/profile";
import NotFound from "./NotFound";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faCouch } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

export class PostAuthorProfile extends Component {
  render() {
    return (
      <Fragment>
        <Query query={GET_PROFILE} variables={this.props}>
          {({ data, loading, error }) => {
            if (loading) {
              return <Fragment />;
            }
            if (
              error ||
              data.profile === null ||
              data.profile.isBlacklisted === true
            ) {
              return <NotFound statusCode={404} />;
            }
            const about =
              data.profile.about != "" ? data.profile.about : <Fragment />;
            const cover_image =
              data.profile.cover_image !== ""
                ? `https://steemitimages.com/1500x0/${data.profile.cover_image}`
                : "https://cdn.steemitimages.com/DQme1phKjAipUM1zg5GQNaobssCMgmLAvFLFTVJpe9YVSvv/Steem_Gradient_Blue.png";
            const location =
              data.profile.location !== "" ? (
                <span>
                  {" "}
                  <FontAwesomeIcon icon={faMapMarkerAlt} />{" "}
                  {data.profile.location}
                </span>
              ) : (
                <Fragment />
              );
            const website =
              data.profile.website !== "" ? (
                <a
                  href={data.profile.website}
                  target="_blank"
                  rel="nofollow noreferrer noopener"
                  className="text-light h1 p-1"
                >
                  {" "}
                  <FontAwesomeIcon icon={faLink} />
                </a>
              ) : (
                <Fragment />
              );
            const facebook =
              data.profile.facebook !== "" ? (
                <a
                  href={"https://facebook.com/" + data.profile.facebook}
                  target="_blank"
                  rel="nofollow noreferrer noopener"
                  className="text-light h1 p-1"
                >
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
              ) : (
                <Fragment />
              );
            const twitter =
              (
                <a
                  href={"https://twitter.com/" + data.profile.twitter}
                  target="_blank"
                  rel="nofollow noreferrer noopener"
                  className="text-light h1 p-1"
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
              ) !== "" ? (
                data.profile.twitter
              ) : (
                <Fragment />
              );
            const instagram =
              data.profile.instagram !== "" ? (
                <a
                  href={"https://instagram.com/" + data.profile.instagram}
                  target="_blank"
                  rel="nofollow noreferrer noopener"
                  className="text-light h1 p-1"
                >
                  {" "}
                  <FontAwesomeIcon icon={faInstagram} />{" "}
                </a>
              ) : (
                <Fragment />
              );
            const youtube =
              data.profile.youtube !== "" ? (
                <a
                  href={"https://youtube.com/" + data.profile.youtube}
                  target="_blank"
                  rel="nofollow noreferrer noopener"
                  className="text-light h1 p-1"
                >
                  {" "}
                  <FontAwesomeIcon icon={faYoutube} />{" "}
                </a>
              ) : (
                <Fragment />
              );
            const couchsurfing =
              data.profile.couchsurfing !== "" ? (
                <a
                  href={"https://couchsurfing.com/" + data.profile.couchsurfing}
                  target="_blank"
                  rel="nofollow noreferrer noopener"
                  className="text-light h1 p-1"
                >
                  {" "}
                  <FontAwesomeIcon icon={faCouch} />{" "}
                </a>
              ) : (
                <Fragment />
              );
            const divStyle = {
              backgroundImage: "url(" + cover_image + ")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center center",
              backgroundSize: "cover",
              marginTop: "-10px"
            };
            return (
              <Fragment>
                <Head
                  title={`${data.profile.display_name}'s Blog`}
                  image={data.profile.img_url}
                  description={about}
                />
                <div className="text-center p-4 mb-3" style={divStyle}>
                  <div className="container">
                    <div className="row justify-content-center">
                      <div
                        style={{ backgroundColor: "rgba(52, 58, 64, 0.6)" }}
                        className="col-lg-6 col-md-9 col-sm-12 p-3 text-light rounded"
                      >
                        <Fragment>
                          <div className="pb-2">
                            <img
                              style={{ cursor: "pointer" }}
                              src={`https://steemitimages.com/u/${
                                data.profile.name
                              }/avatar`}
                              width="80"
                              height="80"
                              className="rounded-circle"
                            />
                          </div>
                          <div>
                            <Typography variant="h6" className="text-light">
                              {data.profile.display_name}{" "}
                              <em>@{data.profile.name}</em>
                            </Typography>
                          </div>
                          <p className="p-2">{about}</p>
                          <p>{location}</p>
                        </Fragment>
                        <div>
                          {website}
                          {facebook}
                          {twitter}
                          {instagram}
                          {youtube}
                          {couchsurfing}
                        </div>
                        <div>
                          <FollowButton
                            author={data.profile.name}
                            btnstyle="whiteborder"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

PostAuthorProfile.propTypes = {
  author: PropTypes.string
};

export default PostAuthorProfile;
