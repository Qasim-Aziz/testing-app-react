/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Button, Layout, Tabs } from 'antd'
import { DRAWER } from 'assets/styles/globalStyles'
import InvoiceList from './invoicesList'
import CustomerList from './customerList'

const { TabPane } = Tabs

export default () => {
  return (
    <div style={{ marginBottom: 50 }}>
      <Helmet title="Dashboard Alpha" />
      <Layout style={{ padding: '0px' }}>
        <Tabs>
          <TabPane tab="Invoices" key="Invoices">
            <InvoiceList />
          </TabPane>
          <TabPane tab="Customer" key="Customer">
            <CustomerList />
          </TabPane>
        </Tabs>
      </Layout>
    </div>
  )
}
