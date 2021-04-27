import React from 'react'
import { Form, Button, Popconfirm, notification } from 'antd'
import { useMutation } from 'react-apollo'
import { FORM, COLORS, SUBMITT_BUTTON, CANCEL_BUTTON } from 'assets/styles/globalStyles'
import { GENERATE_LINK, PAYMENT_REMINDER } from './query'

const { layout, tailLayout } = FORM

function SendPaymentLinks({ selectedRowKeys, payReminderData, closeDrawer }) {
  const [generatePaymentLink, { loading: generatePaymentLinkLoading }] = useMutation(GENERATE_LINK)
  const [sendPaymentReminder, { loading: sendPaymentReminderLoading }] = useMutation(
    PAYMENT_REMINDER,
  )

  const handleSubmitt = () => {
    if (payReminderData && payReminderData.length > 0) {
      const createIds = []
      const sendNotiIds = []
      payReminderData.map(item => (item.linkGenerated === false ? createIds.push(item.key) : null))
      payReminderData.map(item =>
        item.status === 'Sent' || item.status === 'Partially Paid' || item.status === 'Pending'
          ? sendNotiIds.push(item.key)
          : null,
      )
      // console.log(createIds, sendNotiIds)

      try {
        if (createIds.length > 0) {
          generatePaymentLink({
            variables: {
              pk: createIds,
            },
          }).then(res => {
            console.log(res, 'res1')
            if (sendNotiIds.length > 0) {
              sendPaymentReminder({
                variables: {
                  pk: sendNotiIds,
                },
              }).then(resp => {
                console.log(resp, 'res2')
                notification.success({
                  message: resp.message,
                })
              })
            }
          })
        } else if (sendNotiIds.length > 0) {
          sendPaymentReminder({
            variables: {
              pk: sendNotiIds,
            },
          }).then(resp => {
            console.log(resp, 'res2')
            notification.success({
              message: resp.message,
            })
          })
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  console.log(payReminderData, 'payremindeer data')
  return (
    <div>
      {payReminderData && payReminderData?.length > 0 ? (
        <>
          <Form.Item {...layout} label="Selected Invoices">
            <div>
              <ol style={{ display: 'grid', gridTemplateColumns: 'auto auto' }}>
                {payReminderData &&
                  payReminderData.map((item, index) => (
                    <li key={item.key} style={{ width: 340 }}>
                      {item.name ? `${item.invNo} - ${item.name}` : `${item.invNo} - ${item.email}`}
                    </li>
                  ))}
              </ol>
            </div>
            <div style={{ alignItems: 'center' }}>
              <b>Create and send payments links for the selected invoices</b>
            </div>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
              type="default"
              loading={generatePaymentLinkLoading || sendPaymentReminderLoading}
              onClick={e => handleSubmitt(e)}
              style={SUBMITT_BUTTON}
            >
              Send Invoices
            </Button>
            <Button onClick={closeDrawer} type="ghost" style={CANCEL_BUTTON}>
              Cancel
            </Button>
          </Form.Item>
        </>
      ) : (
        <b>None, Please select at least one invoice</b>
      )}
    </div>
  )
}

export default SendPaymentLinks
