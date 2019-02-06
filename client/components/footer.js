import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {withStyles, Typography, Grid} from '@material-ui/core'

const styles = theme => ({
  root: {
    flexGrow: 1
  }
  //   fooder: {
  //     margin: theme.spacing.unit,
  //     position: "fixed",
  //     left: 0,
  //     bottom: 0,
  //     background: '#A9A9A9'
  //   }
})

function Footer(props) {
  const {classes} = props

  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs={6} sm={3}>
          Amber
        </Grid>
        <Grid item xs={6} sm={3}>
          Kathleen
        </Grid>
        <Grid item xs={6} sm={3}>
          Laura
        </Grid>
        <Grid item xs={6} sm={3}>
          Wenyi
        </Grid>
        <div className="footer">
          <Link to="/privacy">
            <Typography variant="button" gutterBottom>
              Privacy Policy
            </Typography>
          </Link>
        </div>
      </Grid>
    </div>
  )
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Footer)
