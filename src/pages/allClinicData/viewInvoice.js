/* eslint-disable prefer-template */
/* eslint-disable  react-hooks/rules-of-hooks */
/* eslint-disable no-array-constructor */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable radix */
/* eslint-disable array-callback-return */

import React, { useEffect, useState } from 'react'
import { Tooltip, Button } from 'antd'
import { PrinterOutlined } from '@ant-design/icons'
import moment from 'moment'
import { ToWords } from 'to-words'
import { useHistory } from 'react-router-dom'
import logo from '../../images/WhatsApp Image 2020-04-23 at 10.00.40 (1).jpeg'

const general = {
  fontSize: '12px',
  padding: '5px 8px',
  color: 'black',
  fontWeight: '500',
}

const sectionMain = {
  width: '100%',
  border: '1px solid black',
  color: 'black',
}
const section = {
  padding: '8px',
  display: 'flex',
  flexDirection: 'row',
  color: 'black',
  width: '100%',
  borderBottom: '1px solid black',
}
const flexSection = {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  padding: '5px 8px',
  textAlign: 'left',
}
const dateSection = {
  width: '50%',
  fontSize: 12,
  alignSelf: 'flex-start',
  textAlign: 'left',
  fontWeight: '500',
}

const rowStyle = {
  borderBottom: '1px solid black',
  display: 'flex',
  float: 'left',
  width: '100%',
  flexDirection: 'row',
}
const qtyCol = {
  ...general,
  display: 'flex',
  width: '18%',
  borderLeft: '1px solid black',
}
const serviceCol = {
  ...general,
  width: '35%',
  borderLeft: '1px solid black',
}
const rightText = { width: '100%', margin: 'auto 0', textAlign: 'right' }
const taxSection = {
  ...general,
  padding: '0',
  alignSelf: 'flex-end',
  textAlign: 'right',
  minWidth: '120px',
}
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function getTotal(subTotal, discount = 0, gst = 0, sgst = 0, taxableSubtotal = 0) {
  return Number(
    subTotal -
      (subTotal / 100) * parseFloat(discount || 0) +
      (subTotal / 100) * parseFloat(gst || 0) +
      (subTotal / 100) * parseFloat(sgst || 0) +
      (subTotal / 100) * parseFloat(taxableSubtotal || 0),
  ).toFixed(2)
}

