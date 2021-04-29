/* eslint-disable no-nested-ternary */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-closing-tag-location */
import React, { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from 'react-apollo'
import { Table, Button, Divider, Form, Input, Select, notification } from 'antd'
import { CANCEL_BUTTON, COLORS, FORM, SUBMITT_BUTTON } from 'assets/styles/globalStyles'
import client from '../../apollo/config'
import './allClinicData.scss'
import { UPDATE_RATES, CLINIC_RATES } from './query'

const { Option } = Select

// let { layout, tailLayout } = FORM
const layout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 16,
  },
}
const tailLayout = {
  wrapperCol: {
    offset: 7,
    span: 16,
  },
}

function UpdateClinicRates({ form, rowData, closeDrawer }) {
  const [rates, setRates] = useState(null)
  const [ratesExist, setRatesExist] = useState(false)
  const { data: ratesData, loading: ratesLoading } = useQuery(CLINIC_RATES, {
    variables: { clinic: rowData.details.id },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (ratesData) {
      const clinicRates = ratesData.getClinicRates && ratesData.getClinicRates.edges
      if (clinicRates.length > 0) {
        setRates(clinicRates[0].node)
        setRatesExist(true)
      }
    }
  }, [ratesData])

  const updateCLinicRates = e => {
    e.preventDefault()

    form.validateFields((error, values) => {
      if (!error) {
        const {
          learnerPrice,
          researchParticipantPrice,
          lastInvoicePrice,
          peakPrice,
          vbmappPrice,
        } = values

        const updatedData = client
          .mutate({
            mutation: UPDATE_RATES,
            variables: {
              clinic: rowData.details.id,
              learnerPrice,
              researchParticipantPrice,
              lastInvoicePrice,
              peakPrice,
              vbmappPrice,
            },
          })
          .then(result => {
            form.resetFields()
            notification.success({
              message: 'Clinic Rates Updated',
              description: 'Clinic rates updated successfully',
            })
            closeDrawer()
          })
          .catch(error1 => error1)
      }
    })

    return 'Data Updated'
  }

  const countryList = ['Bangladesh', 'UAE', 'India', 'USA', 'Canada']
  const currencyList = ['INR', 'USD', 'CAD']
  const currencySymbol = { INR: '₹', USD: '$', CAD: 'C$' }

  return (
    <>
      <Divider orientation="left">{ratesExist ? 'Update Rates' : 'Add rates'}</Divider>
      <Form {...layout} onSubmit={e => updateCLinicRates(e)}>
        <Form.Item label="Country">
          {form.getFieldDecorator('country', {
            initialValue: rowData.details.country.name,
            rules: [{ required: true, message: 'Please select a country!' }],
          })(
            <Select
              placeholder="Country"
              loading={ratesLoading}
              allowClear
              style={{ borderRadius: 0 }}
            >
              {countryList.map((item, index) => (
                <Option value={item} key={item}>
                  {item}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Currency">
          {form.getFieldDecorator('currency', {
            initialValue: rowData.details.currency ? rowData.details.currency.currency : 'USD',
            rules: [{ required: true, message: 'Please select a currency!' }],
          })(
            <Select placeholder="Currency" allowClear style={{ borderRadius: 0 }}>
              {currencyList.map(item => (
                <Option value={item} key={item}>
                  {currencySymbol[item]} {item}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="Price / Learner">
          {form.getFieldDecorator('learnerPrice', {
            initialValue: rates?.learnerPrice,
            rules: [{ required: true, message: 'Please enter price/learner' }],
          })(
            <Input
              type="number"
              style={{ borderRadius: 0 }}
              onKeyPress={e => {
                if (e.key === 'e' || e.key === '-' || e.key === '+') {
                  e.preventDefault()
                }
              }}
            />,
          )}
        </Form.Item>
        <Form.Item label="Research Participants">
          {form.getFieldDecorator('researchParticipantPrice', {
            initialValue: rates?.researchParticipantPrice,
            rules: [{ required: true, message: 'Please enter research participant price' }],
          })(<Input type="number" style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="Last Invoice Amount">
          {form.getFieldDecorator('lastInvoicePrice', {
            initialValue: rates?.lastInvoicePrice,
            rules: [{ required: true, message: 'Please enter last invoice' }],
          })(<Input type="number" style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item label="PEAK">
          {form.getFieldDecorator('peakPrice', {
            initialValue: rates?.peakPrice,
            loading: ratesLoading,
            rules: [{ required: true, message: 'Please enter price price' }],
          })(<Input type="number" style={{ borderRadius: 0 }} />)}
        </Form.Item>

        <Form.Item label="VBMAPP">
          {form.getFieldDecorator('vbmappPrice', {
            initialValue: rates?.vbmappPrice,
            loading: ratesLoading,
            rules: [{ required: true, message: 'Please enter vbmapp price' }],
          })(<Input type="number" style={{ borderRadius: 0 }} />)}
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" style={SUBMITT_BUTTON}>
            Save
          </Button>
          <Button type="ghost" style={CANCEL_BUTTON} onClick={() => closeDrawer()}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default Form.create()(UpdateClinicRates)
