import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import LoginButton from '../Header/LoginButton';

const LoggedOutFeed = props => {
  const [open, setOpen] = useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        className="pt-2"
      >
        <Grid
          item
          lg={props.grid.lg}
          md={props.grid.md}
          sm={props.grid.sm}
          xs={props.grid.xs}
        >
          <Card>
            <CardContent>
              <div className="text-center">
                <Typography gutterBottom variant="body1" className="pb-2">
                  Join TravelFeed to create your custom feed
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  className="text-light"
                  onClick={handleOpen}
                >
                  Create your free account
                </Button>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {open && (
        <LoginButton
          open={open}
          hideButtons
          onClickClose={() => setOpen(false)}
          text=" and customize your feed"
        />
      )}
    </>
  );
};

export default LoggedOutFeed;
