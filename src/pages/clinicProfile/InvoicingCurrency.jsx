import React, {useEffect, useRef} from 'react'
import {Button, Form, Input, Select} from "antd";
import styles from './clinicalProfile.module.scss'

const InvoicingCurrencyForm = (props) => {
  const { form } = props
  const { Option } = Select;
  const formRef = useRef(null)

  console.log('form==?', form)

  const saveInvoicingCurrency = () => {
    form.validateFields((error, values) => {
      console.log('error, values==>', error, values)
      // isError = error
      // formValues = values
    })
  }

  useEffect(() => {
    form.setFieldsValue({
      invoicingCurrency: 'inr'
    })
  }, [])

  const handleChange = (d) => {
    console.log("d ==>",d);
  }

  return (
    <div className={styles.pageWrapper}>
      <Form ref={formRef} name="basic">
        <div className={styles.pageTitle}>
          <strong>Invoicing Currency</strong>
        </div>
        <Form.Item
          label="Invoicing Currency"
          name="invoicingCurrency"
          rules={[
            {
              required: true,
              message: 'Please select Invoicing Currency!',
            },
          ]}
        >
          {form.getFieldDecorator('invoicingCurrency', {
            rules: [{ required: true, message: 'Please select Invoicing Currency!' }],
          })(
            <Select style={{ width: 200 }}>
              <Option value="inr">INR</Option>
              <Option value="us">US</Option>
            </Select>
            )}
        </Form.Item>

        <Form.Item>
          <Button onClick={saveInvoicingCurrency} type="primary" htmlType="submit">
            Save Invoicing Currency
          </Button>
        </Form.Item>

      </Form>
    </div>
  )
}

const InvoicingCurrency = Form.create()(InvoicingCurrencyForm)
export default InvoicingCurrency
