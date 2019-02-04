import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import {Link} from 'react-router-dom'
// import {
//   Link,
//   Element,
//   Events,
//   animateScroll as scroll,
//   scroller
// } from 'react-scroll'
const LandingPage = () => {
  return (
    <div>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <Typography variant="h1">ai rbrush</Typography>
        </Grid>
        <Grid item>
          <Link to="/camera">
            <Button>
              <Typography variant="h5">start drawing</Typography>
            </Button>
          </Link>
        </Grid>
      </Grid>
    </div>
  )
}

export default LandingPage
