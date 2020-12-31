/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-no-undef */
import React from 'react'

const { TextArea } = Input

class YouTubeView extends React.Component {
  state = {
    viewData: data.viewData,
    VimeoVideoPlay: {},
    VimeoVideoNext: [],
  }

  componentDidMount() {
    const projectId = this.props

    alert(projectId)

    const query = `{
      VimeoVideos(project:"${projectId.match.params.id}", first:8)  {
        edges {
          node {
            id,
            status,
            name,
            url,
            duration,
            description,
            thubUrl
          }
        }
      }
    }`

    GraphQLClient.request(query).then(data2 => {
      this.setState({
        VimeoVideoPlay: data2.VimeoVideos.edges[0].node,
      })

      data2.VimeoVideos.edges.shift()

      this.setState({
        VimeoVideoNext: data2.VimeoVideos.edges,
      })
    })
  }

  render() {
    const { viewData, VimeoVideoNext, VimeoVideoPlay } = this.state
    console.log(VimeoVideoPlay)
    return (
      <div>
        <Helmet title="YouTube View" />
        <section className="card">
          <div className="card-header">
            <div className="utils__title">
              <strong>Course View</strong>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default YouTubeView
