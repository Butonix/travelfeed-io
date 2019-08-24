import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import { Query } from 'react-apollo';
import SwipeableViews from 'react-swipeable-views';
import { GET_GEOJSON } from '../../helpers/graphql/geojson';
import { GET_AUTHOR_POST_LOCATIONS } from '../../helpers/graphql/posts';
import PostGrid from '../Grid/PostGrid';
import MapCluster from '../Maps/MapCluster';
import Badges from './Badges';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const theme = useTheme();

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      style={{ background: theme.palette.background.default }}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={0}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
  },
}));

const FullWidthTabs = props => {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [tabs, setTabs] = React.useState(false);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function handleChangeIndex(index) {
    setValue(index);
  }

  const { author } = props;

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Blog" {...a11yProps(0)} />
          {tabs && (
            <>
              <Tab label="Map" {...a11yProps(1)} />
              <Tab label="Badges" {...a11yProps(2)} />
            </>
          )}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <div className="container pt-3">
            <PostGrid
              query={{ author, limit: 12 }}
              grid={{ lg: 4, md: 4, sm: 6, xs: 12 }}
              cardHeight={140}
            />
          </div>
        </TabPanel>
        <Query
          query={GET_AUTHOR_POST_LOCATIONS}
          variables={{ author, limit: Infinity }}
        >
          {({ data }) => {
            const country_codes = [];
            if (data && data.posts) {
              data.posts.forEach(d => {
                if (
                  d.country_code &&
                  country_codes.indexOf(d.country_code) === -1
                )
                  country_codes.push(d.country_code);
              });
              if (country_codes.length > 0) {
                return (
                  <Query
                    query={GET_GEOJSON}
                    variables={{ countryList: country_codes }}
                  >
                    {res => {
                      let dataLayer;
                      if (res.data && res.data.geojson) {
                        setTabs(true);
                        const features = JSON.parse(res.data.geojson.features);
                        dataLayer = {
                          type: 'FeatureCollection',
                          features,
                        };
                        return (
                          <>
                            <div
                              index={1}
                              style={{ height: '500px', widht: '100%' }}
                              className="w-100 p-0 m-0"
                            >
                              <MapCluster
                                dataLayer={dataLayer}
                                showControls={false}
                                height="530px"
                                className="w-100 h-100"
                                data={data.posts}
                                dark={theme.palette.type === 'dark'}
                              />
                            </div>
                            <TabPanel
                              value={value}
                              index={2}
                              dir={theme.direction}
                            >
                              <div className="container pt-2 pb-4">
                                <Badges
                                  countryCodes={country_codes}
                                  regions={res.data.geojson.regions}
                                  budget={res.data.geojson.budget}
                                  totalPosts={data.posts.length}
                                />
                              </div>
                            </TabPanel>
                          </>
                        );
                      }
                      return <></>;
                    }}
                  </Query>
                );
              }
            }
            return <></>;
          }}
        </Query>
      </SwipeableViews>
    </div>
  );
};

export default FullWidthTabs;
