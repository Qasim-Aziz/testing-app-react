/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react'
import Authorize from 'components/LayoutComponents/Authorize'
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
      <Authorize roles={['superUser']} redirect to="/404">
        <Helmet title="Dashboard Alpha" />
        <Layout style={{ padding: '0px' }}>
          <Tabs tabBarExtraContent={paymentDetailsButton}>
            <TabPane tab="Customer" key="Customer">
              <CustomerList />
            </TabPane>
            <TabPane tab="Invoices" key="Invoices">
              <InvoiceList />
            </TabPane>
          </Tabs>
        </Layout>
        <Drawer
          width={DRAWER.widthL2}
          title="Update Payment accepting details"
          visible={bankDetailsDrawer}
          onClose={() => setBankDetailsDrawer(false)}
          destroyOnClose
        >
          <BankDetails setBankDetailsDrawer={setBankDetailsDrawer} />
        </Drawer>
      </Authorize>

    </div>
  )
}
