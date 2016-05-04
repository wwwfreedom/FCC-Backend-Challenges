import React, { Component, PropTypes } from 'react'
import Drawer from 'material-ui/Drawer'
import {List, ListItem, MakeSelectable} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'

const SelectableList = MakeSelectable(List)

export class AppNavDrawer extends Component {
  static propTypes = {
    docked: PropTypes.bool.isRequired,
    onRequestChangeNavDrawer: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    style: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object
  };

  handleRequestChangeLink = (event, value) => {
    // open external links in a new tab
    if (value.includes('http://')) {
      window.open(value, '_blank')
    } else {
      this.context.router.push(value)
    }
    this.props.onRequestChangeNavDrawer(false)
  }

  render() {
    const { docked, open, onRequestChangeNavDrawer } = this.props
    return (
      <Drawer
        docked={docked}
        open={open}
        onRequestChange={onRequestChangeNavDrawer}
      >
        <SelectableList
          value=""
          onChange={this.handleRequestChangeLink}
        >
          <Subheader>Quoc Truong</Subheader>
          <ListItem primaryText="Sign In" value="/signin" />
          <ListItem primaryText="Sign Out" value="/signout" />
          <ListItem
            primaryText="Material Design"
            value="https://www.google.com/design/spec/material-design/introduction.html"
          />
        </SelectableList>
      </Drawer>
    )
  }
}

export default AppNavDrawer
