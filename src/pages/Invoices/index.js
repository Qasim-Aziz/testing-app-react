/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Button, Layout, PageHeader, Table, Drawer, notification, Popover, Tabs } from 'antd'
import { DRAWER } from 'assets/styles/globalStyles'
import InvoiceList from './invoiceList'
import CustomerList from './customerList'
import BankDetails from './bankDetails'

const { TabPane } = Tabs

export default () => {
  return (
    <div>
      <Helmet title="Dashboard Alpha" />
      <Layout style={{ padding: '0px' }}>
        <Tabs>
          <TabPane tab="Customer" key="Customer">
            <CustomerList />
          </TabPane>
          <TabPane tab="Invoices" key="Invoices">
            <InvoiceList />
          </TabPane>
        </Tabs>
      </Layout>
    </div>
  )
}
