import React, {Component} from 'react'
import Grid from '@material-ui/core/Grid'
import Toolbar from './toolbar'
import {download} from '../utils/draw'
import Lightbox from 'lightbox-react'
import 'lightbox-react/style.css'
import Button from '@material-ui/core/Button'
import Save from '@material-ui/icons/Save'
import {createMuiTheme} from '@material-ui/core/styles'
import {VALID_FAN_MODE_VALUES} from '@tensorflow/tfjs-layers/dist/initializers'

class CameraComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {showLightbox: false, snapshot: '', showCanvas: false}
    this.openLightbox = this.openLightbox.bind(this)
  }

  componentDidMount() {
    require('../utils/camera')
  }

  //defining this here allows "str" (which is the canvas.toDataURL()) info to be pulled up from the Toolbar component and fed to Lightbox
  openLightbox(str) {
    this.setState({showLightbox: true, snapshot: str})
  }

  render() {
    //for changing button color
    const theme = createMuiTheme({
      typography: {
        useNextVariants: true
      },
      palette: {
        primary: {main: '#FFFFFF'}
      }
    })
    return (
      <div>
        {this.state.showLightbox && (
          <div>
            <Lightbox
              mainSrc={this.state.snapshot}
              imagePadding={10}
              toolbarButtons={[
                <Button id="download" onClick={download} color="primary">
                  <Save /> download
                </Button>
              ]}
              onCloseRequest={() => this.setState({showLightbox: false})}
              enableZoom={false}
              // in case we want to put a title to the image
              imageTitle=""
            />
          </div>
        )}
        <div id="info" />
        <Grid
          container
          direction="column"
          justify="center"
          alignContent="center"
          id="main"
        >
          <Grid container direction="column">
            <div id="display">
              <video id="video" plays-inline="true" style={{display: 'none'}} />
              <Toolbar openLightbox={this.openLightbox} />
              <div style={{position: 'relative'}}>
                <canvas id="background" />
                <canvas id="output" />
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default CameraComponent
