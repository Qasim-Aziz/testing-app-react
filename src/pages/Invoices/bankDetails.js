/* eslint-disable */
import React from 'react'
import { Form, Button, Input, Select, Layout, Typography } from 'antd'

const { Header, Content } = Layout
const { Text } = Typography

function BankDetails() {
  return (
    <div>
      <Layout style={{ padding: '48px' }}>
        <Content>
          <Text
            style={{
              fontSize: 26,
              color: '#000',
            }}
          >
            Payment accepting methods
          </Text>
        </Content>
      </Layout>
    </div>
  )
}

export default BankDetails
