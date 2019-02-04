import React, {Component} from 'react'
import {connect} from 'react-redux'

class CustomPopUp extends Component {
  render() {
    return (
      // <div className={"custom-pop-up " + (this.props.[what?] === true? "open" : "closed")}>
      <div
        id={this.props.id}
        className={'custom-pop-up ' + (this.props.className || 'closed')}
      >
        {/* <p>{this.props.title}</p> */}
        {this.props.children}
      </div>
    )
  }
}

// const mapStateToProps = (state) => {
//   return {
// will return brushDrawerOpen && bodyPartDrawerOpen
//   }
// }

// const mapDispatchToProps = (dispatch) => {

// }

// example of conditional ClassName
{
  /* <div className={"btn-group pull-right " + (this.props.showBulkActions ? 'show' : 'hidden')}> */
}

// export default connect(mapStateToProps, mapDispatchToProps)(CustomPopUp)

export default CustomPopUp
