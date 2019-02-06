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

function InstructionVoice(props) {
  const {classes} = props
  return (
    <div className="InstructionVoiceContainer">
      <Grid
        container
        spacing={24}
        direction="column"
        alignItems="center"
        justify="center"
        style={{minHeight: '100vh'}}
        justify="space-around"
      >
        <div className="InstructionVoiceCardContainer">
          <Grid>
            <Grid container spacing={40}>
              <Grid item md={3}>
                <Card className={classes.card}>
                  <CardActionArea>
                    <div className="emoji">
                      <CardMedia className={classes.media} image="nose.png" />
                    </div>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item md={9}>
                Place Holder for discriptions
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </div>
  )
}

InstructionVoice.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(InstructionVoice)
