var ctxB
var ctxS
var wB = 150
var hB = 150
var wS = 30
var hS = 150
var drag = false
var rgbColor = 'rgb(255,0,0)' // red

function colorBlockFill() {
  ctxB.rect(0, 0, wB, hB)
  gradientBlock()
}

function colorStripFill() {
  ctxS.rect(0, 0, wS, hS)
  var grd1 = ctxS.createLinearGradient(0, 0, 0, hS)
  grd1.addColorStop(0, 'rgb(255, 0, 0)') // red
  grd1.addColorStop(0.17, 'rgb(255, 255, 0)') // yellow
  grd1.addColorStop(0.34, 'rgb(0, 255, 0)') // green
  grd1.addColorStop(0.51, 'rgb(0, 255, 255)') // aqua
  grd1.addColorStop(0.68, 'rgb(0, 0, 255)') // blue
  grd1.addColorStop(0.85, 'rgb(255, 0, 255)') // magenta
  grd1.addColorStop(1, 'rgb(255, 0, 0)') // red
  ctxS.fillStyle = grd1
  ctxS.fill()
}

function gradientBlock() {
  ctxB.fillStyle = rgbColor
  ctxB.fillRect(0, 0, wB, hB)
  var grdWhite = ctxB.createLinearGradient(0, 0, wB, 0)
  grdWhite.addColorStop(0, 'rgb(255,255,255)')
  grdWhite.addColorStop(1, 'transparent')
  ctxB.fillStyle = grdWhite
  ctxB.fillRect(0, 0, wB, hB)
  var grdBlack = ctxB.createLinearGradient(0, 0, 0, hB)
  grdBlack.addColorStop(0, 'transparent')
  grdBlack.addColorStop(1, 'rgb(0,0,0)')
  ctxB.fillStyle = grdBlack
  ctxB.fillRect(0, 0, wB, hB)
}

function selectColor(ctx, e, self) {
  var x = e.nativeEvent.offsetX
  var y = e.nativeEvent.offsetY
  var imageData = ctx.getImageData(x, y, 1, 1).data
  rgbColor =
    'rgb(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ')'
  self.setState({color: rgbColor})
}

var ColorPickerContainer = React.createClass({
  getInitialState: function() {
    return {
      isPickerVisible: true,
      color: rgbColor
    }
  },
  togglePicker: function() {
    this.setState({isPickerVisible: !this.state.isPickerVisible})
  },
  clickStrip: function(e) {
    selectColor(ctxS, e, this)
    gradientBlock()
  },
  mouseDownBlock: function(e) {
    drag = true
    selectColor(ctxB, e, this)
  },
  mouseMoveBlock: function(e) {
    if (drag) {
      selectColor(ctxB, e, this)
    }
  },
  mouseUpBlock: function() {
    drag = false
  },
  render: function() {
    return (
      <div>
        <ColorLabel
          isChecked={this.state.isPickerVisible}
          color={this.state.color}
          handleClick={this.togglePicker}
        />
        <ColorPicker
          isVisible={this.state.isPickerVisible}
          color={this.state.color}
          mouseDownBlock={this.mouseDownBlock}
          mouseMoveBlock={this.mouseMoveBlock}
          mouseUpBlock={this.mouseUpBlock}
          clickStrip={this.clickStrip}
        />
      </div>
    )
  }
})

var ColorLabel = React.createClass({
  handleClick: function() {
    this.props.handleClick()
  },
  render: function() {
    var styles = {
      backgroundColor: this.props.color
    }
    return (
      <div>
        <label
          htmlFor="color-input"
          id="color-label"
          onClick={this.handleClick}
          style={styles}
        />
        <input
          type="checkbox"
          id="color-input"
          checked={this.props.isChecked}
        />
      </div>
    )
  }
})

var ColorPicker = React.createClass({
  getInitialState: function() {
    return {
      color: rgbColor
    }
  },
  componentDidMount: function() {
    var canvasB = this.refs.canvasBlock
    var canvasS = this.refs.canvasStrip
    ctxB = canvasB.getContext('2d')
    ctxS = canvasS.getContext('2d')
    colorBlockFill()
    colorStripFill()
  },
  render: function(e) {
    var styles = {
      opacity: this.props.isVisible ? '1' : '0'
    }
    return (
      <div id="color-picker" style={styles}>
        <canvas
          id="color-block"
          height={hB}
          width={wB}
          onMouseDown={this.props.mouseDownBlock}
          onMouseMove={this.props.mouseMoveBlock}
          onMouseUp={this.props.mouseUpBlock}
          ref="canvasBlock"
        />
        <canvas
          id="color-strip"
          height={hS}
          width={wS}
          onClick={this.props.clickStrip}
          ref="canvasStrip"
        />
      </div>
    )
  }
})

React.render(
  <ColorPickerContainer />,
  document.getElementById('color-picker-container')
)
