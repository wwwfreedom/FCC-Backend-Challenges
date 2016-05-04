import React, { Component, PropTypes } from 'react'
import '../../styles/core.scss'
import Header from 'containers/Header/Header'
import DetectWidth from 'containers/DetectWidth'
import AppNavDrawer from 'containers/AppNavDrawer'

export class CoreLayout extends Component {
  static propTypes = {
    children: PropTypes.element,
    width: PropTypes.number.isRequired
  };

  state = {
    navDrawerOpen: false
  };

  handleMobileMenuClick = () => {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen
    })
  };

  handleChangeRequestNavDrawer = (open, reasonForChange) => {
    this.setState({
      navDrawerOpen: open
    })
  };

  render() {
    const { children } = this.props
    let { navDrawerOpen } = this.state
    let docked = false

    return (
      <div className='page-container'>
        <Header width={this.props.width} mobileMenuClick={this.handleMobileMenuClick} />
        <AppNavDrawer
          docked={docked}
          onRequestChangeNavDrawer={this.handleChangeRequestNavDrawer}
          open={navDrawerOpen}
        />
        <div className='view-container'>
          {children}
        </div>
      </div>
    )
  }
}

export default DetectWidth(CoreLayout)
