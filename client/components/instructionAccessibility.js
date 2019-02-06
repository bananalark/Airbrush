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
    alignItems: 'center'
  },
  media: {
    height: 450,
    width: 450
  }
}

function InstructionAccessibility(props) {
  const {classes} = props
  return (
    <div className="InstructionAccessibilityContainer">
      <Grid
        container
        spacing={24}
        direction="column"
        alignItems="center"
        style={{minHeight: '100vh'}}
        justify="space-around"
      >
        <div className="InstructionAccessibilityCardContainer">
          <Grid>
            <Grid container spacing={16}>
              <Grid item md={3}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.media}
                    image="accessibility.jpg"
                  />
                </Card>
              </Grid>
              <Grid item md={9}>
                <Typography variant="h3">Accessibility</Typography>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </div>
  )
}

InstructionAccessibility.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(InstructionAccessibility)
