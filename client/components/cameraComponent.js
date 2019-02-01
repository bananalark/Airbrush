import React, {Component} from 'react'
import ColorPicker from './colorPicker'
import {connect} from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Toolbar from './toolbar'
import {download} from '../utils/draw'
import Lightbox from 'lightbox-react'
import 'lightbox-react/style.css'
import Button from '@material-ui/core/Button'
import Save from '@material-ui/icons/Save'

class CameraComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {showLightbox: false, snapshot: '', showCanvas: false}
    this.openLightbox = this.openLightbox.bind(this)
  }

  componentDidMount() {
    require('../utils/camera')
  }

  //defining this here allows the canvas.toDataURL() info to be pulled up from the Toolbar component and fed to Lightbox
  openLightbox(str) {
    this.setState({showLightbox: true, snapshot: str})
  }

  render() {
    return (
      <div>
        {this.state.showLightbox && (
          <div>
            <Lightbox
              mainSrc={this.state.snapshot}
              imagePadding={10}
              toolbarButtons={[
                <Button id="download" onClick={download} color="white">
                  <Save />download
                </Button>
              ]}
              onCloseRequest={() => this.setState({showLightbox: false})}
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
              <Grid item>
                <video id="video" plays-inline="true" />
              </Grid>
              <Toolbar openLightbox={this.openLightbox} />
              <div style={{position: 'relative'}}>
                <canvas id="background" />
                <canvas id="output" />
              </div>
            </div>
          </Grid>
        </Grid>
        <canvas id="saved-image" />
      </div>
    )
  }
}

export default CameraComponent
