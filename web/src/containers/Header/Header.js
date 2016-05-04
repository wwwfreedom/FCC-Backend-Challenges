import React, { Component, PropTypes } from 'react'
import AppBar from 'material-ui/AppBar'
import {Link} from 'react-router'
import FlatButton from 'material-ui/flatButton'
import { TINY, SMALL, LARGE } from 'containers/DetectWidth'
import RaisedButton from 'material-ui/RaisedButton'

class Header extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    mobileMenuClick: PropTypes.func.isRequired
  };

  getStyle() {
  // lesson: to stop css flicker use inline style for simple component or critical component like header
    let styles = {
      title: {
        color: 'white',
        textDecoration: 'none'
      },
      navLink: {
        height: '64px',
        color: 'white'
      },
      navLinkButton: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: '1em',
        marginRight: '1em'
      }
    }

    if (this.props.width <= SMALL) {
      styles = {
        ...styles,
        appBar: {
          paddingRight: '0px'
        }
      }
    }

    if (this.props.width === TINY) {
      styles = {
        ...styles,
        appBarTitle: {
          justifyContent: 'center',
          flex: '',
          margin: '0 auto'
        },
        navLink: {
          display: 'none'
        },
        navLinkButton: {
          display: 'none'
        },
        appBar: {
          paddingRight: '62px' // to make the logo in the center
        }
      }
    }

    return styles
  }

  render() {
    let showMenuIconButton = true
    const styles = this.getStyle()
    if (this.props.width === LARGE) {
      showMenuIconButton = false
    }

    return (
      <AppBar
        title={<Link to='/' style={styles.title} >QT</Link>}
        showMenuIconButton={showMenuIconButton}
        titleStyle={styles.appBarTitle}
        style={styles.appBar}
        onLeftIconButtonTouchTap={this.props.mobileMenuClick}
      >
        <Link to='/signin'>
          <FlatButton label='Sign in' style={styles.navLink} />
        </Link>

        <Link to='/signin' style={styles.navLinkButton} key={1}>
          <RaisedButton label='Sign up' />
        </Link>
      </AppBar>
    )
  }
}

export default Header