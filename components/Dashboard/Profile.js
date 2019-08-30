import Button from '@material-ui/core/Button';
import { green, indigo, purple, teal } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';
import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import { GET_PROFILE } from '../../helpers/graphql/profile';
import { getUser } from '../../helpers/token';
import Link from '../../lib/Link';
import FeaturedImageUpload from '../Editor/FeaturedImageUpload';
import HeaderCard from '../General/HeaderCard';

class Profile extends Component {
  state = {
    loaded: false,
    author: getUser(),
    profile_image: '',
    cover_image: '',
    name: '',
    about: '',
    location: '',
    website: '',
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    couchsurfing: '',
    changed: [],
  };

  handleEditorChange_profile_image = profile_image => {
    let { changed } = this.state;
    if (changed.indexOf('profile_image') > -1 === false) {
      changed = this.state.changed.concat('profile_image');
    }
    let img = '';
    if (profile_image) img = profile_image;
    this.setState({
      profile_image: img,
      changed,
    });
  };

  handleEditorChange_cover_image = cover_image => {
    let { changed } = this.state;
    if (changed.indexOf('cover_image') > -1 === false) {
      changed = this.state.changed.concat('cover_image');
    }
    let img = '';
    if (cover_image) img = cover_image;
    this.setState({
      cover_image: img,
      changed,
    });
  };

  handleEditorChange_name = name => {
    let { changed } = this.state;
    if (changed.indexOf('name') > -1 === false) {
      changed = this.state.changed.concat('name');
    }
    this.setState({
      name: name.target.value,
      changed,
    });
  };

  handleEditorChange_about = about => {
    let { changed } = this.state;
    if (changed.indexOf('about') > -1 === false) {
      changed = this.state.changed.concat('about');
    }
    this.setState({
      about: about.target.value,
      changed,
    });
  };

  handleEditorChange_location = location => {
    let { changed } = this.state;
    if (changed.indexOf('location') > -1 === false) {
      changed = this.state.changed.concat('location');
    }
    this.setState({
      location: location.target.value,
      changed,
    });
  };

  handleEditorChange_website = website => {
    let { changed } = this.state;
    if (changed.indexOf('website') > -1 === false) {
      changed = this.state.changed.concat('website');
    }
    this.setState({
      website: website.target.value,
      changed,
    });
  };

  handleEditorChange_facebook = facebook => {
    let { changed } = this.state;
    if (changed.indexOf('facebook') > -1 === false) {
      changed = this.state.changed.concat('facebook');
    }
    this.setState({
      facebook: facebook.target.value,
      changed,
    });
  };

  handleEditorChange_twitter = twitter => {
    let { changed } = this.state;
    if (changed.indexOf('twitter') > -1 === false) {
      changed = this.state.changed.concat('twitter');
    }
    this.setState({
      twitter: twitter.target.value,
      changed,
    });
  };

  handleEditorChange_instagram = instagram => {
    let { changed } = this.state;
    if (changed.indexOf('instagram') > -1 === false) {
      changed = this.state.changed.concat('instagram');
    }
    this.setState({
      instagram: instagram.target.value,
      changed,
    });
  };

  handleEditorChange_youtube = youtube => {
    let { changed } = this.state;
    if (changed.indexOf('youtube') > -1 === false) {
      changed = this.state.changed.concat('youtube');
    }
    this.setState({
      youtube: youtube.target.value,
      changed,
    });
  };

  handleEditorChange_couchsurfing = couchsurfing => {
    let { changed } = this.state;
    if (changed.indexOf('couchsurfing') > -1 === false) {
      changed = this.state.changed.concat('couchsurfing');
    }
    this.setState({
      couchsurfing: couchsurfing.target.value,
      changed,
    });
  };

  linkBuilder = () => {
    if (this.state.changed.length === 0) {
      return;
    }
    let link = 'https://steemconnect.com/sign/profile-update?';
    let count = 0;
    this.state.changed.forEach(info => {
      if (count > 0) {
        link += '&';
      }
      link += `${info}=${this.state[info]}`;
      count += 1;
    });
    window.open(link, '_blank');
  };

