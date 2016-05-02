import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {actions as <%= pascalEntityName %>Actions} from 'redux/modules/<%= pascalEntityName %>'

export class <%= pascalEntityName %> extends Component {
  static propTypes = {
  }

  render() {
    return (
    )
  }
}

const mapStateToProps = (state) => ({
})

export default connect(
  mapStateToProps,
  <%= pascalEntityName %>Actions,
)(<%= pascalEntityName %>)
