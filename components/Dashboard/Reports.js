import { useQuery } from '@apollo/react-hooks';
import React from 'react';
import { GET_REPORTED_POSTS } from '../../helpers/graphql/reports';
import ReportItem from './Reports/ReportItem';

const Reports = () => {
  const { data } = useQuery(GET_REPORTED_POSTS);

  if (data)
    return (
      <>
        <div className="container pt-1">
          <div className="row">
            {data && data.reportedPosts && data.reportedPosts.length > 0 ? (
              data.reportedPosts.map(report => {
                return (
                  <div className="col-12 pt-2 pl-2 pr-2">
                    <ReportItem report={report} />
                  </div>
                );
              })
            ) : (
              <div className="col text-center">No pending reports</div>
            )}
          </div>
        </div>
      </>
    );

  return 'Loading...';
};

export default Reports;
