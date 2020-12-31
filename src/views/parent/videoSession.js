/* eslint-disable react/jsx-indent */
/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { Helmet } from 'react-helmet'
import { Row, Col, Card, Button, Layout, Icon, Badge, Typography, Progress, Drawer } from 'antd'
import Authorize from 'components/LayoutComponents/Authorize'
import './videoSession.scss'
import Stimulus from 'components/parentsSession'
import Staps from 'components/parentsSession/steps'
import Target from 'components/parentsSession/target'
import SessionClock from 'components/parentsSession/sessionClock'

class VideoSession extends React.Component {
  constructor() {
    super()
    this.state = {
      Box: {},
      span: 24,
      borderBox: {
        paddingBottom: '20px',
        textAlign: 'center',
        marginLeft: '10px',
        marginRight: '10px',
      },
      Incorect: false,
      LeftRightArrow: false,
      dataType: {},
      IncorectBtn: {
        backgroundColor: 'white',
        color: 'black',
        height: '50px',
        width: '70%',
      },
      correctbtn: {
        backgroundColor: 'white',
        color: 'black',
        height: '50px',
        width: '70%',
      },
      arr: [
        {
          type: 'target',
        },
        {
          type: 'stimulus',
          data: [0, 1, 2, 3, 4, 5, 6, 7],
        },
        {
          type: 'steps',
          data: [0, 1, 2, 3, 4, 5, 6, 7],
        },
      ],
      visible: false,
      targetVisible: false,
    }
  }

  handleArow = () => {
    const { span } = this.state
    if (span === 24) {
      this.setState({
        Box: {
          paddingBottom: '20px',
        },
        span: 12,
      })
    } else {
      this.setState({
        Box: {
          paddingBottom: '20px',
        },
        span: 24,
      })
    }
  }

  handleIncorectbtn = () => {
    this.setState({
      Incorect: true,
    })
  }

  handlePrompt = () => {
    this.setState({
      Incorect: false,
      IncorectBtn: {
        backgroundColor: '#FF8080',
        color: 'white',
        height: '50px',
        width: '70%',
      },
    })
  }

  handleRight = () => {
    this.setState({
      dataType: { type: 'staps' },
      IncorectBtn: {
        backgroundColor: 'white',
        color: 'black',
        height: '50px',
        width: '70%',
      },
      correctbtn: {
        backgroundColor: 'white',
        color: 'black',
        height: '50px',
        width: '70%',
      },
      borderBox: {
        border: '1px solid #f2f2f2',
        backgroundColor: '#f2f4f8',
        paddingBottom: '20px',
        textAlign: 'center',
        marginLeft: '25px',
        marginRight: '25px',
      },
    })
  }

  handleLeft = () => {
    this.setState({
      dataType: { type: 'stimulus' },
      IncorectBtn: {
        backgroundColor: 'white',
        color: 'black',
        height: '50px',
        width: '70%',
      },
      correctbtn: {
        backgroundColor: 'white',
        color: 'black',
        height: '50px',
        width: '70%',
      },
      borderBox: {
        border: '1px solid #f2f2f2',
        backgroundColor: '#f2f4f8',
        paddingBottom: '20px',
        textAlign: 'center',
        marginLeft: '25px',
        marginRight: '25px',
      },
    })
  }

  handlCorrect = () => {
    this.setState({
      correctbtn: {
        backgroundColor: '#4BAEA0',
        color: 'white',
        height: '50px',
        width: '70%',
      },
    })
  }

  handleLeftBtnArrow = () => {
    this.setState({ dataType: { type: 'staps' } })
  }

