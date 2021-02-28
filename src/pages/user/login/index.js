/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Form, Input, Select, Button, Carousel } from 'antd'
import { Helmet } from 'react-helmet'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  UserOutlined,
  KeyOutlined,
  ArrowRightOutlined,
  PhoneOutlined,
  GoogleOutlined,
  SecurityScanOutlined,
} from '@ant-design/icons'
import client from '../../../config'
import './carouselCustomStyle.scss'
import styles from './style.module.scss'

const { Option } = Select
// const API_URL = process.env.REACT_APP_API_URL;

const blue = '#006DEE'
const orange = '#EE7200'

@Form.create()
@connect(({ user }) => ({ user }))
class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      // UserContryName: '',
      // timezone: null,
      signupredirect: false,
      loginredirect: false,
    }
  }

  componentDidMount() {
    fetch('https://extreme-ip-lookup.com/json/')
      .then(res => res.json())
      .then(response => {
        console.log('Country: ', response)
      })
      .catch((data, status) => {
        console.log('Request failed')
      })
  }

  SignupRedirct = e => {
    e.preventDefault()
    this.setState({
      signupredirect: true,
    })
  }

  onSubmit = event => {
    event.preventDefault()
    // const { timezone } = this.state
    const { form, dispatch } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        this.setState({
          loading: true,
        })
        // values.timezone = timezone
        dispatch({
          type: 'user/LOGIN',
          payload: values,
        })
        this.setState({
          loading: false,
        })
      }
    })
  }

  render() {
    const { form } = this.props

    const { loginredirect, signupredirect, loading } = this.state

    if (loginredirect) {
      return <Redirect to="/master_target" />
    }

    if (signupredirect) {
      return <Redirect to="/user/signup" />
    }

    const customH3 = { padding: '10px', fontSize: 18 }

    return (
      <>
        <div>
          <Helmet title="Login" />
          <div className={styles.block}>
            <div className={styles.flexCenter}>
              <div
                className="col-xl-7"
                style={{
                  border: '1px solid white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '60%',
                }}
              >
                <div className={styles.inner}>
                  <div className={styles.form}>
                    <div align="center" className={styles.customLayout}>
                      <img
                        src="resources/images/HeaderLogo.png"
                        alt="HeaderLogo"
                        style={{
                          borderRadius: '2px',
                          marginBottom: '28px',
                          marginTop: '50px',
                          maxWidth: '310px',
                        }}
                      />
                    </div>
                    <br />
                    <Form layout="horizontal" hideRequiredMark onSubmit={this.onSubmit}>
                      <div className={styles.inputFieldsContainer}>
                        <Form.Item>
                          {form.getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input your Email' }],
                          })(
                            <Input
                              size="large"
                              placeholder="Email"
                              prefix={<UserOutlined className="site-form-item-icon" />}
                              className={styles.inputStyles}
                            />,
                          )}
                        </Form.Item>
                        <Form.Item>
                          {form.getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your password' }],
                          })(
                            <Input.Password
                              size="large"
                              type="password"
                              prefix={<KeyOutlined className="site-form-item-icon" />}
                              className={styles.inputStyles}
                              placeholder="Password"
                            />,
                          )}
                        </Form.Item>
                      </div>

                      <div className={styles.flexCenter}>
                        <Form.Item>
                          <Button
                            htmlType="submit"
                            size="large"
                            loading={loading}
                            style={{
                              backgroundColor: orange,
                              borderColor: orange,
                              margin: '15px auto auto auto',
                              maxWidth: '208px',
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '14px',
                            }}
                            onFocus={console.log('focus')}
                            block
                          >
                            SIGN IN
                            <ArrowRightOutlined className="site-form-item-icon" />
                          </Button>
                          <p align="center" className="mt-2" style={{ color: 'goldenrod' }}>
                            <SecurityScanOutlined
                              style={{ fontSize: '14px', color: 'goldenrod' }}
                              className="site-form-item-icon"
                            />{' '}
                            Your Information is safe with us
                          </p>
                        </Form.Item>
                      </div>
                      <p align="center">
                        <Link
                          to="/user/forgot"
                          style={{ color: blue }}
                          className="utils__link--blue"
                        >
                          {' '}
                          Forgot Password ?
                        </Link>
                      </p>

                      <p align="center">
                        <Link
                          to="/user/signUp"
                          className="utils__link--blue"
                          style={{
                            width: '100%',
                            borderRadius: '5px',
                            display: 'inline-block',
                            padding: 6,
                            backgroundColor: blue,
                            color: '#fff',
                            maxWidth: '208px',
                            fontSize: '14px',
                          }}
                        >
                          {' '}
                          SIGN UP
                        </Link>
                      </p>
                      {/* <div className="form-group">
                        <div>
                          <Link to="/user/phone">
                            <Button size="large" className="width-50p">
                              <PhoneOutlined rotate="100" className="site-form-item-icon" />
                              Phone
                            </Button>
                          </Link>
                          <Button size="large" className="width-50p">
                            <GoogleOutlined className="site-form-item-icon" />
                            Google
                          </Button>
                        </div>
                      </div> */}
                    </Form>
                  </div>
                  <div style={{ zIndex: 2 }}>
                    <p align="center" style={{ marginBottom: '0.5rem' }}>
                      <a href="https://drive.google.com/drive/folders/1_0z9kzGquaXi-odJKw2DKOIAWACeoGnk">
                        Clinic Manual
                      </a>
                    </p>

                    <div align="center">
                      Need help?
                      {/* <text className="utils__link--blue"> Contact Us support@cogniable.us  </text> */}
                      <p>
                        Contact Us at <a href="mailto:info@cogniable.tech">info@cogniable.tech</a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="col-xl-8" style={{ border: '1px solid white' }}>
                <div style={{ padding: '10px' }}>
                  <Carousel autoplay>
                    <div>
                      <div
                        className={styles.img1}
                      >
                        &nbsp;
                      </div>
                    </div>
                    <div>
                      <h3 style={{color: '#260fb6'}}>Awards</h3>
                      <h3 style={customH3}>
                        <a href="https://analyticsindiamag.com/startups-that-won-indias-ai-solution-challenge-at-raise-2020/" target="blank">1. Announced number 1 company in the Education sector using Artificial Intelligence technologies by honourable Prime Minister Modi.</a>
                      </h3>
                      <h3 style={customH3}>
                        <a href=" https://us.nttdata.com/en/blog/2021/january/partnering-with-startups" target="blank">2. The Regional  Round winners of NTT DATA OPEN INNOVATION CONTEST 2020 for International POC in Canada, with financing of $10000 </a>
                      </h3>
                      <h3 style={customH3}>
                        <a href="https://yourstory.com/2020/10/techsparks-yourstory-tech30-2020" target="blank">3. One of the 3 selected from India for the Extreme Tech Challenge (XTC) at YourStory’s TECHSPARKS 2020 TECH 30</a>
                      </h3>
                      <h3 style={customH3}>
                        <a href="https://www.aimcongress.com/roadshow/Countries/Details?countryName=India" target="blank">4. Selected as the top innovating company by the Ministry of commerce to represent India in AIM Congress awards</a>
                      </h3>
                      <h3 style={customH3}>
                        <a href="https://www.researchstash.com/2019/07/18/india-innovation-growth-programme-grants-winners-2019/" target="blank">5. Selected in top 16 companies of India by FICCI , TAta-Trusts and Lockheed Martin and awarded prestigious IIGP award and grant.</a>
                      </h3>
                      <h3 style={customH3}>
                        <a href="" target="blank">6. Selected as top company by Western Digital in Data Innovation bazar competition organized by Startup India </a>
                      </h3>
                      <h3 style={customH3}>
                        <a href="https://www.ncpedp.org/The_NCPEDP-Mphasis_Universal_Design_Awards" target="blank">7. Awarded prestigious The NCPEDP - Mphasis Universal Design Awards</a>
                      </h3>
                    </div>
                  </Carousel>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Login
