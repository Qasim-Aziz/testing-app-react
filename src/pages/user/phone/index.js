/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Form, Input, Button, message, Select } from 'antd'
import { Helmet } from 'react-helmet'
import { Link, Redirect } from 'react-router-dom'
import {
  UserOutlined,
  ArrowRightOutlined,
  GoogleOutlined,
  SecurityScanOutlined,
  MailOutlined,
} from '@ant-design/icons'
import styles from './style.module.scss'

const { Option } = Select

@Form.create()
export default class extends Component {
  render() {
    const { form } = this.props
    const prefixSelector = form.getFieldDecorator('prefix', {
      initialValue: '+91',
    })(
      <Select name="prefix" style={{ width: 70 }}>
        <Option value="91">+91</Option>
        <Option value="92">+92</Option>
        <Option value="93">+93</Option>
        <Option value="1">+1</Option>
        <Option value="94">+94</Option>
        <Option value="95">+95</Option>
        <Option value="61">+61</Option>
        <Option value="71">+71</Option>
        <Option value="98">+98</Option>
        <Option value="88">+88</Option>
        <Option value="87">+87</Option>
        <Option value="80">+80</Option>
        <Option value="2">+2</Option>
        <Option value="55">+55</Option>
        <Option value="56">+56</Option>
        <Option value="57">+57</Option>
      </Select>,
    )
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
                    <br />
                    <Form
                      layout="vertical"
                      hideRequiredMark
                      onSubmit={this.onSubmit}
                      // initialValues={{ prefix: '91' }}
                    >
                      <Form.Item>
                        {form.getFieldDecorator('phone', {
                          rules: [{ required: true, message: 'Please input your mobile number' }],
                        })(
                          <Input
                            addonBefore={prefixSelector}
                            size="large"
                            placeholder="Mobile Number"
                          />,
                        )}
                      </Form.Item>
                      <Form.Item>
                        <Link to="otpVerification">
                          <Button type="primary" htmlType="submit" size="large" block>
                            CONTINUE
                            <ArrowRightOutlined className="site-form-item-icon" />
                          </Button>
                        </Link>

                        <p align="center" className="mt-2">
                          <SecurityScanOutlined
                            style={{ fontSize: '14px' }}
                            className="site-form-item-icon"
                          />{' '}
                          Your Information is safe with us
                        </p>
                      </Form.Item>
                      <div className="form-group">
                        <div className="mt-2">
                          <Link to="/user/login">
                            <Button size="large" className="width-50p">
                              <MailOutlined className="site-form-item-icon" />
                              Email
                            </Button>
                          </Link>
                          <Button size="large" className="width-50p">
                            <GoogleOutlined className="site-form-item-icon" />
                            Google
                          </Button>
                        </div>
                      </div>
                      <p align="center">
                        Need help?
                        {/* <text className="utils__link--blue"> Contact Us support@cogniable.us  </text> */}
                        <text> Contact Us at support@cogniable.us </text>
                      </p>
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
