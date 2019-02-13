import React, {Component} from 'react'
import Grid from '@material-ui/core/Grid'
import Toolbar from './toolbar'
import {download} from '../utils/snapshot'
import Lightbox from 'lightbox-react'
import 'lightbox-react/style.css'
import Button from '@material-ui/core/Button'
import Save from '@material-ui/icons/Save'
import {createMuiTheme} from '@material-ui/core/styles'
import store from '../store'
import {takeSnapshot, lightboxOff} from '../store/lightbox'
import {connect} from 'react-redux'
import {Switch, withStyles, FormControlLabel} from '@material-ui/core'
import {bindPage} from '../utils/camera'

const styles = theme => ({
  colorBar: {},
  colorChecked: {},
  iOSSwitchBase: {
    '&$iOSChecked': {
      color: theme.palette.common.white,
      '& + $iOSBar': {
        backgroundColor: '#52d869'
      }
    },
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.sharp
    })
  },
  iOSChecked: {
    transform: 'translateX(15px)',
    '& + $iOSBar': {
      opacity: 1,
      border: 'none'
    }
  },
  iOSBar: {
    borderRadius: 13,
    width: 42,
    height: 26,
    marginTop: -13,
    marginLeft: -21,
    border: 'solid 1px',
    borderColor: theme.palette.grey[400],
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border'])
  },
  iOSIcon: {
    width: 24,
    height: 24
  },
  iOSIconChecked: {
    boxShadow: theme.shadows[1]
  }
})

class CameraComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showCanvas: false,
      checkedButton: false
    }
    this.openLightbox = this.openLightbox.bind(this)
  }

  componentDidMount() {
    bindPage()
  }
  componentDidUpdate(prevProps) {
    return prevProps.showLightbox !== this.props.showLightbox
  }

  //defining this here allows "str" (which is the canvas.toDataURL()) info to be pulled up from the Toolbar component and fed to Lightbox
  openLightbox(str) {
    store.dispatch(takeSnapshot(str))
  }
  handleChange = name => event => {
    this.setState({[name]: event.target.checked})
  }
  render() {
    let {classes} = this.props

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
              onCloseRequest={() => store.dispatch(lightboxOff())}
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
                <div id="OnOffButton">
                  <FormControlLabel
                    control={
                      <Switch
                        classes={{
                          switchBase: classes.iOSSwitchBase,
                          bar: classes.iOSBar,
                          icon: classes.iOSIcon,
                          iconChecked: classes.iOSIconChecked,
                          checked: classes.iOSChecked
                        }}
                        disableRipple
                        checked={this.state.checkedButton}
                        onChange={this.handleChange('checkedButton')}
                        value="checkedButton"
                      />
                    }
                    label="On"
                  />
                </div>
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
    showLightbox: state.lightbox.showLightbox,
    snapshot: state.lightbox.imageStr
  }
}

const connectedRedux = connect(mapState)(CameraComponent)
export default withStyles(styles)(connectedRedux)
