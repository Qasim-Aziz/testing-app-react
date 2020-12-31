/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-useless-concat */
/* eslint-disable import/no-extraneous-dependencies */

import React from 'react'
import { Icon, Button, Switch } from 'antd'
import { connect } from 'react-redux'
import Timer from 'react-compound-timer'

@connect(({ sessionrecording, user }) => ({ sessionrecording, user }))
class SessionClock extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  startSession = time => {
    console.log(time)
    // const ts = new Date(time)
    // console.log(ts.toLocaleTimeString())

    const { dispatch } = this.props

    dispatch({
      type: 'sessionrecording/START_SESSION',
      payload: {
        duration: time.toFixed(),
      },
    })
    // enable target recording block
    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        Disabled: false,
      },
    })
  }

  pauseSession = time => {
    const { dispatch } = this.props

    dispatch({
      type: 'sessionrecording/PAUSE_SESSION',
      payload: {
        duration: time.toFixed(),
      },
    })
    // disable target recording block
    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        Disabled: true,
      },
    })
  }

  resumeSession = time => {
    const { dispatch } = this.props

    dispatch({
      type: 'sessionrecording/RESUME_SESSION',
      payload: {
        duration: time.toFixed(),
      },
    })
    // enable target recording block
    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        Disabled: false,
      },
    })
  }

  endSession = time => {
    const { dispatch } = this.props

    dispatch({
      type: 'sessionrecording/END_SESSION',
      payload: {
        duration: time.toFixed(),
      },
    })
    // disable target recording block
    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        Disabled: true,
      },
    })
  }

  updateTimeInReduxStore = time => {
    const { dispatch } = this.props
    // console.log(time ,'end: ', time.toFixed())
    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        CurrentSessionTime: time.toFixed(),
      },
    })
  }

  updateStartTrialInReduxStore = time => {
    const { dispatch } = this.props
    // console.log(time, 'start: ', time.toFixed())
    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        TrialStartTime: time.toFixed(),
      },
    })
  }

  editToggle = checked => {
    // console.log(checked)
    const { dispatch } = this.props
    dispatch({
      type: 'sessionrecording/SET_STATE',
      payload: {
        EditAfterSessionCompleted: checked,
      },
    })
  }

  render() {
    const {
      sessionrecording: { SessionStatus, ChildSession },
      user: {role}
    } = this.props

    return (
      <div style={{ padding: '10px' }}>
        <Timer
          id="sessionClockTimer"
          initialTime={ChildSession && ChildSession.duration ? ChildSession.duration : 0}
          startImmediately={false}
        >
          {({ start, resume, pause, stop, reset, getTime }) => (
            <React.Fragment>
              <h6 style={{ textAlign: 'center', fontSize: '30px' }}>
                <span style={{ textAlign: 'center' }}>
                  <Button
                    id="updateSessionCurrentTimeInStore"
                    onClick={() => this.updateTimeInReduxStore(getTime())}
                    style={{ display: 'hidden', border: 'none' }}
                  >
                    &nbsp;
                  </Button>
                  <Timer.Hours formatValue={value => `${value < 10 ? `0${value}` : value} : `} />
                  <Timer.Minutes formatValue={value => `${value < 10 ? `0${value}` : value} : `} />
                  <Timer.Seconds formatValue={value => `${value < 10 ? `0${value}` : value} `} />
                  <Button
                    id="updateStartTrialTimeInStore"
                    onClick={() => this.updateStartTrialInReduxStore(getTime())}
                    style={{ display: 'hidden', border: 'none' }}
                  >
                    &nbsp;
                  </Button>
                </span>
              </h6>
              <br />
              <div style={{ textAlign: 'center' }}>
                  
                {SessionStatus === 'Pending' ? (
                  <Button
                    onClick={() => {
                      start()
                      this.startSession(getTime())
                    }}
                  >
                    <Icon type="caret-right" />
                    Start Session
                  </Button>
                ) : (
                  ''
                )}
                {SessionStatus === 'InProgress' ? (
                  <>
                    <Button
                      onClick={() => {
                        this.pauseSession(getTime())
                        stop()
                      }}
                    >
                      Pause
                    </Button>
                    &nbsp;
                    <Button
                      onClick={() => {
                        this.endSession(getTime())
                        stop()
                      }}
                    >
                      End
                    </Button>
                  </>
                ) : (
                  ''
                )}
                {SessionStatus === 'Paused' ? (
                  <>
                    <Button
                      onClick={() => {
                        start()
                        this.resumeSession(getTime())
                      }}
                    >
                      <Icon type="caret-right" />
                      Resume Session
                    </Button>
                  </>
                ) : (
                  ''
                )}
                {SessionStatus === 'Completed' ? (
                  <>
                    <p>Session Completed!!</p>
                    <a href="/#/sessionsummary"><Button>Session Summary</Button></a>
                    <br />
                    {role !== 'parents' ? 
                      <span style={{marginTop: '5px'}}>
                        Edit Data: 
                        <Switch
                          checkedChildren={<Icon type="check" />}
                          unCheckedChildren={<Icon type="close" />}
                          onChange={checked => this.editToggle(checked)}
                        />
                      </span>
                    :
                      ''
                    }
                  </>
                ) : (
                  ''
                )}
                
              </div>
            </React.Fragment>
          )}
        </Timer>
      </div>
    )
  }
}

export default SessionClock
