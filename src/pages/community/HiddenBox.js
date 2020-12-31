import React from 'react'
import Comments from './Comments'

export default class HiddenBox extends React.Component {
  constructor(props){
    super(props)
    this.showModal = this.showModal.bind(this)
  }

  showModal=data=>{
    const propData = this.props
    propData.showModal(data)
  }

  render() {
    const propData = this.props
    return (
      <div>
        <Comments
          blogs={propData.comments}
          node={propData.node}
          showCmModal={(data)=>{this.showModal(data)}}
        />
      </div>
    )
  }
}
