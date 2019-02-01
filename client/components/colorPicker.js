import React from 'react'
import reactCSS from 'reactcss'
import {SwatchesPicker} from 'react-color'
import {connect} from 'react-redux'

class ColorPicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      displayColorPicker: false
    }
  }

  handleClick = () => {
    this.setState({displayColorPicker: !this.state.displayColorPicker})
  }

  handleClose = () => {
    this.setState({displayColorPicker: false})
  }

  handleChange = color => {
    this.props.setColor(color.rgb)
  }

  render() {
    console.log('this.props.selectedColor:', this.props.selectedColor)
    const styles = reactCSS({
      default: {
        color: {
          width: '80px',
          height: '16px',
          borderRadius: '1px',
          background: `rgba(${this.props.selectedColor.r}, ${
            this.props.selectedColor.g
          }, ${this.props.selectedColor.b}, ${this.props.selectedColor.a})`
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer'
        },
        popover: {
          position: 'absolute',
          zIndex: '2'
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px'
        }
      }
    })
    return (
      <div id="color-picker">
        <div style={styles.swatch} onClick={this.handleClick}>
          <div style={styles.color} />
        </div>
        {this.state.displayColorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClose} />
            <SwatchesPicker
              color={this.props.selectedColor}
              onChange={this.handleChange}
            />
          </div>
        ) : null}
      </div>
    )
  }
}

const mapStateToProps = function(state) {
  return {
    selectedColor: state.color
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setColor(color) {
      dispatch({type: 'GET_COLOR', color})
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ColorPicker)
