import { cyan } from '@material-ui/core/colors';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Query } from 'react-apollo';
import { REFERRALS } from '../../../helpers/graphql/contest';
import HeaderCard from '../../General/HeaderCard';

const Referrals = () => {
  return (
    <>
      <Query query={REFERRALS}>
        {({ data }) => {
          if (data && data.referrals) {
            let count = 0;
            data.referrals.forEach(c => {
              count += 1;
            });
            return (
              <HeaderCard
                title={
                  count
                    ? `Your have Referred ${count} User${count > 1 ? 's' : ''}`
                    : "You haven't Referred Anyone yet"
                }
                background={cyan[600]}
                content={
                  <>
                    {(data.referrals && data.referrals.length > 0 && (
                      <div
                        style={{
                          overflowX: 'auto',
                          wordWrap: 'normal',
                          wordBreak: 'normal',
                        }}
                      >
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Username</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {data.referrals.map((c, i) => (
                              <TableRow hover key={i}>
                                <TableCell>{c}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )) || (
                      <Typography variant="body1">
                        Once your referrals join TravelFeed, they will show up
                        here.
                      </Typography>
                    )}
                  </>
                }
              />
            );
          }
          return 'Loading...';
        }}
      </Query>
    </>
  );
};

export default Referrals;
