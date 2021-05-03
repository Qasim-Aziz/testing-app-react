/* eslint-disable react/no-unused-state */
import {
  CaretDownOutlined,
  CaretRightOutlined,
  LeftOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Button, Col, Dropdown, Menu, message, Row, Tabs } from 'antd'
import Search from 'antd/lib/input/Search'
import { gql } from 'apollo-boost'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import apolloClient from '../../apollo/config'
import AllFilesData from './AllFilesData'

// ../../apollo/config

const { TabPane } = Tabs

function callback(key) {
  console.log(key)
}

@connect(({ user, sessionrecording }) => ({ user, sessionrecording }))
class AllFiles extends Component {
  state = {
    studentData: null,
  }

  componentDidMount() {
    const std = JSON.parse(localStorage.getItem('studentId'))
    apolloClient
      .query({
        query: gql`{
      student(id: "${std}"){
        id
        firstname
        email
        dob
        mobileno
        lastname
        gender
        currentAddress
        isActive
        image
        report
        files{
            edges{
                node{
                    id
                    file
                    fileName
                    fileDescription
                }
            }
        }
      }
    }`,
      })
      .then(result => {
        this.setState({
          studentData: result.data.student,
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    function handleMenuClick(e) {
      message.info('Click on menu item.')
      console.log('click', e)
    }
    const menu = (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key="1">1st menu item</Menu.Item>
        <Menu.Item key="2">2nd menu item</Menu.Item>
        <Menu.Item key="3">3rd menu item</Menu.Item>
      </Menu>
    )
    const studentData = this.state
    return (
      <>
        <div className="all_file_container">
          <Row>
            <Col span={6}>
              <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="LABELS" key="1">
                  <div className="tab_main_content">
                    <div className="tab_content">
                      <p>
                        <CaretRightOutlined /> Private Labels
                      </p>
                      <p>
                        <SettingOutlined />
                      </p>
                    </div>
                    <div className="tab_content">
                      <p>
                        <CaretRightOutlined /> Organization Labels
                      </p>
                      <p>
                        <SettingOutlined />
                      </p>
                    </div>
                  </div>
                </TabPane>
                <TabPane tab="FILTERS" key="2">
                  <div className="tab_main_content">
                    <div className="tab_content">
                      <p>
                        <CaretRightOutlined /> Private Labels
                      </p>
                      <p>
                        <SettingOutlined />
                      </p>
                    </div>
                    <div className="tab_content">
                      <p>
                        <CaretRightOutlined /> Organization Labels
                      </p>
                      <p>
                        <SettingOutlined />
                      </p>
                    </div>
                  </div>
                </TabPane>
                <TabPane tab="TEMPLATES" key="3">
                  <div className="tab_main_content">
                    <div className="tab_content">
                      <p>
                        <CaretRightOutlined /> Private Labels
                      </p>
                      <p>
                        <SettingOutlined />
                      </p>
                    </div>
                    <div className="tab_content">
                      <p>
                        <CaretRightOutlined /> Organization Labels
                      </p>
                      <p>
                        <SettingOutlined />
                      </p>
                    </div>
                  </div>
                </TabPane>
                <TabPane tab={<LeftOutlined />} key="4">
                  <div className="tab_main_content">
                    <div className="tab_content">
                      <p>
                        <CaretRightOutlined /> Private Labels
                      </p>
                      <p>
                        <SettingOutlined />
                      </p>
                    </div>
                    <div className="tab_content">
                      <p>
                        <CaretRightOutlined /> Organization Labels
                      </p>
                      <p>
                        <SettingOutlined />
                      </p>
                    </div>
                  </div>
                </TabPane>
              </Tabs>
            </Col>
            <Col span={18}>
              <div className="all_file_search_container">
                <div className="all_file_search">
                  <Search
                    size="large"
                    placeholder="input search text"
                    style={{ width: '55%', borderRight: '2px solid #F6F6F6' }}
                  />
                  <Dropdown overlay={menu}>
                    <Button size="large" type="primary">
                      <PlusOutlined /> Button <CaretDownOutlined />
                    </Button>
                  </Dropdown>
                </div>
              </div>
              <AllFilesData studentData={studentData} />
            </Col>
          </Row>
        </div>
      </>
    )
  }
}

export default AllFiles
