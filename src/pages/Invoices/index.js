/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Button, Layout, PageHeader, Table, Drawer, notification, Popover, Tabs } from 'antd'
import { PlusOutlined, MoreOutlined } from '@ant-design/icons'
import { createUseStyles } from 'react-jss'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import moment from 'moment'
import InvoiceForm from '../../components/invoice/InvoiceForm'
import FilterCard from './FilterCard'
import InvoiceList from './invoiceList'
import CustomerList from './customerList'
import BankDetails from './bankDetails'

const { Content } = Layout
const { Column } = Table
const { TabPane } = Tabs

const dateFormate = 'YYYY-MM-DD'

export default () => {
  const [newInvDrawer, setNewInvDrawer] = useState(false)
  const [data, setData] = useState()

  // invoice filer
  const [form, setForm] = useState()
  const [to, setTo] = useState()
  const [month, setMonth] = useState()
  const [statusSelect, setStatusSelect] = useState()

  return (
    <div>
      <Helmet title="Dashboard Alpha" />
      <Layout style={{ padding: '0px' }}>
        <Tabs>
          <TabPane tab="Details" key="Details">
            <BankDetails />
          </TabPane>
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
