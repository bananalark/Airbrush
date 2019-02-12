import React from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {withStyles, Typography, Grid} from '@material-ui/core'

const styles = theme => ({
  root: {
    flexGrow: 1
  }
})

function Footer(props) {
  const {classes} = props

  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
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