  handleRightBtnArrow = () => {
    this.setState({ dataType: { type: 'stimulus' } })
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    })
  }

  onClose = () => {
    this.setState({
      visible: false,
    })
  }

  showTargetDrawer = () => {
    this.setState({
      targetVisible: true,
    })
  }

  onTargetClose = () => {
    this.setState({
      targetVisible: false,
    })
  }

  render() {
    const { Header, Content, Sider } = Layout
    const { Title, Text } = Typography
    const { Meta } = Card
    const {
      Box,
      span,
      Incorect,
      IncorectBtn,
      correctbtn,
      LeftRightArrow,
      arr,
      dataType,
      borderBox,
    } = this.state
    const stimulus = (
      <div style={{ textAlign: 'center' }}>
        <Text style={{ padding: '10px' }}>Stimulus 1 of 3 </Text>
      </div>
    )
    const staps = (
      <div style={{ textAlign: 'center' }}>
        <Text style={{ padding: '10px' }}>Step 1to 3</Text>
      </div>
    )
    const prompt = arr[1].data.map(data => {
      if (data) {
        return (
          <div style={{ textAlign: 'center', paddingTop: '5px' }}>
            <Button
              onClick={() => this.handlePrompt()}
              style={{
                backgroundColor: '#f2f4f8',
                height: '40px',
                width: '60%',
              }}
            >
              Prompt {data.data}
            </Button>
          </div>
        )
      }
      return null
    })
    let progress = ['#FF9C52', '#4BAEA0', '#FF8080', '0', '0', '0', '0', '0']
    progress = progress.map(data => {
      if (data) {
        return (
          <span
            style={{
              height: '15px',
              display: 'inline-block',
              lineHeight: '12px',
              width: '37px',
              border: '1px solid #F5F5F5',
              backgroundColor: data,
              paddingLeft: '35px',
              borderRadius: '2px',
              marginRight: '5px',
            }}
          >
            &nbsp;
          </span>
        )
      }
      return null
    }, {})
    return (
      <Authorize roles={['school_admin', 'parents']} to="/dashboard/beta">
        <Helmet title="Partner" />
        <Layout>
          <Content>
            <Row style={{ maxHeight: '600px', overflow: 'auto' }}>
              <Col sm={17} style={{ position: 'relative', overflow: 'hidden' }}>
                {/* <Title type="secondary" style={{ paddingTop: '20px' }} level={4}>
                  MORNING SESSION{' '}
                </Title> */}
                <Card
                  style={{ padding: '10px', maxHeight: '600px', overflow: 'auto' }}
                  bodyStyle={{ padding: '0px' }}
                >
                  <Col span={span} style={Box}>
                    <Card
                      bodyStyle={{ padding: '0px' }}
                      style={{ padding: '10px', minHeight: '550px' }}
                    >
                      <Col sm={24} lg={12}>
                        <img
                          alt="example"
                          src="https://www.familyeducation.com/sites/default/files/2019-03/traits-babies-inherit-from-their-father_feature.jpg"
                          style={{ maxHeight: '250px', width: '100%' }}
                        />
                        <br />
                        <h5 style={{ marginTop: '10px' }}>
                          Kunal names the Presented Complex action by watching{' '}
                        </h5>
                        <Button onClick={this.showTargetDrawer}>Target Instruction</Button>
                        <h6 style={{ marginTop: '10px' }}>visual perfaction </h6>
                        {/* <Meta
                          style={{ textAlign: 'left' }}
                          title="Kunal names the Presented Complex action by watching "
                          description="visual perfaction "
                        /> */}
                        {!dataType.type ? progress : null}
                        {dataType.type === 'staps' ? <Staps data={dataType.data} /> : null}
                        {dataType.type === 'stimulus' ? <Stimulus data={dataType.data} /> : null}
                      </Col>

                      <Col sm={24} lg={12}>
                        <Card
                          style={{ border: 'none', padding: '10px' }}
                          bodyStyle={{ paddingTop: '0px' }}
                        >
                          <Button style={{ float: 'right' }} onClick={this.showDrawer}>
                            BR
                          </Button>
                          <br />
                          <br />
                          {dataType.type === 'staps' ? staps : null}
                          {dataType.type === 'stimulus' ? stimulus : null}

                          {dataType.type ? (
                            <Button
                              style={{
                                float: 'left',
                                transition: '.60s ease',
                                marginTop: '120px',
                              }}
                              onClick={() => this.handleLeftBtnArrow()}
                            >
                              <Icon type="left" />
                            </Button>
                          ) : null}
                          {dataType.type ? (
                            <Button
                              style={{
                                float: 'right',
                                transition: '.60s ease',
                                marginTop: '120px',
                              }}
                              onClick={() => this.handleRightBtnArrow()}
                            >
                              <Icon type="right" />
                            </Button>
                          ) : null}
                          <div style={borderBox}>
                            <br />

                            {dataType.type === 'staps' ? (
                              <>
                                <Text>Step Description</Text>
                                <br />
                              </>
                            ) : null}
                            {dataType.type === 'stimulus' ? (
                              <>
                                <Text>Stimulus Description</Text>
                                <br />
                              </>
                            ) : null}
                            <Text style={{ padding: '8px' }}>
                              <Icon type="left" />
                              &nbsp; Trial 1 of 6 &nbsp;
                              <Icon type="right" />
                            </Text>
                            <br />
                            <br />
                            {Incorect === true ? (
                              prompt
                            ) : (
                              <div>
                                <Button
                                  style={correctbtn}
                                  onClick={() => {
                                    this.handlCorrect()
                                  }}
                                >
                                  Correct&nbsp;&nbsp;
                                  <Badge
                                    count={10}
                                    style={{
                                      backgroundColor: '#f5f6fb',
                                      color: 'black',
                                      borderRadius: '5px',
                                    }}
                                  />{' '}
                                  <br />
                                </Button>
                                <br />

                                <br />
                                <Button
                                  style={IncorectBtn}
                                  onClick={() => {
                                    this.handleIncorectbtn()
                                  }}
                                >
                                  Incorrect &nbsp;&nbsp;
                                  <Badge
                                    count={10}
                                    style={{
                                      backgroundColor: '#f5f6fb',
                                      color: 'black',
                                      borderRadius: '5px',
                                    }}
                                  />{' '}
                                  <br />
                                </Button>
                              </div>
                            )}
                          </div>

                          <br />
                          <br />
                          <div style={{ textAlign: 'right', marginTop: '140px' }}>
                            <Button onClick={() => this.handleLeft()}>
                              <Icon type="left" />
                            </Button>
                            &nbsp;&nbsp;&nbsp;
                            <Button onClick={() => this.handleRight()}>
                              <Icon type="right" />
                            </Button>
                          </div>
                          <br />
                        </Card>
                      </Col>
                    </Card>
                  </Col>

                  {/* {span === 11 ? (
                    <Col span={span} style={Box}>
                      <div>empty</div>
                    </Col>
                  ) : null} */}
                  {/* <Col span={1}>
                    <br />
                    <Title
                      style={{
                        float: 'left',
                        width: '100%',
                        height: '40px',
                        marginTop: '34px',
                        backgroundColor: '#f2f4f8',
                        color: '#1d90fa',
                      }}
                      onClick={() => {
                        this.handleArow()
                      }}
                    >
                      {' '}
                      <Icon type="thunderbolt" />
                    </Title>
                  </Col> */}
                </Card>
                <Drawer
                  title="Basic Drawer"
                  height="60%"
                  placement="bottom"
                  closable={false}
                  onClose={this.onClose}
                  visible={this.state.visible}
                  getContainer={false}
                  style={{ position: 'absolute' }}
                >
                  <p>Some contents...</p>
                </Drawer>
                <Drawer
                  title="Basic Drawer"
                  width="40%"
                  placement="left"
                  closable={false}
                  onClose={this.onTargetClose}
                  visible={this.state.targetVisible}
                  getContainer={false}
                  style={{ position: 'absolute' }}
                >
                  <p>Some contents...</p>
                </Drawer>
              </Col>

              <Col span={7} style={{ maxHeight: '600px', overflow: 'auto', paddingLeft: '10px' }}>
                <SessionClock />
                <Title type="secondary" level={4} style={{ textAlign: 'left' }}>
                  Upcoming target <Icon type="align-right" style={{ float: 'right' }} />
                </Title>
                <div className="targeVideo">
                  <Target />
                </div>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Authorize>
    )
  }
}

export default VideoSession
