/* eslint-disable consistent-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-template */
/* eslint-disable  react-hooks/rules-of-hooks */
/* eslint-disable no-array-constructor */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable radix */
/* eslint-disable array-callback-return */

import React, { useEffect, useState } from 'react'
import { Tooltip, Button, notification, Drawer } from 'antd'
import { PrinterOutlined } from '@ant-design/icons'
import moment from 'moment'
import { ToWords } from 'to-words'
import { useHistory } from 'react-router-dom'
import { useQuery } from 'react-apollo'
import LoadingComponent from 'components/VBMappReport/LoadingComponent'
import { DRAWER } from 'assets/styles/globalStyles'
import PrintableInvoice from './printableInvoice'
import { GET_PAYMENT_DETAILS, GET_INVOICE_DETAIL } from './query'
import logo from '../../images/WhatsApp Image 2020-04-23 at 10.00.40 (1).jpeg'

const general = {
  fontSize: 13,
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
  fontSize: 13,
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

function getTotal(subTotal, discount = 0, gst = 0, sgst = 0, tax = 0) {
  return Number(
    subTotal -
      (subTotal / 100) * parseFloat(discount || 0) +
      (subTotal / 100) * parseFloat(gst || 0) +
      (subTotal / 100) * parseFloat(sgst || 0) +
      (subTotal / 100) * parseFloat(tax || 0),
  ).toFixed(2)
}

function ViewInvoice({ invoiceId }) {
  const [invoice, setInvoice] = useState(null)
  const [currencyName, setCurrencyName] = useState(null)
  const [subTotal, setSubtotal] = useState(0)
  const [printInvoiceDrawer, setPrintInvoiceDrawer] = useState(false)
  const [isValidImage, setIsValidImage] = useState(false)

  const currentCurrencyName = 'INR'
  const { data, loading, error } = useQuery(GET_PAYMENT_DETAILS)
  const { data: invoiceData, loading: isInvoiceDataLoading, error: invoiceDataErrors } = useQuery(
    GET_INVOICE_DETAIL,
    {
      variables: {
        id: invoiceId,
      },
    },
  )
  console.log(invoice, 'invoice')
  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Something went wrong',
        description: 'Unable tp fetch payment recieving method details',
      })
    }
  }, [error])

  useEffect(() => {
    if (invoiceData) {
      setInvoice(invoiceData?.invoiceDetail)
      let tempTotal = 0
      invoiceData?.invoiceDetail.invoiceFee.edges.map(item => {
        const am = Number(Number(item.node.quantity * item.node.rate).toFixed(3))
        tempTotal += am
      })
      setSubtotal(tempTotal)
      setCurrencyName('INR')
    }
  }, [invoiceData])

  const toWords = new ToWords({
    localeCode: currentCurrencyName === 'USD' ? 'en-US' : 'en-IN',
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
    },
  })

  useEffect(() => {
    if (error || invoiceDataErrors) {
      return notification.error({
        message: 'Something went wrong',
        description: 'Unable to fetch invoice data',
      })
    }
  }, [error, invoiceDataErrors])

  if (isInvoiceDataLoading || loading || !invoice) return <LoadingComponent />
  if (error || invoiceDataErrors || !invoiceData)
    return (
      <div style={{ marginTop: 80, marginLeft: 60, fontWeight: 700, fontSize: 18 }}>
        Opps, something went wrong
      </div>
    )

  const total = getTotal(subTotal, invoice.discount, invoice.gst, invoice.sgst, invoice.tax)

  if (loading) {
    return <LoadingComponent />
  }

  const {
    institutionName,
    streetAddress,
    city,
    state,
    country,
    pincode,
    accountHolderName,
    ifscCode,
    gpay,
    paytm,
    upi,
    bankName,
    gstin,
    accountNo,
  } = data.recievingPaymentDetails

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="ant-drawer-header">
        <div
          style={{
            margin: 0,
            color: 'rgba(0, 0, 0, 0.85)',
            fontWeight: 700,
            fontSize: 18,
            lineHeight: '22px',
            textAlign: 'center',
          }}
        >
          View Invoice - {invoice.invoiceNo}
        </div>
        <Tooltip placement="top" title="Download Pdf">
          <Button
            className=" ant-drawer-close"
            style={{ right: '45px' }}
            type="link"
            onClick={() => setPrintInvoiceDrawer(true)}
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
                  width: '300px',
                  alignSelf: 'center',
                  fontWeight: '600',
                  padding: '0 20px',
                  marginLeft: '20px',
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    width: '100%',
                    alignSelf: 'flex-start',
                    textAlign: 'left',
                  }}
                >
                  {institutionName}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    width: '100%',
                    alignSelf: 'flex-start',
                    textAlign: 'left',
                    fontWeight: '600',
                  }}
                >
                  {streetAddress} {city}, {state} {country?.name}, {pincode}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    width: '100%',
                    alignSelf: 'flex-start',
                    textAlign: 'left',
                    fontWeight: '600',
                  }}
                >
                  GSTIN {gstin}
                </div>
              </div>
              <div
                style={{
                  textAlign: 'center',
                  width: '200px',
                  alignSelf: 'center',
                  fontSize: 18,
                }}
              >
                <div>{invoice.invoiceNo}</div>
              </div>
            </div>
            <div style={{ ...section, minHeight: '120px', height: 'fit-content', padding: '0' }}>
              <div style={{ width: '50%', height: '100%' }}>
                <div style={{ ...flexSection, paddingBottom: '0' }}>
                  <div style={{ ...dateSection, widh: '40%', fontWeight: '600' }}> #INV</div>
                  <div style={{ ...dateSection, width: '60%' }}> : {invoice.invoiceNo}</div>
                </div>
                <div style={{ ...flexSection, paddingBottom: '0' }}>
                  <div style={{ ...dateSection, widh: '40%', fontWeight: '600' }}> Issue Date</div>
                  <div style={{ ...dateSection, width: '60%' }}> : {invoice.issueDate}</div>
                </div>
                <div style={{ ...flexSection, paddingBottom: '0' }}>
                  <div style={{ ...dateSection, widh: '40%', fontWeight: '600' }}> Due Date</div>
                  <div style={{ ...dateSection, width: '60%' }}> : {invoice.dueDate}</div>
                </div>
              </div>
              <div style={{ width: '50%', borderLeft: '1px solid black' }}>
                <div style={{ ...flexSection, paddingBottom: '0' }}>
                  <div style={{ ...dateSection, width: '40%', fontWeight: '600' }}>
                    Place of supply
                  </div>
                  <div style={{ ...dateSection, width: '60%' }}> : {invoice.address}</div>
                </div>
              </div>
            </div>
            <div
              style={{
                borderBottom: '1px solid black',
                minHeight: '75px',
                height: 'fit-content',
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
                }
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
                <div
                  style={{ ...general, fontWeight: 'bold', alignSelf: 'flex-start', width: '100%' }}
                >
                  {toWords.convert(total)}
                </div>
                {invoice.paymentLink ? (
                  <div style={{ ...general, alignSelf: 'flex-start', width: '100%' }}>
                    <b>Razor pay:</b>{' '}
                    <a href={invoice.paymentLink} rel="noopener noreferrer" target="_blank">
                      {invoice.paymentLink}
                    </a>
                  </div>
                ) : null}
                <div
                  style={{
                    ...general,
                    paddingBottom: '1px',
                    alignSelf: 'flex-start',
                    width: '100%',
                  }}
                >
                  <b>Bank A/C No:</b> <span>{accountNo}</span>
                </div>
                <div
                  style={{ ...general, padding: '1px 8px', alignSelf: 'flex-start', width: '100%' }}
                >
                  <b>IFSC Code:</b> {ifscCode}
                </div>
                <div
                  style={{ ...general, padding: '1px 8px', alignSelf: 'flex-start', width: '100%' }}
                >
                  <b>Branch:</b> {bankName}
                </div>
                <div
                  style={{ ...general, padding: '1px 8px', alignSelf: 'flex-start', width: '100%' }}
                >
                  <b>A/C Holder Name:</b> {accountHolderName}
                </div>
                {upi ? (
                  <div
                    style={{
                      ...general,
                      paddingBottom: '1px',
                      alignSelf: 'flex-start',
                      width: '100%',
                    }}
                  >
                    <b>UPI:</b> {upi}
                  </div>
                ) : null}
                {gpay ? (
                  <div
                    style={{
                      ...general,
                      padding: '1px 8px',
                      alignSelf: 'flex-start',
                      width: '100%',
                    }}
                  >
                    <b>Google Pay: </b> {gpay}
                  </div>
                ) : null}
                {paytm ? (
                  <div
                    style={{
                      ...general,
                      padding: '1px 8px 5px',
                      alignSelf: 'flex-start',
                      width: '100%',
                    }}
                  >
                    <b>Paytm:</b> {paytm}
                  </div>
                ) : null}
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
                    {Number((subTotal / 100) * parseFloat(invoice.tax || 0)).toFixed(2)}{' '}
                    {currentCurrencyName}
                  </div>
                  <div style={{ ...taxSection, fontWeight: '600' }}>
                    Taxes({invoice.tax || 0}%) :
                  </div>
                </div>
                <div style={{ ...flexSection, flexDirection: 'row-reverse' }}>
                  <div style={taxSection}>
                    {getTotal(subTotal, invoice.discount, invoice.cgst, invoice.sgst, invoice.tax)}{' '}
                    {currentCurrencyName}
                  </div>
                  <div style={{ ...taxSection, fontWeight: '600' }}>Total :</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Drawer
        title={`Print Invoice - ${invoice?.invoiceNo}`}
        visible={printInvoiceDrawer}
        width={DRAWER.widthL2}
        onClose={() => setPrintInvoiceDrawer(false)}
      >
        <PrintableInvoice invoiceId={invoice.id} />
      </Drawer>
    </div>
  )
}
export default ViewInvoice
