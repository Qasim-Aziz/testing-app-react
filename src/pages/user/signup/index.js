/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-unused-state */
import React from 'react'
import { Helmet } from 'react-helmet'
import { Carousel, Button } from 'antd'
import { Link, Redirect } from 'react-router-dom'
import {
  UserOutlined,
  KeyOutlined,
  ArrowLeftOutlined,
  PhoneOutlined,
  GoogleOutlined,
  SecurityScanOutlined,
} from '@ant-design/icons'
import styles from './style.module.scss'
import ClinicSignUp from './RegisterForm'
import ParentSignUp from './RegisterForm/parentSignUp'

const blue = '#260fb6'
const orange = '#f17c00'

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'signup',
    }
  }

  render() {
    const { selectedTab } = this.state
    return (
      <>
        <div>
          <Helmet title="Sign Up" />
          <div className={styles.block}>

            <div className="row">
              <div className="col-xl-12" style={{ border: '1px solid white' }}>
                <div align="center">
                  <img
                    src="resources/images/HeaderLogo.png"
                    alt="HeaderLogo"
                    style={{
                      height: '70px',
                      borderRadius: '2px',
                      marginBottom: '60px',
                      marginTop: '20px'
                    }}
                  />
                </div>
                {selectedTab === 'signup' && (
                  <>
                    <h4 className="text-uppercase" align="center">
                      <strong>SIGN UP</strong>
                    </h4>
                    <br />
                    <div className="row">
                      <div className="col-xl-6" onClick={() => this.setState({ selectedTab: 'signupParent' })} style={{ border: '1px solid white' }}>
                        <div className={styles.options1}>Parent</div>
                      </div>
                      <div className="col-xl-6" onClick={() => this.setState({ selectedTab: 'signupClinic' })} style={{ border: '1px solid white' }}>
                        <div className={styles.options2}>Clinic</div>
                      </div>
                    </div>
                    <p align="center">
                      <Link
                        to="/user/login"
                        className="utils__link--blue"
                        style={{
                          width: '300px',
                          borderRadius: '5px',
                          display: 'inline-block',
                          padding: 6,
                          backgroundColor: blue,
                          color: '#fff',
                          marginTop: '20px'
                        }}
                      >
                        <ArrowLeftOutlined className="site-form-item-icon" />
                        {' '}
                        LOGIN
                      </Link>
                    </p>
                  </>
                )}
                {selectedTab !== 'signup' && (
                  <>
                    <div className={styles.form}>
                      <div className="row">
                        <div className="col-xl-6" style={{ border: '1px solid white', margin: '0 auto' }}>
                          {selectedTab === 'signupClinic' && (
                            <>
                              <h4 className="text-uppercase" align="center">
                                <strong>CLINIC SIGN UP</strong>
                              </h4>
                              <ClinicSignUp />
                            </>
                          )}
                          {selectedTab === 'signupParent' && (
                            <>
                              <h4 className="text-uppercase" align="center">
                                <strong>PARENT SIGN UP</strong>
                              </h4>
                              <ParentSignUp />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <p align="center">
                      <Button
                        onClick={() => this.setState({ selectedTab: 'signup' })}
                        style={{
                          width: '300px',
                          borderRadius: '5px',
                          display: 'inline-block',
                          padding: 6,
                          backgroundColor: blue,
                          color: '#fff',
                          marginTop: '20px'
                        }}
                      >
                        <ArrowLeftOutlined className="site-form-item-icon" />
                        {' '}
                        Back
                      </Button>
                    </p>
                  </>
                )}



              </div>
            </div>


          </div>
        </div>
      </>
    )
  }
}

export default Register
