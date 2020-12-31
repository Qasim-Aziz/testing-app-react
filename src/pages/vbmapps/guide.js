import React, { Component } from 'react'
import Authorize from 'components/LayoutComponents/Authorize'
import { gql } from 'apollo-boost'
import client from '../../apollo/config'

class Guide extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chapter: 1,
      details: '',
    }
  }

  componentDidMount() {
    const { chapter } = this.state
    this.getChapter(chapter)
  }

  getChapter = x => {
    client
      .mutate({
        mutation: gql`
      mutation{
        vbmappGuide(input:{
            chapter:${x}
        })
        {
            details
        }
    }`,
      })
      .then(result => {
        console.log(JSON.stringify(result.data.vbmappGuide.details))
        this.setState({
          details: result.data.vbmappGuide.details,
        })
      })
      .catch(err => console.log(JSON.stringify(err)))
  }

  renderChapters = () => {
    const list = []
    let bg = ''
    let textColor = ''
    const { chapter } = this.state
    for (let x = 1; x <= 10; x += 1) {
      if (chapter === x) {
        bg = '#3E7BFA'
        textColor = '#FFF'
      } else {
        bg = '#FFF'
        textColor = '#000'
      }
      list.push(
        <div
          role="button"
          onKeyDown={this.handleKeyDown}
          tabIndex="0"
          onClick={() => {
            this.setState({
              chapter: x,
            })
            this.getChapter(x)
          }}
          style={{
            backgroundColor: bg,
            color: textColor,
            cursor: 'pointer',
            boxShadow:
              '0px 0px 1px rgba(0, 0, 0, 0.08), 0px 0px 2px rgba(0, 0, 0, 0.12), 0px 4px 8px rgba(0, 0, 0, 0.08)',
            paddingTop: 10,
            paddingBottom: 10,
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 10,
            flex: 1,
            marginTop: 20,
          }}
        >
          <p style={{ fontSize: 20, fontWeight: '700' }}>Chapter {x}</p>
          <p style={{ marginTop: 10 }}>This is chapter {x}</p>
        </div>,
      )
    }
    return list
  }

  render() {
    const { details, chapter } = this.state
    const filteredDetails = details.replace(/\\n/g, '')
    const withoutBackslashes = filteredDetails.replace(/\\/g, '')
    const final = withoutBackslashes.replace(/^"(.*)"$/, '$1')
    return (
      <Authorize roles={['parents', 'therapist', 'school_admin']} redirect to="/dashboard/beta">
        <div style={{ height: '100%', width: '100%' }}>
          <div className="row">
            <div className="col-md-3 col-sm-3">{this.renderChapters()}</div>
            <div className="col-md-9 col-sm-9">
              {details === '' ? (
                <p>Loading Chapter...</p>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: final }} />
              )}
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default Guide
