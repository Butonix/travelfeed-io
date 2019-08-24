import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles(theme => ({
  cardHeader: {
    backgroundColor: theme.palette.grey[200],
  },
  ul: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
}));

const tiers = [
  {
    title: 'Steem account + TravelFeed EasyLogin',
    subheader: 'Most popular',
    description: [
      'Want to log in to TravelFeed with a password of your choice',
      'Want to use TravelFeed as comfortable as possible',
      'Want to be able to post without needing your Steem private key',
    ],
    buttonText: 'Get started',
    buttonVariant: 'contained',
  },
  {
    title: 'Steem account',
    subheader: 'Recommended for geeks',
    description: [
      'Want full control over your account and transactions',
      'Use a password manager',
      'Are experienced with cryptocurrency',
      'Are comfortable with using a 52-digit private key to log in to TravelFeed',
    ],
    buttonText: 'Get started',
    buttonVariant: 'outlined',
  },
];

export default function AccountTypePicker(props) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Grid container spacing={5} alignItems="flex-start">
        {tiers.map((tier, i) => (
          // Enterprise card is full width at sm breakpoint
          <Grid item key={tier.title} xs={12} sm={6} md={6}>
            <Card>
              <CardHeader
                title={tier.title}
                subheader={tier.subheader}
                titleTypographyProps={{ align: 'center' }}
                subheaderTypographyProps={{ align: 'center' }}
                className={classes.cardHeader}
              />
              <CardContent>
                <div className="text-center pb-2">Recommended, if you:</div>
                <ul className={classes.ul}>
                  {tier.description.map(line => (
                    <Typography
                      align="center"
                      component="li"
                      variant="subtitle1"
                      className="pt-2"
                      key={line}
                    >
                      {line}
                    </Typography>
                  ))}
                </ul>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant={tier.buttonVariant}
                  onClick={props.setAccountType(i)}
                  color="primary"
                >
                  {tier.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
}
