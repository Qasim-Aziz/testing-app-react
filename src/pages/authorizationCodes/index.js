import React from 'react'
import { Tabs, Col, Row } from 'antd'

import Authorize from '../../components/LayoutComponents/Authorize'
import CodesTable from './codes/CodesTable'
import RateTable from './feeScheduleRates/RateTable'
import FeeStructureTable from './feeStructures/FeeStructureTable'
import './style.scss'

const { TabPane } = Tabs

const ServiceTable = () => (
  <Authorize roles={['school_admin']} redirect to="/dashboard/beta">
    <Row style={{ width: '100%', marginTop: '30px' }}>
      <Col span={24}>
        <Tabs type="card">
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

export default ServiceTable