function ViewInvoice({ invoice }) {
  const [subTotal, setSubtotal] = useState(0)
  const history = useHistory()
  const currentCurrencyName = invoice.clinic.currency ? invoice.clinic.currency.currency : 'USD'

  console.log(invoice, 'currentCyName')
  useEffect(() => {
    let tempSubTotal = 0
    invoice.invoiceFee.edges.map(item => {
      const tempTotal = Number(item.node.quantity * item.node.rate).toFixed(3)
      tempSubTotal = (Number(tempSubTotal) + Number(tempTotal)).toFixed(3)
    })
    setSubtotal(tempSubTotal)
  }, [])

  const toWords = new ToWords({
    localeCode: currentCurrencyName === 'INR' ? 'en-IN' : 'en-US',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
    },
  })

  const total = getTotal(
    subTotal,
    invoice.discount,
    invoice.gst,
    invoice.sgst,
    invoice.taxableSubtotal,
  )

  const invoke = () => {
    localStorage.setItem('currentInvoice', JSON.stringify(invoice))
    history.push('/printInvoice')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="ant-drawer-header">
        <div
          style={{
            margin: 0,
            color: 'rgba(0, 0, 0, 0.85)',
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: '22px',
          }}
        >
          {invoice.invoiceNo}
        </div>
        <Tooltip placement="top" title="Download Pdf">
          <Button
            className=" ant-drawer-close"
            style={{ right: '45px' }}
            type="link"
            onClick={invoke}
          >
            <PrinterOutlined />
          </Button>
        </Tooltip>
      </div>
      <div style={{ margin: '50px auto' }}>
        <div style={{ width: '600px', height: 'fit-content' }}>
          <div style={sectionMain}>
            <div style={{ ...section, height: '120px' }}>
              <img alt="logog" src={logo} style={{ width: '30%', alignSelf: 'center' }} />
              <div
                style={{
                  textAlign: 'center',
                  width: '250px',
                  alignSelf: 'center',
                  fontWeight: '600',
                  marginLeft: '20px',
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    width: '100%',
                    alignSelf: 'flex-start',
                    textAlign: 'left',
                  }}
                >
                  SM Learning Skills Academy for Special Needs Pvt. Ltd.
                </div>
                <div
                  style={{
                    fontSize: 10,
                    width: '100%',
                    alignSelf: 'flex-start',
                    textAlign: 'left',
                    fontWeight: '600',
                  }}
                >
                  Gurugram, Haryana 122002 India
                </div>
                <div
                  style={{
                    fontSize: 10,
                    width: '100%',
                    alignSelf: 'flex-start',
                    textAlign: 'left',
                    fontWeight: '600',
                  }}
                >
                  GSTIN 06AAXCS2626LIZQ
                </div>
              </div>
              <div
                style={{
                  textAlign: 'center',
                  width: '200px',
                  alignSelf: 'center',
                }}
              >
                <div>{invoice.invoiceNo}</div>
              </div>
            </div>
            <div style={{ ...section, height: '120px', padding: '0' }}>
              <div style={{ width: '50%', height: '100%', borderRight: '1px solid black' }}>
                <div style={{ ...flexSection, paddingBottom: '0' }}>
                  <div style={{ ...dateSection, fontWeight: '600' }}> #INV</div>
                  <div style={dateSection}> : {invoice.invoiceNo}</div>
                </div>
                <div style={{ ...flexSection, paddingBottom: '0' }}>
                  <div style={{ ...dateSection, fontWeight: '600' }}> Issue Date</div>
                  <div style={dateSection}> : {invoice.issueDate}</div>
                </div>
                <div style={{ ...flexSection, paddingBottom: '0' }}>
                  <div style={{ ...dateSection, fontWeight: '600' }}> Due Date</div>
                  <div style={dateSection}> : {invoice.dueDate}</div>
                </div>
              </div>
              <div style={{ width: '50%' }}>
                <div style={{ ...flexSection, paddingBottom: '0' }}>
                  <div style={{ ...dateSection, fontWeight: '600' }}> Place of supply</div>
                  <div style={dateSection}> : {invoice.address}</div>
                </div>
              </div>
            </div>
            <div
              style={{
                borderBottom: '1px solid black',
                height: '75px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#fafafa',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div
                  style={{ ...general, alignSelf: 'flex-start', width: '100px', fontWeight: '600' }}
                >
                  Bill To
                </div>
                <div style={{ ...general, alignSelf: 'flex-start', width: '300px' }}>
                  : {invoice.clinic.schoolName}, {invoice.address}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div
                  style={{
                    ...general,
                    paddingTop: 0,
                    alignSelf: 'flex-start',
                    width: '100px',
                    fontWeight: '600',
                  }}
                >
                  Email
                </div>
                <div style={{ ...general, paddingTop: 0, alignSelf: 'flex-start', width: '300px' }}>
                  : {invoice.email}
                </div>
              </div>
            </div>

            <div
              style={{
                borderBottom: '1px solid black',
                height: '65px',
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <div
                style={{
                  ...general,
                  alignSelf: 'flex-start',
                  width: '100px',
                  fontWeight: '600',
                }}
              >
                Subject
              </div>
              <div style={{ ...general, alignSelf: 'flex-start', width: '300px' }}>
                : Cogniable Service Invoice for{' '}
                {
                  monthNames[
                    moment(invoice.issueDate)
                      .subtract(1, 'M')
                      .format('MM') - 1
                  ]
                }{' '}
                {new Date(invoice.issueDate).getFullYear()}
              </div>
            </div>
            <div style={{ ...rowStyle, backgroundColor: '#fafafa' }}>
              <div
                style={{
                  ...qtyCol,
                  width: '30px',
                  alignSelf: 'flex-start',
                  borderLeft: 'none',
                  fontWeight: '600',
                }}
              >
                #
              </div>
              <div style={{ ...serviceCol, fontWeight: '600' }}>Service</div>
              <div style={{ ...qtyCol, fontWeight: '600' }}>
                <div style={rightText}>Quantity</div>
              </div>
              <div style={{ ...qtyCol, fontWeight: '600' }}>
                <div style={rightText}>Rate ({currentCurrencyName})</div>
              </div>
              <div style={{ ...qtyCol, fontWeight: '600', width: '24%' }}>
                <div style={rightText}>Amount ({currentCurrencyName})</div>
              </div>
            </div>
            {invoice.invoiceFee.edges.map((item, index) => {
              const tempTotal = Number(item.node.quantity * item.node.rate).toFixed(2)
              return (
                <div style={rowStyle} key={item.node.id}>
                  <div
                    style={{
                      ...qtyCol,
                      width: '30px',
                      borderLeft: 'none',
                    }}
                  >
                    <div style={{ margin: 'auto' }}>{index + 1}. </div>
                  </div>
                  <div style={serviceCol}>{item.node.schoolServices.name}</div>
                  <div style={qtyCol}>
                    <div style={rightText}>{item.node.quantity}</div>
                  </div>
                  <div style={qtyCol}>
                    <div style={rightText}>{item.node.rate}</div>
                  </div>
                  <div style={{ ...qtyCol, width: '24%' }}>
                    <div style={rightText}>{tempTotal}</div>
                  </div>
                </div>
              )
            })}
            <div
              style={{
                ...rowStyle,
                flexDirection: 'row-reverse',
                backgroundColor: '#fafafa',
              }}
            >
              <div
                style={{
                  ...general,
                  alignSelf: 'flex-end',
                  textAlign: 'right',
                  minWidth: '120px',
                }}
              >
                {subTotal} {currentCurrencyName}
              </div>
              <div style={general}>Subtotal :</div>
            </div>
            <div style={{ ...section, padding: '0', borderBottom: 'none' }}>
              <div style={{ width: '50%' }}>
                <div style={{ ...general, alignSelf: 'flex-start', width: '100%' }}>
                  {toWords.convert(total)}
                </div>
                <div style={{ ...general, alignSelf: 'flex-start', color: 'blue', width: '100%' }}>
                  <a href={invoice.paymentLink} rel="noopener noreferrer" target="_blank">
                    {invoice.paymentLink}
                  </a>
                </div>
              </div>
              <div
                style={{
                  width: '50%',
                  borderLeft: '1px solid black',
                }}
              >
                <div
                  style={{
                    ...flexSection,
                    flexDirection: 'row-reverse',
                  }}
                >
                  <div style={taxSection}>
                    {Number((subTotal / 100) * parseFloat(invoice.discount || 0)).toFixed(2)}{' '}
                    {currentCurrencyName}
                  </div>
                  <div style={{ ...taxSection, fontWeight: '600' }}>
                    Dicount({invoice.discount || 0}%) :
                  </div>
                </div>
                <div
                  style={{
                    ...flexSection,
                    flexDirection: 'row-reverse',
                  }}
                >
                  <div style={taxSection}>
                    {Number((subTotal / 100) * parseFloat(invoice.cgst || 0)).toFixed(2)}{' '}
                    {currentCurrencyName}
                  </div>
                  <div style={{ ...taxSection, fontWeight: '600' }}>
                    CGST({invoice.cgst || 0}%) :
                  </div>
                </div>
                <div
                  style={{
                    ...flexSection,
                    flexDirection: 'row-reverse',
                  }}
                >
                  <div style={taxSection}>
                    {Number((subTotal / 100) * parseFloat(invoice.sgst || 0)).toFixed(2)}{' '}
                    {currentCurrencyName}
                  </div>
                  <div style={{ ...taxSection, fontWeight: '600' }}>
                    SGST({invoice.sgst || 0}%) :
                  </div>
                </div>
                <div
                  style={{
                    ...flexSection,
                    flexDirection: 'row-reverse',
                  }}
                >
                  <div style={taxSection}>
                    {Number((subTotal / 100) * parseFloat(invoice.taxableSubtotal || 0)).toFixed(2)}{' '}
                    {currentCurrencyName}
                  </div>
                  <div style={{ ...taxSection, fontWeight: '600' }}>
                    Taxes({invoice.taxableSubtotal || 0}%) :
                  </div>
                </div>
                <div style={{ ...flexSection, flexDirection: 'row-reverse' }}>
                  <div style={taxSection}>
                    {getTotal(
                      subTotal,
                      invoice.discount,
                      invoice.cgst,
                      invoice.sgst,
                      invoice.taxableSubtotal,
                    )}{' '}
                    {currentCurrencyName}
                  </div>
                  <div style={{ ...taxSection, fontWeight: '600' }}>Total :</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ViewInvoice
