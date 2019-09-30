// Todo: Show current mana, ressource credits, upvote worth
import {
  cyan,
  green,
  indigo,
  lightGreen,
  orange,
  pink,
  purple,
  teal,
} from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import TotalPayoutIcon from '@material-ui/icons/AttachMoney';
import QualityIcon from '@material-ui/icons/CheckCircle';
import TotalPostsIcon from '@material-ui/icons/Create';
import TotalFeaturedIcon from '@material-ui/icons/Star';
import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import calculateQualityScore from '../../helpers/calculateQualityScore';
import {
  GET_DASHBOARD_POSTS,
  GET_NOTIFICATIONS,
} from '../../helpers/graphql/posts';
import { GET_USER_STATS } from '../../helpers/graphql/stats';
import { getUser } from '../../helpers/token';
import Link from '../../lib/Link';
import HeaderCard from '../General/HeaderCard';
import CustomSnackbar from './Notifications/CustomSnackbar';
import PostsTable from './Stats/PostsTable';
import RecentEarnings from './Stats/RecentEarningsChart';
import SmallBox from './Stats/SmallBox';

const Stats = () => {
  return (
    <Fragment>
      <Grid container className="p-1" spacing={0} justify="center">
        <Query query={GET_USER_STATS}>
          {({ data }) => {
            return (
              <Fragment>
                <Grid item className="p-1" lg={3} md={3} sm={6} xs={12}>
                  <SmallBox
                    Icon={TotalPostsIcon}
                    title="Total Posts"
                    value={
                      data && data.userstats ? data.userstats.total_posts : ''
                    }
                    iconColor={purple[600]}
                    boxColor={purple[400]}
                  />
                </Grid>
                <Grid item className="p-1" lg={3} md={3} sm={6} xs={12}>
                  <SmallBox
                    Icon={TotalPayoutIcon}
                    title="Total Earnings"
                    value={
                      data && data.userstats ? data.userstats.total_payout : ''
                    }
                    prefix="$"
                    iconColor={cyan[800]}
                    boxColor={cyan[600]}
                  />
                </Grid>
                <Grid item className="p-1" lg={3} md={3} sm={6} xs={12}>
                  <SmallBox
                    Icon={TotalFeaturedIcon}
                    title="Featured Posts"
                    value={
                      data && data.userstats
                        ? data.userstats.total_featured
                        : ''
                    }
                    iconColor={orange[600]}
                    boxColor={orange[400]}
                  />
                </Grid>
                <Grid item className="p-1" lg={3} md={3} sm={6} xs={12}>
                  <SmallBox
                    Icon={QualityIcon}
                    title="Quality Score"
                    value={
                      data && data.userstats
                        ? calculateQualityScore(
                            data.userstats.total_featured,
                            data.userstats.total_posts,
                          )
                        : ''
                    }
                    iconColor={pink[600]}
                    boxColor={pink[400]}
                  />
                </Grid>
                <Grid item className="p-1" lg={6} md={6} sm={12} xs={12}>
                  <HeaderCard
                    title={`Welcome, ${getUser()}!`}
                    background={green[600]}
                    content={
                      <div className="postcontent">
                        <p>
                          Welcome to &quot;TravelBlog&quot;, your personal
                          TravelFeed Dashboard!
                        </p>
                        <p>
                          Here you can manage everything related to your blog,
                          for example:
                        </p>
                        <ul>
                          <li>
                            <Link
                              color="textPrimary"
                              href="/dashboard/publish"
                              passHref
                            >
                              <a>Write your next awesome travel post</a>
                            </Link>
                          </li>
                          <li>
                            <Link
                              color="textPrimary"
                              href="/dashboard/drafts"
                              passHref
                            >
                              <a>
                                Access your drafts and continue where you left
                                off
                              </a>
                            </Link>
                          </li>
                          <li>
                            <Link
                              color="textPrimary"
                              href="/dashboard/posts"
                              passHref
                            >
                              <a>View and edit your published posts</a>
                            </Link>
                          </li>
                          <li>
                            <Link
                              color="textPrimary"
                              href="/dashboard/replies"
                              passHref
                            >
                              <a>View and answer replies from your followers</a>
                            </Link>
                          </li>
                          <li>
                            <Link
                              color="textPrimary"
                              href="/dashboard/profile"
                              passHref
                            >
                              <a>Edit your profile</a>
                            </Link>
                          </li>
                        </ul>
                        <p>
                          To return to TravelFeed and discover other travel
                          blogs, you can always click on your profile icon on
                          the top right and select &quot;TravelFeed&quot; to{' '}
                          <Link color="textPrimary" href="/" passHref>
                            <a>return to the feed.</a>
                          </Link>
                        </p>
                      </div>
                    }
                  />
                  <div className="mt-2">
                    <HeaderCard
                      noborder
                      title="Monthly Earnings"
                      background={teal[600]}
                      content={
                        <div className="pt-3">
                          {data && data.userstats && (
                            <RecentEarnings
                              color={teal[400]}
                              recentPayouts={data.userstats.recent_payouts}
                            />
                          )}
                        </div>
                      }
                    />
                  </div>
                </Grid>
              </Fragment>
            );
          }}
        </Query>
        <Grid item className="p-1" lg={6} md={6} sm={12} xs={12}>
          <Query
            query={GET_DASHBOARD_POSTS}
            variables={{ author: getUser(), limit: 15 }}
          >
            {({ data }) => {
              return (
                <HeaderCard
                  noborder
                  title="Recent Posts"
                  background={indigo[600]}
                  content={<>{data && <PostsTable data={data.posts} />}</>}
                />
              );
            }}
          </Query>
          <Query
            query={GET_NOTIFICATIONS}
            variables={{
              author: getUser(),
              min_curation_score: 5000,
              limit: 3,
            }}
          >
            {({ data }) => {
              return (
                <div className="mt-2">
                  <HeaderCard
                    title="Notifications"
                    background={lightGreen[600]}
                    content={
                      (data && data.posts && data.posts.length === 0 && (
                        <div className="text-center">No notifications.</div>
                      )) ||
                      (data &&
                        data.posts &&
                        data.posts.map(post => {
                          return post.curation_score >= 9000 ? (
                            <div
                              key={post.title}
                              className="d-flex justify-content-center p-2"
                            >
                              <CustomSnackbar
                                variant="success"
                                message={`Your post ${post.title}
                        was selected to be featured on the front page! Keep
                        up the great work!`}
                              />
                            </div>
                          ) : (
                            <div
                              key={post.title}
                              className="d-flex justify-content-center p-2"
                            >
                              <CustomSnackbar
                                variant="info"
                                message={`Your post ${post.title}
                        received a small vote by our curation team! Good job!`}
                              />
                            </div>
                          );
                        }))
                    }
                  />
                </div>
                // Todo: Card for recent drafts
              );
            }}
          </Query>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Stats;
