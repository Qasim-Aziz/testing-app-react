import React, { Component } from 'react'
import { Form, Input, Button, Col, Row } from 'antd'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { ArrowRightOutlined } from '@ant-design/icons'
import styles from './style.module.scss'

@Form.create()
export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      one: '',
      two: '',
      three: '',
      four: '',
      counter: 60,
    }
  }

  SendOtp = () => {
    console.log('OtpSent')
  }

  handleChange = e => {
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(e.target.value)) {
      this.setState({ [e.target.name]: e.target.value })
    }
  }

  render() {
    const { state, handleChange, SendOtp } = this
    const x = this
    const { counter } = state
    setTimeout(function() {
      if (counter > 0) {
        x.setState({ counter: counter - 1 })
      }
    }, 1000)
    console.log(state.counter)
    return (
      <>
        <div>
          <Helmet title="Login" />
          <div className={styles.block}>
            <div className="row">
              <div className="col-xl-12">
                <div className={styles.inner}>
                  <div className={styles.form}>
                    <h4 className="text-uppercase" align="center">
                      <strong>Sign In</strong>
                    </h4>
                    <p align="center">
                      Don&apos;t have an account?
                      <Link to="/user/signUp" className="utils__link--blue">
                        {' '}
                        Sign Up
                      </Link>
                    </p>
                    <div align="center" className={styles.customLayout}>
                      <img
                        src="resources/images/login.jpg"
                        alt="HeaderLogo"
                        style={{
                          height: '200px',
                          borderRadius: '20px',
                        }}
                      />
                    </div>
                    <h4 className="mt-2" align="center">
                      Verification
                    </h4>
                    <p align="center">Enter OTP to verify your phone number</p>
                    <br />
                    <Form layout="vrtical" hideRequiredMark onSubmit={this.onSubmit}>
                      <Row gutter={[40, 8]}>
                        <Col span={6}>
                          <Input
                            name="one"
                            size="large"
                            maxLength="1"
                            value={state.one}
                            onChange={handleChange}
                            style={{ textAlign: 'center' }}
                          />
                        </Col>
                        <Col span={6}>
                          <Input
                            name="two"
                            size="large"
                            maxLength="1"
                            value={state.two}
                            onChange={handleChange}
                            style={{ textAlign: 'center' }}
                          />
                        </Col>
                        <Col span={6}>
                          <Input
                            name="three"
                            size="large"
                            maxLength="1"
                            value={state.three}
                            onChange={handleChange}
                            style={{ textAlign: 'center' }}
                          />
                        </Col>
                        <Col span={6}>
                          <Input
                            name="four"
                            size="large"
                            maxLength="1"
                            value={state.four}
                            onChange={handleChange}
                            style={{ textAlign: 'center' }}
                          />
                        </Col>
                      </Row>

                      <Row gutter={[16, 16]} className="mb-2">
                        <Col span={12}>00:{`${counter === 0 ? '00' : counter}`}</Col>
                        <Col span={12}>
                          <div
                            style={{
                              cursor: 'pointer',
                              outline: 'none',
                              pointerEvents: `${counter === 0 ? 'auto' : 'none'}`,
                              color: `${counter === 0 ? '#0190fe' : '#e6e6e6'}`,
                            }}
                            role="button"
                            align="right"
                            tabIndex={0}
                            onClick={() => SendOtp()}
                            onKeyPress={SendOtp}
                          >
                            SendAgain
                          </div>
                        </Col>
                      </Row>

                      <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block>
                          CONTINUE
                          <ArrowRightOutlined className="site-form-item-icon" />
                        </Button>
                        <p align="center" className="mt-2">
                          {' '}
                          <span style={{ cursor: 'pointer', color: '0190fe' }}>
                            Resend OTP by Call
                          </span>
                        </p>
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}
