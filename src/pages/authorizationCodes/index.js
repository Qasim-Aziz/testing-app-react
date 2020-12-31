/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-vars */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prefer-const */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable object-shorthand */
/* eslint-disable react/jsx-boolean-value */

import React from 'react'
import { Tabs, Col, Row } from 'antd'

import Authorize from '../../components/LayoutComponents/Authorize'
import './style.scss'
import CodesTable from './codes/CodesTable'
import RateTable from './feeScheduleRates/RateTable'
import FeeStructureTable from './feeStructures/FeeStructureTable'

const { TabPane } = Tabs

class ServiceTable extends React.Component {
  state = {}

  render() {
    return (
      <Authorize roles={['school_admin']} redirect to="/dashboard/beta">
        <Row style={{ width: '100%' }}>
          <Col span={24}>
            <Tabs>
              <TabPane tab="Service Codes" key="1">
                <CodesTable />
              </TabPane>
              <TabPane tab="Fee Schedule Rates" key="2">
                <RateTable />
              </TabPane>
              {/* <TabPane tab="Fee Structures" key="3">
                <FeeStructureTable />
              </TabPane> */}
            </Tabs>
          </Col>
        </Row>
      </Authorize>
    )
  }
}

export default ServiceTable
