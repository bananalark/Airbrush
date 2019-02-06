import React from 'react'
import PropTypes from 'prop-types'
import {Grid, Card, CardMedia, Typography, withStyles} from '@material-ui/core'

const styles = {
  card: {
    maxWidth: 265,
    justify: 'center',
    alignItems: 'center'
  },
  media: {
    height: 250,
    width: 250
  }
}

function InstructionMotion(props) {
  const {classes} = props
  return (
    <div className="motionControlContainer">
      <div className="instructionContainer">
        <Grid
          container
          spacing={24}
          direction="row"
          alignItems="center"
          style={{minHeight: '100vh'}}
          justify="space-around"
        >
          <Grid container spacing={24}>
            <Grid item md={3}>
              <Card className={classes.card}>
                <CardMedia className={classes.media} image="hand.png" />
              </Card>
            </Grid>

            <Grid item md={9}>
              <Typography variant="h3">Motion Control</Typography>
              <Typography component="p">
                Try use this magic. You can select canvas options by hovering
                your hand over the toolbar, and when drawing with your right or
                left hand, you can control drawing by opening or closing a fist.
                To select a button on the toolbar, hover your hand for about
                three second over the area on the screen where it appears. For
                gesture control, set body part to right or left hand. Start a
                line by showing an open hand for a second or two - this works
                best when standing in front of a neutral background, a few feet
                from your computer, and with your whole upper body in the frame.
                To stop a line, close your hand into a fist.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

InstructionMotion.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(InstructionMotion)
