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
import PostSelectorInput from './PostSelectorInput';

const theme = createMuiTheme({
  palette: {
    primary: red,
  },
});

const PostSelector = props => {
  const { posts, setPosts } = props;

  const handlePostRemove = (author, permlink) => {
    let newPosts = posts;
    newPosts = newPosts.filter(
      item => item.author !== author && item.permlink !== permlink,
    );
    setPosts(newPosts);
    props.setPosts(newPosts);
  };

  return (
    <div style={{ overflowX: 'auto', wordWrap: 'normal', wordBreak: 'normal' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">Title</TableCell>
            <TableCell padding="checkbox">Author</TableCell>
            <TableCell padding="checkbox">Permlink</TableCell>
            <TableCell padding="checkbox" />
          </TableRow>
        </TableHead>
        <TableBody>
          {posts.map(b => (
            <TableRow hover key={b.username}>
              <TableCell padding="checkbox">{b.title}</TableCell>
              <TableCell padding="checkbox">{b.author}</TableCell>
              <TableCell padding="checkbox">{b.permlink}</TableCell>
              <TableCell padding="checkbox">
                <MuiThemeProvider theme={theme}>
                  <IconButton
                    color="primary"
                    onClick={() => handlePostRemove(b.author, b.permlink)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </MuiThemeProvider>
              </TableCell>
            </TableRow>
          ))}
          <TableRow key="input">
            <TableCell padding="checkbox" />
            <TableCell padding="checkbox" />
            <TableCell padding="checkbox" />
            <TableCell padding="checkbox">
              <PostSelectorInput posts={posts} setPosts={setPosts} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default withSnackbar(PostSelector);
