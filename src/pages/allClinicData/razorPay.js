import React, { useEffect } from 'react'
import gql from 'graphql-tag'
import { useQuery, useLazyQuery, useMutation } from 'react-apollo'
import moment from 'moment'
import client from '../../apollo/config'

function loadRazor(src) {
  return new Promise(resolve => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}
const pay = async () => {
  const res = await loadRazor('https://checkout.razorpay.com/v1/checkout.js')

  if (res) {
    const options = {
      key: 'rzp_test_jKE7haPJ9GVcVi',
      amount: '500',
      currency: 'INR',
      name: 'Cogniable',
      description: 'Test Transaction',
      image: 'https://example.com/your_logo',
      order_id: '',
      handler: response => {
        alert(response.razorpay_payment_id)
        alert(response.razorpay_order_id)
        alert(response.razorpay_signature)
      },
      prefill: {
        name: 'Gaurav Kumar',
        email: 'gaurav.kumar@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Razorpay Corporate Office',
      },
      theme: {
        color: '#3399cc',
      },
    }

    const rzp1 = new window.Razorpay(options)
    rzp1.open()

    // rzp1.on('payment.failed', function(response) {
    //   alert(response.error.code)
    //   alert(response.error.description)
    //   alert(response.error.source)
    //   alert(response.error.step)
    //   alert(response.error.reason)
    //   alert(response.error.metadata.order_id)
    //   alert(response.error.metadata.payment_id)
    // })
    // document.getElementById('rzp-button1').onclick = function(e) {
    //   e.preventDefault()
    // }
  }
}
const NOTIFICATION = gql`
  mutation RazorpayInvoiceNotification($pk: ID!) {
    razorpayInvoiceNotification(input: { pk: $pk }) {
      status
      message
    }
  }
`
const GENERATE_LINK = gql`
  mutation RazorpayGenerateLink($pk: ID!) {
    razorpayGenerateLink(input: { pk: $pk }) {
      status
      message
    }
  }
`
const CREATE_INVOICE = gql`
  mutation createInvoice(
    $clinic: ID
    $email: String!
    $status: ID!
    $issueDate: Date!
    $dueDate: Date!
    $address: String!
    $taxableSubtotal: Float!
    $discount: Float!
    $total: Float!
    $due: Float!
  ) {
    createInvoice(
      input: {
        invoiceNo: "# 0001" # need to generate from server (for now its hard coded)
        clinic: $clinic
        email: $email
        status: $status
        issueDate: $issueDate
        dueDate: $dueDate
        amount: $due # ballance due (maybe calculated by server)
        address: $address
        taxableSubtotal: $taxableSubtotal # should be calculated by server
        discount: $discount
        total: $total # should be calculated by server
      }
    ) {
      details {
        id
        invoiceNo
        email
        issueDate
        dueDate
        amount
        address
        taxableSubtotal
        discount
        total

        clinic {
          id
          schoolName
        }
        status {
          id
          statusName
        }
        invoiceFee {
          edges {
            node {
              id
              quantity
              rate
              amount
              tax
              schoolServices {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`

function RazorPay() {
  const [
    createInvoice,
    { data: newInvoiceData, loading: newInvoiceLoading, error: newInvoiceError },
  ] = useMutation(CREATE_INVOICE)

  const inv = () => {
    createInvoice({
      variables: {
        clinic: 'U2Nob29sVHlwZTo0NTA=',
        email: 'sdev6631@gmail.com',
        status: 'SW52b2ljZVN0YXR1c1R5cGU6Mg==',
        issueDate: moment('2021-01-05').format('YYYY-MM-DD'),
        dueDate: moment('2021-01-30').format('YYYY-MM-DD'),
        address: 'Bulandshahr, UP',
        taxableSubtotal: parseFloat(0),
        discount: parseFloat(0),
        total: parseFloat(10),
        due: parseFloat(20),
      },
    })
      .then(data => {
        console.log(data, 'invoice data')
        return data
      })
      .catch(err => console.log(err, 'getting error in creatig invoice'))
  }
  const handleClick = () => {
    const dt = client
      .mutate({
        mutation: NOTIFICATION,
        variables: { pk: '"SW52b2ljZVR5cGU6MTA3"' },
      })
      .then(res => console.log(res, 'getting razor response'))
      .catch(err => console.log(err, 'getting razor error'))
  }
  const generateLink = () => {
    const dt = client
      .mutate({
        mutation: GENERATE_LINK,
        variables: { pk: 'SW52b2ljZVR5cGU6MTA3' },
      })
      .then(res => console.log(res, 'generating razor response'))
      .catch(err => console.log(err, 'getting razor error'))
  }

  // const bt = "b'{"id":"inv_GLVSxedOt0EzS3","entity":"invoice","receipt":"#INV0034","invoice_number":"#INV0034","customer_id":"cust_GLVSxgWswc7vaR","customer_details":{"id":"cust_GLVSxgWswc7vaR","name":"Cogniable Training Clinic","email":"sdev6631@gmail.com","contact":"9049221619","gstin":null,"billing_address":null,"shipping_address":null,"customer_name":"Cogniable Training Clinic","customer_email":"sdev6631@gmail.com","customer_contact":"9049221619"},"order_id":"order_GLVSxiYt4JDcSK","line_items":[],"payment_id":null,"status":"issued","expire_by":1609996540,"issued_at":1609823742,"paid_at":null,"cancelled_at":null,"expired_at":null,"sms_status":"pending","email_status":"pending","date":1609823742,"terms":null,"partial_payment":true,"gross_amount":2000,"tax_amount":0,"taxable_amount":0,"amount":2000,"amount_paid":0,"amount_due":2000,"currency":"INR","currency_symbol":"\\u20b9","description":"SM Learning Skills Academy for Special Needs Private Limited","notes":[],"comment":null,"short_url":"https:\\/\\/rzp.io\\/i\\/roY9pUb","view_less":true,"billing_start":null,"billing_end":null,"type":"link","group_taxes_discounts":false,"user":null,"created_at":1609823742}'",

  return (
    <div>
      <button type="button" id="rzp-button1" onClick={handleClick}>
        notification
      </button>
      <button type="button" id="rzp-button1" onClick={generateLink}>
        GENERATE_LINK
      </button>
      <button type="button" id="rzp-button2" onClick={inv}>
        create invoice
      </button>
    </div>
  )
}

export default RazorPay
