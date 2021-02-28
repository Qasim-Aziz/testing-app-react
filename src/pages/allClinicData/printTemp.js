/* eslint-disable prefer-template */
/* eslint-disable  react-hooks/rules-of-hooks */
/* eslint-disable no-array-constructor */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable radix */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from 'react-apollo'
import { Page, Text, View, Document, StyleSheet, Image, PDFViewer } from '@react-pdf/renderer'
import { Typography, Row, Layout, Col, Tabs, Card, Table, Tag, Select, Button } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import { ToWords } from 'to-words'
import moment from 'moment'
import apolloClient from '../../apollo/config'
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
  minWidth: '100px',
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
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

function Printable(props) {
  const invoice = JSON.parse(localStorage.getItem('currentInvoice'))
  const [subTotal, setSubtotal] = useState(0)
  const currentCurrency = invoice.currency ? invoice.currency.symbol : '$'
  const currentCurrencyName = invoice.currency ? invoice.currency.currency : 'USD'

  useEffect(() => {
    let tempSubTotal = 0
    invoice.invoiceFee.edges.map((item, index) => {
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

  return (
    <PDFViewer style={{ width: '100%', height: '1000px' }}>
      <Document>
        <Page size="[595, 760]" wrap={false} scale={1}>
          <View style={{ width: '600px', height: '1100px' }}>
            <View style={sectionMain}>
              <View style={{ ...section, height: '120px' }}>
                <Image src={logo} style={{ width: '30%', alignSelf: 'center' }} />
                <View
                  style={{
                    textAlign: 'center',
                    width: '250px',
                    alignSelf: 'center',
                    fontWeight: '600',
                    marginLeft: '20px',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      width: '100%',
                      alignSelf: 'flex-start',
                      textAlign: 'left',
                    }}
                  >
                    SM Learning Skills Academy for Special Needs Pvt. Ltd.
                  </Text>
                  <Text
                    style={{
                      // marginBottom: '8px',
                      fontSize: 10,
                      width: '100%',
                      alignSelf: 'flex-start',
                      textAlign: 'left',
                      fontWeight: '600',
                    }}
                  >
                    Gurugram, Haryana 122002 India
                  </Text>
                  <Text
                    style={{
                      // marginBottom: '8px',
                      fontSize: 10,
                      width: '100%',
                      alignSelf: 'flex-start',
                      textAlign: 'left',
                      fontWeight: '600',
                    }}
                  >
                    GSTIN 06AAXCS2626LIZQ
                  </Text>
                </View>
                <View
                  style={{
                    textAlign: 'center',
                    width: '200px',
                    alignSelf: 'center',
                  }}
                >
                  <Text>INVOICE</Text>
                </View>
              </View>
              <View style={{ ...section, height: '120px', padding: '0' }}>
                <View style={{ width: '50%', height: '100%', borderRight: '1px solid black' }}>
                  <View style={{ ...flexSection, paddingBottom: '0' }}>
                    <Text style={{ ...dateSection, fontWeight: '600' }}> #INV</Text>
                    <Text style={dateSection}> : this </Text>
                  </View>
                  <View style={{ ...flexSection, paddingBottom: '0' }}>
                    <Text style={{ ...dateSection, fontWeight: '600' }}> Issue Date</Text>
                    <Text style={dateSection}> : this </Text>
                  </View>
                  <View style={{ ...flexSection, paddingBottom: '0' }}>
                    <Text style={{ ...dateSection, fontWeight: '600' }}> Due Date</Text>
                    <Text style={dateSection}> this </Text>
                  </View>
                </View>
                <View style={{ width: '50%' }}>
                  <View style={{ ...flexSection, paddingBottom: '0' }}>
                    <Text style={{ ...dateSection, fontWeight: '600' }}> Place of supply</Text>
                    <Text style={dateSection}> : {invoice.address}</Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  borderBottom: '1px solid black',
                  height: '65px',
                  display: 'flex',
                  flexDirection: 'row',
                  backgroundColor: '#fafafa',
                }}
              >
                <Text
                  style={{ ...general, alignSelf: 'flex-start', width: '100px', fontWeight: '600' }}
                >
                  Bill To
                </Text>
                <Text style={{ ...general, alignSelf: 'flex-start', width: '300px' }}>
                  {invoice.address}
                </Text>
              </View>
              <View
                style={{
                  borderBottom: '1px solid black',
                  height: '65px',
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Text
                  style={{
                    ...general,
                    alignSelf: 'flex-start',
                    width: '100px',
                    fontWeight: '600',
                  }}
                >
                  Subject
                </Text>
                <Text style={{ ...general, alignSelf: 'flex-start', width: '300px' }}>
                  : Cogniable Service Invoice for{' '}
                  {
                    monthNames[
                      moment(invoice.issueDate)
                        .subtract(1, 'M')
                        .format('MM') - 1
                    ]
                  }{' '}
                  {new Date(invoice.issueDate).getFullYear()}
                </Text>
              </View>
              <View style={{ ...rowStyle, backgroundColor: '#fafafa' }}>
                <Text
                  style={{
                    ...qtyCol,
                    width: '30px',
                    alignSelf: 'flex-start',
                    borderLeft: 'none',
                    fontWeight: '600',
                  }}
                >
                  #
                </Text>
                <Text style={{ ...serviceCol, fontWeight: '600' }}>Service</Text>
                <View style={{ ...qtyCol, fontWeight: '600' }}>
                  <Text style={rightText}>Quantity</Text>
                </View>
                <View style={{ ...qtyCol, fontWeight: '600' }}>
                  <Text style={rightText}>Rate</Text>
                </View>
                <View style={{ ...qtyCol, fontWeight: '600', width: '24%' }}>
                  <Text style={rightText}>Amount</Text>
                </View>
              </View>
              {invoice.invoiceFee.edges.map((item, index) => {
                const tempTotal = Number(item.node.quantity * item.node.rate).toFixed(2)
                return (
                  <View key={item.node.schoolServices.name} style={rowStyle}>
                    <View
                      style={{
                        ...qtyCol,
                        width: '30px',
                        borderLeft: 'none',
                      }}
                    >
                      <Text style={{ margin: 'auto' }}>{index + 1} </Text>
                    </View>
                    <Text style={serviceCol}>{item.node.schoolServices.name}</Text>
                    <View style={qtyCol}>
                      <Text style={rightText}>{item.node.quantity}</Text>
                    </View>
                    <View style={qtyCol}>
                      <Text style={rightText}>{item.node.rate}</Text>
                    </View>
                    <View style={{ ...qtyCol, width: '24%' }}>
                      <Text style={rightText}>{tempTotal}</Text>
                    </View>
                  </View>
                )
              })}
              <View
                style={{
                  ...rowStyle,
                  flexDirection: 'row-reverse',
                  backgroundColor: '#fafafa',
                }}
              >
                <Text
                  style={{
                    ...general,
                    alignSelf: 'flex-end',
                    textAlign: 'right',
                    minWidth: '98px',
                  }}
                >
                  {subTotal}
                </Text>
                <Text style={general}>Subtotal :</Text>
              </View>
              <View style={{ ...section, padding: '0', borderBottom: 'none' }}>
                <View style={{ width: '50%' }}>
                  <Text style={{ ...general, alignSelf: 'flex-start', width: '100%' }}>
                    {toWords.convert(total)}
                  </Text>
                </View>
                <View
                  style={{
                    width: '50%',
                    borderLeft: '1px solid black',
                  }}
                >
                  <View
                    style={{
                      ...flexSection,
                      flexDirection: 'row-reverse',
                    }}
                  >
                    <Text style={taxSection}>
                      {Number((subTotal / 100) * parseFloat(invoice.discount || 0)).toFixed(2)}
                    </Text>
                    <Text style={{ ...taxSection, fontWeight: '600' }}>Dicoun%) :</Text>
                  </View>
                  <View
                    style={{
                      ...flexSection,
                      flexDirection: 'row-reverse',
                    }}
                  >
                    <Text style={taxSection}>
                      {Number((subTotal / 100) * parseFloat(invoice.gst || 0)).toFixed(3)}
                    </Text>
                    <Text style={{ ...taxSection, fontWeight: '600' }}>GST :</Text>
                  </View>
                  <View
                    style={{
                      ...flexSection,
                      flexDirection: 'row-reverse',
                    }}
                  >
                    <Text style={taxSection}>
                      {Number((subTotal / 100) * parseFloat(invoice.sgst || 0)).toFixed(2)}
                    </Text>
                    <Text style={{ ...taxSection, fontWeight: '600' }}>SGST :</Text>
                  </View>
                  <View
                    style={{
                      ...flexSection,
                      flexDirection: 'row-reverse',
                    }}
                  >
                    <Text style={taxSection}>
                      {Number((subTotal / 100) * parseFloat(invoice.taxable || 0)).toFixed(2)}
                    </Text>
                    <Text style={{ ...taxSection, fontWeight: '600' }}>Taxes:</Text>
                  </View>
                  <View style={{ ...flexSection, flexDirection: 'row-reverse' }}>
                    <Text style={taxSection}>{currentCurrency}</Text>
                    <Text style={{ ...taxSection, fontWeight: '600' }}>Total :</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  )
}

export default Printable
