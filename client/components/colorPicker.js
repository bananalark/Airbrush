import React from 'react'
import reactCSS from 'reactcss'
import {SwatchesPicker} from 'react-color'
import {connect} from 'react-redux'
import {toggleColorPicker} from '../store'

import FormatPaint from '@material-ui/icons/FormatPaint'

class ColorPicker extends React.Component {
  handleClick = () => {
    this.props.toggleColorPicker()
  }

  handleChange = color => {
    this.props.setColor(color.rgb)
    this.props.toggleColorPicker()
  }

  render() {
    const styles = reactCSS({
      default: {
        color: {
          width: '80px',
          height: '16px',
          borderRadius: '1px',
          background: `rgba(${this.props.selectedColor.color.r}, ${
            this.props.selectedColor.color.g
          }, ${this.props.selectedColor.color.b}, ${
            this.props.selectedColor.color.a
          })`
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
        <FormatPaint />
        {`    `}
        <div style={styles.swatch} onClick={this.handleClick}>
          <div style={styles.color} />
        </div>
        {this.props.colorPicker ? (
          <div style={styles.popover}>
            <div style={styles.cover} onClick={this.handleClick} />
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
    selectedColor: state.color,
    colorPicker: state.expansionPanels.colorPicker
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setColor(color) {
      dispatch({type: 'GET_COLOR', color})
    },
    toggleColorPicker: () => {
      dispatch(toggleColorPicker())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ColorPicker)
