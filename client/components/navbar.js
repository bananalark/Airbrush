import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import {stack as Menu} from 'react-burger-menu'

// const Navbar = ({handleClick, isLoggedIn}) => (
class Navbar extends React.Component {
  showSetting(event) {
    event.preventDefault()
  }
  render() {
    return (
      <div>
        <h1>Airbrush</h1>
        <Menu right>
          <a id="home" className="menu-item" href="/">
            Home
          </a>
          <a id="about" className="menu-item" href="/about">
            About
          </a>
          <a id="login" className="menu-item" href="/login">
            Login
          </a>
          <a id="signup" className="menu-item" href="/signup">
            Signup
          </a>
          <a id="camera" className="menu-item" href="/canvas">
            Canvas
          </a>
          <a onClick={this.showSettings} className="menu-item--small" href="">
            Settings
          </a>
        </Menu>
        <hr />
      </div>
    )
  }
}

const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
