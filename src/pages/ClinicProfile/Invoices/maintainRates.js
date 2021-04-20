import React from 'react'
import { useQuery, useMutation, useLazyQuery } from 'react-apollo'
import { Helmet } from 'react-helmet'
import { Tabs, Layout } from 'antd'
import {
  CREATE_STUDENT_RATES,
  UPDATE_STUDENT_RATES,
  GET_STUDENT_FEE_DETAILS,
  GET_STUDENT_INVOICE_FEE,
} from './query'
import FlatRates from './flatRates'
import HourlyRates from './hourlyRates'

const { TabPane } = Tabs

function MaintainRates({ currentRow, closeDrawer }) {
  return (
    <div style={{ marginBottom: 50 }}>
      <Helmet title="Dashboard Alpha" />
      <Layout style={{ padding: '0px' }}>
        <Tabs>
          <TabPane tab="Flat Rates" key="flatRates">
            <FlatRates currentRow={currentRow} closeDrawer={closeDrawer} />
          </TabPane>
          <TabPane tab="Hourly Rates" key="hourlyRates">
            <HourlyRates currentRow={currentRow} closeDrawer={closeDrawer} />
          </TabPane>
        </Tabs>
      </Layout>
    </div>
  )
}

export default MaintainRates
