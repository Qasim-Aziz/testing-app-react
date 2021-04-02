import React from 'react'
import ReactPlayer from 'react-player'
import { Card, Typography } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import { Link } from 'react-router-dom'
import { gql } from 'apollo-boost'
import client from '../../apollo/config'
import './style.scss'
import { COLORS } from '../../assets/styles/globalStyles'

const { Title, Text } = Typography

class TutorialStep1 extends React.Component {
  constructor(props) {
    super(props)
    console.log(JSON.stringify(props))
    this.state = {
      isLoading: true,
      loadingMoreVideos: true,
      projects: [],
      projectVideos: [],
      selectedProjectId: '',
      selectedProjectName: '',
      continueURL: '',
      playingUrl: '',
    }
  }

  componentDidMount() {
    let spid = ''
    client
      .query({
        query: gql`
          query {
            VimeoProject {
              edges {
                node {
                  id
                  name
                  url
                  projectId
                  description
                }
              }
            }
          }
        `,
      })
      .then(result => {
        spid = result.data.VimeoProject.edges[0].node.projectId
        this.setState({
          isLoading: false,
          projects: result.data.VimeoProject.edges,
          selectedProjectId: result.data.VimeoProject.edges[0].node.projectId,
          selectedProjectName: result.data.VimeoProject.edges[0].node.name,
        })
        this.getSelectedProjectContinueURL(spid)
        this.getSelectedProjectVideos(spid)
      })
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

  getSelectedProjectContinueURL = projectId => {
    client
      .query({
        query: gql`query {getVideoStatus(project:"${projectId}", first:1)
      {
        edges {
            node {
                id
                video
                status
                user{
                  id
                  username
                }
                project{
                  id
                  name
                }
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
  }

  getSelectedProjectVideos = projectId => {
    fetch(`https://api.vimeo.com/users/100800066/projects/${projectId}/videos`, {
      method: 'GET',
      page: 1,
      headers: new Headers({
        'Content-Type': 'application/vnd.vimeo.*+json',
        Authorization: 'Bearer 57fe5b03eac21264d45df680fb335a42',
      }),
    })
      .then(res => res.json())
      .then(res => {
        console.log(res)
        this.setState({
          projectVideos: res.data,
          loadingMoreVideos: false,
          playingUrl: res.data && res.data.length > 0 && res.data[0].link,
        })
      })
      .catch(err => console.log(err))
  }

  handleKeyDown = () => {}

  getVideoIdFromUrl = url => {
    const res = url.substring(8)
    return res
  }

  render() {
    const {
      isLoading,
      projects,
      selectedProjectId,
      selectedProjectName,
      projectVideos,
      continueURL,
      loadingMoreVideos,
      playingUrl,
    } = this.state
    if (isLoading) {
      return <div>Loding...</div>
    }
    return (
      <Authorize roles={['parents', 'therapist', 'school_admin']} redirect to="/dashboard/beta">
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '3px 10px',
            backgroundColor: COLORS.white,
            boxShadow: '0 1px 6px rgba(0,0,0,.12), 0 1px 4px rgba(0,0,0,.12)',
          }}
        >
          <h2>CogniAble Tutorials</h2>
        </div>
        <div style={{ paddingHorizontal: 10 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              paddingTop: '2px',
            }}
          >
            <div
              style={{
                flex: 8,
                height: 350,
                maxHeight: 349,
                backgroundColor: COLORS.palleteLight,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ReactPlayer url={playingUrl || ''} controls width="100%" height="300px" />
            </div>
            <div
              style={{
                flex: 2.5,
                height: 350,
                maxHeight: 349,
                overflowY: 'scroll',
                backgroundColor: COLORS.palleteLight,
              }}
              className="scrollClass"
            >
              <div className="col-sm-12 col-md-12">
                <div>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                    More Videos in {selectedProjectName}
                  </span>
                </div>
                <div>
                  {loadingMoreVideos === true && <p>Loading videos. Please wait...</p>}
                  {loadingMoreVideos === false && projectVideos && projectVideos.length === 0 && (
                    <p>There are no more videos in this category.</p>
                  )}
                  {loadingMoreVideos === false &&
                    projectVideos &&
                    projectVideos.length > 0 &&
                    projectVideos.map(video => (
                      <div>
                        {/* <Link
                          to={{
                            pathname: '/tutorials/step2',
                            videoUrl: video.link,
                            videoId: this.getVideoIdFromUrl(video.uri),
                            videoTitle: video.name,
                            videoDuration: this.secondsToHms(video.duration),
                            projectId: selectedProjectId,
                            description: video.description,
                          }}
                        > */}
                        <Card
                          onClick={() => {
                            this.setState({ playingUrl: video.link })
                          }}
                          hoverable
                          style={{
                            margin: '5px 5px 5px 0',
                            borderRadius: '10px',
                            backgroundColor: COLORS.palleteLightBlue,
                          }}
                          cover={
                            <img
                              alt="video"
                              src={video.pictures.sizes[1].link}
                              style={{ height: '150px' }}
                            />
                          }
                        >
                          <Title
                            level={4}
                            style={{
                              marginBottom: '0',
                              color: '#777777',
                              fontWeight: '700',
                              fontSize: 13,
                              marginRight: '5px',
                            }}
                          >
                            {video.name}
                          </Title>
                          <Text type="secondary" style={{ fontSize: '10px' }}>
                            {this.secondsToHms(video.duration)}
                          </Text>
                        </Card>
                        {/* </Link> */}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className="scrollClass"
            style={{
              marginTop: 10,
              padding: 10,
              display: 'flex',
              flexDirection: 'row',
              maxWidth: '100%',
              overflowX: 'scroll',
            }}
          >
            {projects.map(project => {
              return selectedProjectId === project.node.projectId ? (
                <div
                  style={{
                    marginRight: 10,
                    minWidth: 300,
                    maxWidth: 300,
                    backgroundColor: COLORS.palleteBlue,
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <p
                    className="mb-0"
                    style={{ fontSize: '18px', fontWeight: 'bold', color: '#FFF' }}
                  >
                    {project.node.name}
                  </p>
                  <p
                    className=""
                    style={{ fontSize: '12px', lineHeight: '1.2', color: COLORS.white }}
                  >
                    {project.node.description}
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
                    marginRight: '10px',
                    borderRadius: '10px',
                  }}
                  key={project.node.id}
                  role="button"
                  tabIndex="0"
                  onClick={() => {
                    this.setState({
                      selectedProjectId: project.node.projectId,
                      selectedProjectName: project.node.name,
                      loadingMoreVideos: true,
                    })
                    this.getSelectedProjectVideos(project.node.projectId)
                  }}
                  onKeyDown={this.handleKeyDown}
                >
                  <div
                    style={{
                      minWidth: 300,
                      maxWidth: 300,
                      backgroundColor: COLORS.white,
                      padding: 10,
                      borderRadius: 10,
                    }}
                  >
                    <p className="mb-0" style={{ fontSize: '18px', fontWeight: '400' }}>
                      {project.node.name}
                    </p>
                    <p className="" style={{ fontSize: '13px', lineHeight: '1.2' }}>
                      {project.node.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Authorize>
    )
  }
}

export default TutorialStep1
