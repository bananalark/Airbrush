import React from 'react'
import PropTypes from 'prop-types'
import {
  Grid,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  withStyles
} from '@material-ui/core'

const styles = {
  card: {
    maxWidth: 345,
    justify: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  media: {
    height: 50,
    width: 50
  },
  content: {
    height: 140
  }
}

function About(props) {
  const {classes} = props
  return (
    <Grid
      container
      spacing={24}
      direction="column"
      alignItems="center"
      justify="center"
      style={{minHeight: '100vh'}}
      justify="space-around"
    >
      <Grid item xs={6}>
        <Typography variant="h3">Creative Tools</Typography>
      </Grid>

      <Grid>
        <Grid container spacing={24} justify="center" alignItems="center">
          <Grid item md={3}>
            <Card className={classes.card}>
              <CardActionArea>
                <CardMedia className={classes.media} image="nose.png" />
                <CardContent className={classes.content}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Accessibility for Everyone
                  </Typography>
                  <Typography component="p">
                    Create your drawing with any part of body that you would
                    like to be traced on. It can be even on your nose.
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item md={3}>
            <Card className={classes.card}>
              <CardActionArea>
                <CardMedia className={classes.media} image="hand.png" />
                <CardContent className={classes.content}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Motion Control
                  </Typography>
                  <Typography component="p">
                    Mouse free experience. Toggle to the tool bar. Hold it for
                    three seconds and now you can grab your favorite brush and
                    color.
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item md={3}>
            <Card className={classes.card}>
              <CardActionArea>
                <CardMedia className={classes.media} image="voice.png" />
                <CardContent className={classes.content}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Voice Control
                  </Typography>
                  <Typography component="p">
                    Too busy drawing and no free hand? Turn on the voice
                    control. It will listen to you and start or stop drawing
                    whenever you'd like.
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
About.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(About)
