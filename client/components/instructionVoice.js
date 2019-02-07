import React from 'react'
import PropTypes from 'prop-types'
import {Grid, Card, CardMedia, Typography, withStyles} from '@material-ui/core'

const styles = {
  card: {
    maxWidth: 255,
    justify: 'center',
    alignItems: 'center'
  },
  media: {
    height: 250,
    width: 250
  }
}

function InstructionVoice(props) {
  const {classes} = props
  return (
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
              <CardMedia className={classes.media} image="voice.png" />
            </Card>
          </Grid>

          <Grid item md={9}>
            <Typography variant="h3">Voice Control</Typography>
            <Typography component="p">
              When Voice Mode is turned on, you can start painting by saying
              "Start," stop painting by saying "Stop," and erase by saying...
              you guessed, it - "Erase"!
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

InstructionVoice.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(InstructionVoice)
