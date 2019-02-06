import React from 'react'
import PropTypes from 'prop-types'
import {Grid, Card, CardMedia, Typography, withStyles} from '@material-ui/core'

const styles = {
  card: {
    maxWidth: 250,
    justify: 'center',
    alignItems: 'center'
  },
  media: {
    height: 250,
    width: 250
  }
}

function InstructionAccessibility(props) {
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
              <CardMedia className={classes.media} image="nose.png" />
            </Card>
          </Grid>

          <Grid item md={9}>
            <Typography variant="h3">Accessibility</Typography>
            <Typography component="p">
              Create your drawing in your own way! You can choose from the tool
              bar to draw with you right hand, your left hand, or even your
              nose. Nose is our favorite drawing tool when we are sitting near
              the camera.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

InstructionAccessibility.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(InstructionAccessibility)
