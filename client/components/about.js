import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-scroll'
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
    <div className="aboutContainer">
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
        <div className="aboutCardContainer">
          <Grid>
            <Grid container spacing={40}>
              <Grid item md={3}>
                <Card className={classes.card}>
                  <CardActionArea>
                    <div className="emoji">
                      <CardMedia className={classes.media} image="nose.png" />
                    </div>
                    <CardContent className={classes.content}>
                      <Typography gutterBottom variant="h5" component="h2">
                        Accessibility
                      </Typography>
                      <Typography component="p">
                        Create your drawing with your body movement. It can be
                        your right hand, left hand, even your nose.
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Link
                      activeClass="active"
                      className="test6"
                      to="anchor2"
                      spy={true}
                      smooth={true}
                      duration={500}
                    >
                      <Button size="small" color="primary">
                        Learn More
                      </Button>
                    </Link>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item md={3}>
                <Card className={classes.card}>
                  <CardActionArea>
                    <div className="emoji">
                      <CardMedia className={classes.media} image="hand.png" />
                    </div>
                    <CardContent className={classes.content}>
                      <Typography gutterBottom variant="h5" component="h2">
                        Motion Control
                      </Typography>
                      <Typography component="p">
                        Mouse free experience. Toggle to the tool bar. Hold it
                        for three seconds. And you will see the menu changes
                        automatically.
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
                    <div className="emoji">
                      <CardMedia className={classes.media} image="voice.png" />
                    </div>
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
        </div>
      </Grid>
    </div>
  )
}
About.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(About)
