import React from 'react'
import {Parallaxprovider} from 'react-scroll-parallax'
import style from './style/landingPage.scss'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import {Link} from 'react-router-dom'

const LandingPage = () => {
  return (
    <div>
      <Parallaxprovider>
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid item>
            <Typography variant="h1">Airbrush</Typography>
          </Grid>
          <Grid item>
            <Link to="/camera">
              <Button>
                <Typography variant="h5">start drawing</Typography>
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Parallaxprovider>
    </div>
  )
}

export default LandingPage
