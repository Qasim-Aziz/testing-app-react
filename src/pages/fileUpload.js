/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Radio,
  InputNumber,
  TimePicker,
  Typography,
  Switch,
  Upload
} from 'antd'
import { connect, useSelector } from 'react-redux'
import gql from 'graphql-tag'
import { useMutation, useQuery } from 'react-apollo'
import { UploadOutlined } from '@ant-design/icons';

const MealForm = () => {
  return (
    <Form name="control-ref" style={{ marginLeft: 0 }}>
      <Form.Item label="Madical Condition">
        <Upload>
          <Button>
            <UploadOutlined /> Click to Upload
          </Button>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{
            width: 206,
            height: 40,
            background: '#0B35B3',
          }}
        >
          Save Data
        </Button>
      </Form.Item>
    </Form>
  )
}

export default MealForm
