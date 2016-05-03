import React, { Component, PropTypes } from 'react'
import '../../styles/core.scss'
import Header from 'containers/Header/Header'
import DetectWidth from 'containers/DetectWidth'

export class CoreLayout extends Component {
  static propTypes = {
    children: PropTypes.element,
    width: PropTypes.number.isRequired
  }

  render() {
    const { children } = this.props
    return (
      <div className='page-container'>
        <Header width={this.props.width} />
        <div className='view-container'>
          {children}
        </div>
      </div>
    )
  }
}

export default DetectWidth(CoreLayout)
