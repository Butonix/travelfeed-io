import { teal } from '@material-ui/core/colors';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';
import { Query } from 'react-apollo';
import { CONTEST_GET } from '../../../helpers/graphql/contest';
import HeaderCard from '../../General/HeaderCard';

const RaffleTickets = () => {
  return (
    <>
      <Query query={CONTEST_GET}>
        {({ data }) => {
          if (data && data.contestGet) {
            let count = 0;
            data.contestGet.forEach(c => {
              count += c.tickets;
            });
            return (
              <HeaderCard
                title={`Your have ${count} Raffle Tickets`}
                background={teal[600]}
                content={
                  <>
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
                            <TableCell>Type</TableCell>
                            <TableCell>Tickets</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.contestGet.map((c, i) => (
                            <TableRow hover key={i}>
                              <TableCell>{c.type}</TableCell>
                              <TableCell>{c.tickets}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
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

export default RaffleTickets;
