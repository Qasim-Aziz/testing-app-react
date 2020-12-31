import React from 'react'
import ReactPlayer from 'react-player'
import { Card } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { Link } from 'react-router-dom'
import { gql } from 'apollo-boost'
import client from '../../apollo/config'
import bookmark from '../../icons/book-mark.png'
import like from '../../icons/like.png'

class TutorialStep2 extends React.Component {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      isLoading: true,
      currentVideoURL: props.location.videoUrl,
      currentVideoId: props.location.videoId,
      currentVideoTitle: props.location.videoTitle,
      currentVideoDuration: props.location.videoDuration,
      currentProjectId: props.location.projectId,
      currentVideoDesription: props.location.description,
      upcomingVideos: [],
    }
  }

  componentDidMount() {
    const { currentProjectId, currentVideoId } = this.state
    client
      .mutate({
        mutation: gql`mutation{
    videoStatus(input:{
        project:"${currentProjectId}",
        video:"${currentVideoId}",
        status:"Watching"
    }){ 
        result{
            video,
            status,
            user{
                id,
                username
            }
            project{
                id,
                name
            }
        }
    }
}`,
      })
      .then(result => {
        console.log(JSON.stringify(result))
        /* let already = false
        result.data.VimeoVideos.edges.forEach(video => {
          if (already === false) {
            switch (video.node.status) {
              case '1':
                break

              case '2':
                this.setState({
                  continueURL: video.node.url,
                })
                already = true
                break

              case '3':
                this.setState({
                  continueURL: video.node.url,
                })
                already = true
                break

              default:
                console.log('Default')
                break
            }
          }
        })
        if (already === false) {
          this.setState({
            continueURL: result.data.VimeoVideos.edges[0].node.url,
          })
        } */
      })
      .catch(err => console.log(err))
    this.getUpcomingVideos(currentProjectId)
  }

  getUpcomingVideos = projectId => {
    fetch(
      `https://api.vimeo.com/users/100800066/projects/${projectId}/videos?sort=last_user_action_event_date&page=1`,
      {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/vnd.vimeo.*+json',
          Authorization: 'Bearer 57fe5b03eac21264d45df680fb335a42',
        }),
      },
    )
      .then(res => res.json())
      .then(res => {
        console.log(res.data)
        this.setState({
          upcomingVideos: res.data,
          isLoading: false,
        })
      })
      .catch(err => console.log(err))
  }

  secondsToHms = d => {
    d = Number(d)
    const h = Math.floor(d / 3600)
    const m = Math.floor((d % 3600) / 60)
    const s = Math.floor((d % 3600) % 60)

    const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : ''
    const mDisplay = m > 0 ? m + (m === 1 ? ' minute, ' : ' minutes, ') : ''
    const sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : ''
    return hDisplay + mDisplay + sDisplay
  }

  likeCurrentVideo = () => {
    const { currentVideoId } = this.state
    client
      .query({
        query: gql`mutation {
    likeVideo(input:{pk:"${currentVideoId}"})
       { 
            status,
            message
       }
}`,
      })
      .then(result => {
        console.log(result)
      })
  }

  handleKeyDown = () => {}

  getVideoIdFromUrl = url => {
    const res = url.substring(8)
    return res
  }

  render() {
    const {
      isLoading,
      currentVideoId,
      currentVideoURL,
      currentVideoTitle,
      currentVideoDuration,
      upcomingVideos,
      currentProjectId,
      currentVideoDesription,
    } = this.state

    console.log(currentVideoURL)
    const { location } = this.props
    if (isLoading) {
      return <div>Loading....</div>
    }
    return (
      <Authorize roles={['parents', 'therapist', 'school_admin']} redirect to="/dashboard/beta">
        <div style={{ height: '100%', width: '100%' }}>
          <div className="row">
            <div className="col-sm-12 col-md-8">
              <div className="row mb-5">
                <div className="col-sm-12 col-md-12">
                  <ReactPlayer url={currentVideoURL} controls width="100%" />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-8 col-md-8">
                  <p style={{ fontSize: '24px', fontWeight: '700', marginBottom: '0px' }}>
                    {currentVideoTitle}
                  </p>
                  <p>Duration: {currentVideoDuration}</p>
                </div>
                <div className="col-sm-4 col-md-4" style={{ textAlign: 'right' }}>
                  <span
                    role="button"
                    tabIndex="0"
                    onClick={() => this.likeCurrentVideo}
                    onKeyDown={this.handleKeyDown}
                    style={{ fontSize: '18px', fontWeight: '200' }}
                  >
                    <img alt="like" src={like} style={{ width: '20px' }} />
                    Like
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: '200', marginLeft: '10px' }}>
                    {' '}
                    <img alt="bookmark" src={bookmark} style={{ width: '20px' }} />
                    Bookmark
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 col-md-12">{currentVideoDesription}</div>
              </div>
            </div>
            <div className="col-sm-6 col-md-4">
              <p style={{ fontSize: '28px', fontWeight: '700' }}>Upcoming Videos</p>
              <div className="row">
                {upcomingVideos &&
                  upcomingVideos.length > 0 &&
                  upcomingVideos.map(video => (
                    <div className="col-md-12 col-sm-12">
                      <div
                        role="button"
                        tabIndex="0"
                        onClick={() => {
                          this.setState({
                            currentVideoURL: video.link,
                            currentVideoTitle: video.name,
                            currentVideoDuration: this.secondsToHms(video.duration),
                          })
                          window.scrollTo(0, 0)
                          this.getUpcomingVideos(currentProjectId)
                        }}
                        onKeyDown={this.handleKeyDown}
                      >
                        <Card
                          hoverable
                          style={{
                            background: '#FDFDFD',
                            color: '#63686E',
                            boxShadow: '0px 1px 10px -5px #111',
                            border: '1px solid #FFFFFF',
                            borderRadius: '10px',
                            marginBottom: '20px',
                          }}
                          bodyStyle={{ padding: '10px' }}
                        >
                          <div className="row">
                            <div className="col-md-4 col-sm-4">
                              <img
                                alt="related_video"
                                src={video.pictures.sizes[1].link}
                                style={{ width: '100%', borderRadius: '10px' }}
                              />
                            </div>
                            <div className="col-md-8 col-sm-8">
                              <p style={{ fontSize: '20px', lineHeight: '1.2', fontWeight: '700' }}>
                                {video.name}
                              </p>
                              <p>{this.secondsToHms(video.duration)}</p>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  ))}
                {upcomingVideos && upcomingVideos.length === 0 && (
                  <p>There are no more videos in this category.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Authorize>
    )
  }
}

export default TutorialStep2