  render() {
    let updatebtn = (
      <Button color="primary" variant="outlined" disabled>
        <SaveIcon />
        <span className="pl-2">Update Profile</span>
      </Button>
    );
    if (this.state.changed.length > 0) {
      updatebtn = (
        <Button
          color="primary"
          variant="contained"
          onClick={() => this.linkBuilder()}
        >
          <SaveIcon />
          <span className="pl-2">Update Profile</span>
        </Button>
      );
    }
    return (
      <Fragment>
        <Query query={GET_PROFILE} variables={{ author: getUser() }}>
          {({ data }) => {
            if (data && data.profile && this.state.loaded === false) {
              this.setState({
                loaded: true,
                profile_image: data.profile.profile_image,
                cover_image: data.profile.cover_image,
                name: data.profile.display_name,
                about: data.profile.about,
                location: data.profile.location,
                website: data.profile.website,
                facebook: data.profile.facebook,
                twitter: data.profile.twitter,
                instagram: data.profile.instagram,
                youtube: data.profile.youtube,
                couchsurfing: data.profile.couchsurfing,
              });
            }
            return (
              <Grid container spacing={0} justify="center" className="pt-3 p-1">
                <Grid item lg={7} md={8} sm={11} xs={12} className="p-1">
                  <HeaderCard
                    title="Edit your Profile"
                    background={indigo[600]}
                    content={
                      <Fragment>
                        {/* Todo: Find out what the blockchain imposed 
                        length limits are for each field */}
                        <TextField
                          label="Blog name"
                          inputProps={{
                            maxLength: 20,
                          }}
                          placeholder="A cool name for your blog"
                          margin="normal"
                          value={this.state.name}
                          onChange={this.handleEditorChange_name}
                          fullWidth
                        />
                        <TextField
                          multiline
                          label="Blog slogan"
                          inputProps={{
                            maxLength: 160,
                          }}
                          placeholder="Your one-line biography goes here"
                          margin="normal"
                          value={this.state.about}
                          onChange={this.handleEditorChange_about}
                          fullWidth
                        />
                        <TextField
                          label="Location"
                          inputProps={{
                            maxLength: 30,
                          }}
                          placeholder="Where are you based?"
                          margin="normal"
                          value={this.state.location}
                          onChange={this.handleEditorChange_location}
                          fullWidth
                        />
                        <TextField
                          label="Website"
                          inputProps={{
                            maxLength: 100,
                          }}
                          placeholder="Link to your website"
                          margin="normal"
                          value={this.state.website}
                          onChange={this.handleEditorChange_website}
                          fullWidth
                        />
                        <TextField
                          label="Facebook"
                          inputProps={{
                            maxLength: 50,
                          }}
                          placeholder="Your Facebook username or fanpage"
                          margin="normal"
                          value={this.state.facebook}
                          onChange={this.handleEditorChange_facebook}
                          fullWidth
                        />
                        <TextField
                          label="Twitter"
                          inputProps={{
                            maxLength: 50,
                          }}
                          placeholder="Your Twitter username"
                          margin="normal"
                          value={this.state.twitter}
                          onChange={this.handleEditorChange_twitter}
                          fullWidth
                        />
                        <TextField
                          label="Instagram"
                          inputProps={{
                            maxLength: 30,
                          }}
                          placeholder="Your Instagram username"
                          margin="normal"
                          value={this.state.instagram}
                          onChange={this.handleEditorChange_instagram}
                          fullWidth
                        />
                        <TextField
                          label="Youtube"
                          inputProps={{
                            maxLength: 20,
                          }}
                          placeholder="Your Youtube username"
                          margin="normal"
                          value={this.state.youtube}
                          onChange={this.handleEditorChange_youtube}
                          fullWidth
                        />
                        <TextField
                          label="Couchsurfing"
                          inputProps={{
                            maxLength: 50,
                          }}
                          placeholder="Your Couchsurfing username"
                          margin="normal"
                          value={this.state.couchsurfing}
                          onChange={this.handleEditorChange_couchsurfing}
                          fullWidth
                        />
                      </Fragment>
                    }
                  />
                </Grid>
                <Grid item lg={5} md={8} sm={11} xs={12} className="p-1">
                  <HeaderCard
                    title="Profile Image"
                    background={purple[600]}
                    content={
                      <FeaturedImageUpload
                        rounded
                        featuredImage={this.state.profile_image}
                        setFeaturedImage={this.handleEditorChange_profile_image}
                        placeholder="To upload your profile image, drag 'n' drop an image here, or click to select one. Recommended dimensions: 400x400"
                      />
                    }
                  />
                  <div className="pt-2">
                    <HeaderCard
                      title="Cover Image"
                      background={teal[600]}
                      content={
                        <FeaturedImageUpload
                          featuredImage={this.state.cover_image}
                          setFeaturedImage={this.handleEditorChange_cover_image}
                          placeholder="To upload your cover image, drag 'n' drop an image here, or click to select one. Recommended dimensions: 1920x400"
                        />
                      }
                    />
                  </div>
                  <div className="pt-2">
                    <HeaderCard
                      title="Save Changes"
                      background={green[600]}
                      content={
                        <Fragment>
                          <p>
                            After you update your profile, it can take up to an
                            hour for your changes to be visible on your profile
                            page.
                          </p>
                          {updatebtn}
                          <Link
                            color="textPrimary"
                            as={`/@${getUser()}`}
                            href={`/blog?author=${getUser()}`}
                            passHref
                          >
                            <a>
                              <Button
                                color="primary"
                                variant="outlined"
                                className="ml-2"
                              >
                                View your public profile
                              </Button>
                            </a>
                          </Link>
                        </Fragment>
                      }
                    />
                  </div>
                </Grid>
              </Grid>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

export default Profile;
