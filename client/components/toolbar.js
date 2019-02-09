import React, {Component} from 'react'

import Buttons from './buttons'

class Toolbar extends Component {
  render() {
    let {openLightbox} = this.props

    return (
      <div>
        <Buttons openLightbox={openLightbox} />
      </div>
    )
  }
}

export default Toolbar
