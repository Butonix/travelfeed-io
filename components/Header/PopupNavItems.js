import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';
import { Query } from 'react-apollo';
import { GET_FEATURED_LOCATIONS } from '../../helpers/graphql/locations';
import PopupNavCard from './PopupNavCard';

const PopupNavItem = props => {
  const { tags, countries, places } = props;
  return (
    <>
      <Query
        query={GET_FEATURED_LOCATIONS}
        variables={{ tags, countries, places }}
      >
        {({ data, loading, error }) => {
          if (loading) {
            return (
              <div className="p-5 text-center">
                <CircularProgress />
              </div>
            );
          }
          if (error) {
            return (
              <Card className="m-5 text-center" key="noposts">
                <CardContent>
                  {error && 'Network Error. Are you online?'}
                </CardContent>
              </Card>
            );
          }
          return (
            <div className="container-fluid pb-4">
              <div className="row">
                {data &&
                  data.featuredLocations &&
                  data.featuredLocations.map(item => {
                    return <PopupNavCard data={item} />;
                  })}
              </div>
            </div>
          );
        }}
      </Query>
    </>
  );
};

export default PopupNavItem;
