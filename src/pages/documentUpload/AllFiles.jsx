/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-equals-spacing */
/* eslint-disable react/jsx-tag-spacing */
/* eslint-disable react/jsx-indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import {
  CaretDownOutlined,
  CaretRightOutlined,
  LeftOutlined,
  PlusOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Button, Col, Dropdown, Menu, message, Row, Tabs } from 'antd'
import Search from 'antd/lib/input/Search'
import React from 'react'
import AllFilesData from './AllFilesData'

const { TabPane } = Tabs

function callback(key) {
  console.log(key)
}

const AllFiles = () => {
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
            <AllFilesData />
          </Col>
        </Row>

        {/* <Row>
        <Col style={{borderRight: "2px solid #F6F6F6"}} span={8}>
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
        <Col span={16}>
          <div className="all_file_search_container">
            <div className="all_file_search">
              <Search size='large' placeholder="input search text" style={{ width: '55%',borderRight: "2px solid #F6F6F6" }} />
              <Dropdown overlay={menu}>
                <Button size='large' type="primary">
                  <PlusOutlined />  Button <CaretDownOutlined />
                </Button>
              </Dropdown>
            </div>
          </div>
        </Col>
        <AllFilesData />
      </Row> */}

        {/* <div className="all_file_header"> */}
        {/* <div className="all_file_tap_section"> */}
        {/* <Tabs defaultActiveKey="1" onChange={callback}>
              <TabPane tab="Tab 1" key="1">
                Content of Tab Pane 1
              </TabPane>
              <TabPane tab="Tab 2" key="2">
                Content of Tab Pane 2
              </TabPane>
              <TabPane tab="Tab 3" key="3">
                Content of Tab Pane 3
              </TabPane>
            </Tabs> */}
        {/* <p 
            className= {
              isLavelActive && 
              isFilterActive === false 
              && isTamplateActive === false 
              ? 'tab_active' : ''} >LABELS</p>
            <p
            className= {
              isLavelActive === false && 
              isFilterActive === true 
              && isTamplateActive === false 
              ? 'tab_active' : ''}>FILTERS</p>
            <p
            className= {
              isLavelActive === false && 
              isFilterActive === true 
              && isTamplateActive === false 
              ? 'tab_active' : ''}>TAMPLATES</p>
            <p className="tap_icon"><LeftOutlined /></p> */}
        {/* </div>
          <div className="all_file_search_section">
            <div className="search_input"> */}
        {/* <label htmlFor="input"><SearchOutlined /></label> */}
        {/* <Input size='large' placeholder="Search files..." />
              
            </div>
            
            <Button size='large' type="primary" icon={<PlusOutlined />}>
              Search
            </Button>
          </div> */}
        {/* <div className="all_file_tabs_container">
            <Tabs defaultActiveKey="1" onChange={callback}>
              <TabPane tab="Tab 1" key="1">
                Content of Tab Pane 1
              </TabPane>
              <TabPane tab="Tab 2" key="2">
                Content of Tab Pane 2
              </TabPane>
              <TabPane tab="Tab 3" key="3">
                Content of Tab Pane 3
              </TabPane>
            </Tabs>
          </div>
          <div className="all_file_search_container">
            <div className="all_file_search">
              <SearchOutlined />
              <Input />
              <Button type="primary" icon={<SearchOutlined />}>
                Search
              </Button>
            </div>
          </div> */}
        {/* </div> */}
      </div>
    </>
  )
}

export default AllFiles
