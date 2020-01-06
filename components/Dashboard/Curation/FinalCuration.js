import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DownIcon from '@material-ui/icons/KeyboardArrowDown';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import { withSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import {
  PROCESS_CURATION,
  SET_CURATION_SCORE,
} from '../../../helpers/graphql/curation';
import graphQLClient from '../../../helpers/graphQLClient';

const FinalCuration = props => {
  const [curationScores, setCurationScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setCurationScores(props.curationScores);
  }, [props]);

  const newNotification = notification => {
    if (notification !== undefined) {
      let variant = 'success';
      if (notification.success === false) {
        variant = 'error';
      }
      props.enqueueSnackbar(notification.message, { variant });
    }
  };

  const handleMove = (index, newPos) => {
    const newCurationScores = curationScores;
    newCurationScores[index].score += newPos;
    if (
      (newPos === 1 &&
        index > 0 &&
        newCurationScores[index].score > newCurationScores[index - 1].score) ||
      (newPos === -1 &&
        index < newCurationScores.length - 1 &&
        newCurationScores[index].score < newCurationScores[index + 1].score)
    ) {
      const item1 = newCurationScores[index];
      const item2 = newCurationScores[index - newPos];
      newCurationScores[index - newPos] = item1;
      newCurationScores[index] = item2;
    }
    setCurationScores(newCurationScores);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1);
    graphQLClient(SET_CURATION_SCORE, {
      author: newCurationScores[index].author,
      permlink: newCurationScores[index].permlink,
      score: newCurationScores[index].score,
    }).then(({ setCurationScore }) => {
      if (!setCurationScore.success) newNotification(setCurationScore);
    });
  };

  const handleProcessCuration = () => {
    setProcessing(true);
    graphQLClient(PROCESS_CURATION).then(({ processCuration }) => {
      if (!processCuration.success) newNotification(processCuration);
      setProcessing(false);
    });
  };

  return (
    <>
      <div
        style={{ overflowX: 'auto', wordWrap: 'normal', wordBreak: 'normal' }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">Title</TableCell>
              <TableCell padding="checkbox">Author</TableCell>
              <TableCell padding="checkbox">Score</TableCell>
              <TableCell padding="checkbox" />
            </TableRow>
          </TableHead>
          <TableBody>
            {curationScores &&
              curationScores.map((cs, i) => {
                return (
                  <TableRow hover key={cs.permlink}>
                    <TableCell padding="checkbox">
                      <a
                        href={`/@${cs.author}/${cs.permlink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {cs.title}
                      </a>
                    </TableCell>
                    <TableCell padding="checkbox">
                      <a
                        href={`/@${cs.author}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {cs.author}
                      </a>
                    </TableCell>
                    <TableCell padding="checkbox">
                      {loading ? <></> : cs.score}
                    </TableCell>
                    <TableCell padding="checkbox">
                      <IconButton
                        disabled={cs.score === 100}
                        color="primary"
                        onClick={() => handleMove(i, 1)}
                      >
                        <UpIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleMove(i, -1)}
                      >
                        <DownIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
      <div className="pt-2 text-right">
        <Button
          disabled={processing}
          onClick={handleProcessCuration}
          color="primary"
          variant="contained"
        >
          Process curation
          {processing && <CircularProgress className="ml-2" size={25} />}
        </Button>
      </div>
    </>
  );
};

export default withSnackbar(FinalCuration);
