import React, { Component } from 'react'
import EventListener from 'react-event-listener'

export const TINY = 1
export const SMALL = 2
export const MEDIUM = 3
export const LARGE = 4

export default function (ComposedComponent) {
  let resizeInterval = 166
  class DetectWidth extends Component {
    state = {
      /**
       * For the server side rendering,
       * let's set the width for the slower environment.
       */
      width: SMALL
    }

    componentDidMount() {
      this.updateWidth()
    }

    componentWillUnmount() {
      clearTimeout(this.deferTimer)
    }

    handleResize = () => {
      clearTimeout(this.deferTimer)
      this.deferTimer = setTimeout(() => {
        this.updateWidth()
      }, resizeInterval)
    }

    updateWidth() {
      const innerWidth = window.innerWidth
      let width

      if (innerWidth >= 992) {
        width = LARGE
      } else if (innerWidth >= 768) { // innerWidth < 768
        width = MEDIUM
      } else if (innerWidth >= 568) {
        width = SMALL
      } else {
        width = TINY
      }

      if (width !== this.state.width) {
        this.setState({
          width: width
        })
      }
    }

    render() {
      return (
        <EventListener elementName="window" onResize={this.handleResize}>
          <ComposedComponent
            {...this.props}
            width={this.state.width}
          />
        </EventListener>
      )
    }
  }

  return DetectWidth
}
