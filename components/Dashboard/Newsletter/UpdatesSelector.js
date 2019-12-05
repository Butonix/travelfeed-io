import red from '@material-ui/core/colors/red';
import IconButton from '@material-ui/core/IconButton';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import { withSnackbar } from 'notistack';
import React from 'react';
import UpdatesSelectorInput from './UpdatesSelectorInput';

const theme = createMuiTheme({
  palette: {
    primary: red,
  },
});

const UpdatesSelector = props => {
  const { updates, setUpdates, loading, setLoading } = props;

  const handleUpdateRemove = title => {
    let newUpdates = updates;
    newUpdates = newUpdates.filter(item => item.title !== title);
    setUpdates(newUpdates);
  };

  return (
    <div style={{ overflowX: 'auto', wordWrap: 'normal', wordBreak: 'normal' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">Title</TableCell>
            <TableCell padding="checkbox">Text</TableCell>
            <TableCell padding="checkbox" />
          </TableRow>
        </TableHead>
        <TableBody>
          {!loading &&
            updates.map(b => (
              <TableRow hover key={b.username}>
                <TableCell padding="checkbox">{b.title}</TableCell>
                <TableCell padding="checkbox">{b.text}</TableCell>
                <TableCell padding="checkbox">
                  <MuiThemeProvider theme={theme}>
                    <IconButton
                      color="primary"
                      onClick={() => handleUpdateRemove(b.title)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <UpdatesSelectorInput
                      isEdit
                      title={b.title}
                      image={b.image}
                      text={b.text}
                      link={b.link}
                      button={b.button}
                      updates={updates}
                      setUpdates={setUpdates}
                      loading={loading}
                      setLoading={setLoading}
                    />
                  </MuiThemeProvider>
                </TableCell>
              </TableRow>
            ))}
          <TableRow key="input">
            <TableCell padding="checkbox" />
            <TableCell padding="checkbox" />
            <TableCell padding="checkbox">
              <UpdatesSelectorInput
                updates={updates}
                setUpdates={setUpdates}
                loading={loading}
                setLoading={setLoading}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default withSnackbar(UpdatesSelector);
