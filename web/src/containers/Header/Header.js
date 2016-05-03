import React, { Component } from 'react'
import AppBar from 'material-ui/AppBar'
import {Link} from 'react-router'
import FlatButton from 'material-ui/flatButton'

// lesson: to stop css flicker use inline style for simple component or critical component like header
const style = {
  title: {
    color: 'white',
    textDecoration: 'none'
  },
  navLink: {
    height: '64px',
    color: 'white'
  }
}

class Header extends Component {
  render() {
    return (
      <AppBar
        title={<Link to='/' style={style.title} >Auth</Link>}
        showMenuIconButton={false}
      >
        <Link to='/signin'>
          <FlatButton label='Sign in' style={style.navLink} />
        </Link>
      </AppBar>
    )
  }
}

export default Header
