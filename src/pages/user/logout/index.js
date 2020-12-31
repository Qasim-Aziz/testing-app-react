import { Component } from 'react'

class Logout extends Component {
  componentDidMount() {
    alert('fvgfdg')
    const { dispatch } = this.props
    dispatch({
      type: 'user/LOGOUT',
    })
  }
}

export default Logout
