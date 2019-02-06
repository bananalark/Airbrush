import React, {Component} from 'react'
import Grid from '@material-ui/core/Grid'
import Toolbar from './toolbar'
import {download} from '../utils/draw'
import Lightbox from 'lightbox-react'
import 'lightbox-react/style.css'
import Button from '@material-ui/core/Button'
import Save from '@material-ui/icons/Save'
import {createMuiTheme} from '@material-ui/core/styles'
import store from '../store'
import {takeSnapshot} from '../store/lightbox'
import {connect} from 'react-redux'

class CameraComponent extends Component {
  constructor(props) {
    super(props)
    this.openLightbox = this.openLightbox.bind(this)
  }

  componentDidMount() {
    require('../utils/camera')
  }
  componentDidUpdate(prevProps) {
    return prevProps.showLightbox !== this.props.showLightbox
  }

  //defining this here allows "str" (which is the canvas.toDataURL()) info to be pulled up from the Toolbar component and fed to Lightbox
  openLightbox(str) {
    store.dispatch(takeSnapshot(str))
  }

  render() {
    console.log(this.props.showLightbox)
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
        {this.props.showLightbox && (
          <div>
            <Lightbox
              mainSrc={this.props.snapshot}
              imagePadding={10}
              toolbarButtons={[
                <Button id="download" onClick={download} color="primary">
                  <Save /> download
                </Button>
              ]}
              onCloseRequest={() => this.setState({showLightbox: false})}
              enableZoom={false}
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
                <canvas id="painting-pointer" />
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    )
  }
}

const mapState = state => {
  return {
    showLightbox: state.showLightbox,
    snapshot: state.imageStr
  }
}

export default connect(mapState)(CameraComponent)
