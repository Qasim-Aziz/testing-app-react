/* eslint-disable consistent-return */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-template */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-array-constructor */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable radix */
/* eslint-disable array-callback-return */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react'
import { Page, Text, View, Document, Image, Font, PDFViewer } from '@react-pdf/renderer'
import { ToWords } from 'to-words'
import { useQuery } from 'react-apollo'
import moment from 'moment'
import { notification } from 'antd'
import LoadingComponent from 'components/VBMappReport/LoadingComponent'
import logo from 'images/CogniableLogo.jpeg'
import s1 from 'assets/fonts/SourceSerifPro/SourceSerifPro-Regular.ttf'
import s2 from 'assets/fonts/SourceSerifPro/SourceSerifPro-SemiBold.ttf'
import { GET_SCHOOL_DETAILS, GET_INVOICE } from './query'

Font.register({
  family: 'Source Serif Pro',
  fonts: [
    { src: s1, fontStyle: 'normal', fontWeight: 'light' },
    { src: s2, fontStyle: 'normal', fontWeight: 'bold' },
  ],
})

// font-family: , serif;
// <link rel="preconnect" href="https://fonts.gstatic.com">
// <link href="https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@300;400;600;700&display=swap" rel="stylesheet"></link>

const general = {
  fontSize: '12px',
  fontFamily: 'Source Serif Pro',
  fontWeight: 'normal',
  padding: '5px 8px',
  color: 'black',
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
  color: 'black',
  flexDirection: 'row',
  padding: '5px 8px',
  textAlign: 'left',
}
const dateSection = {
  width: '40%',
  color: 'black',
  fontSize: 12,
  alignSelf: 'flex-start',
  textAlign: 'left',
  fontWeight: '500',
}

const rowStyle = {
  borderBottom: '1px solid black',
  display: 'flex',
  float: 'left',
  color: 'black',
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
  width: '40%',
  maxWidth: '50%',
}

function getTotal(subTotal, discount = 0, cgst = 0, sgst = 0, tax = 0) {
  return Number(
    subTotal -
      (subTotal / 100) * parseFloat(discount || 0) +
      (subTotal / 100) * parseFloat(cgst || 0) +
      (subTotal / 100) * parseFloat(sgst || 0) +
      (subTotal / 100) * parseFloat(tax || 0),
  ).toFixed(2)
}

function PrintableInvoice({ invoiceId }) {
  const [invoice, setInvoice] = useState(null)
  const [currencyName, setCurrencyName] = useState(null)
  const [subTotal, setSubtotal] = useState(0)
  const [isValidImage, setIsValidImage] = useState(false)

  const currentCurrencyName = 'INR'
  const { data: detailsData, loading, error } = useQuery(GET_SCHOOL_DETAILS)

  const { data: invoiceData, loading: isInvoiceDataLoading, error: invoiceDataErrors } = useQuery(
    GET_INVOICE,
    {
      variables: {
        id: invoiceId,
      },
    },
  )

  console.log(invoiceData, 'invoiceData')
  useEffect(() => {
    if (invoiceData) {
      setInvoice(invoiceData?.invoiceDetail)
      let tempTotal = 0
      invoiceData?.invoiceDetail.invoiceFee.edges.forEach(item => {
        const am = Number(Number(item.node.quantity * item.node.rate).toFixed(3))
        tempTotal += am
        return null
      })
      const check = imageExists()
      setIsValidImage(check)
      setSubtotal(tempTotal)
      setCurrencyName('INR')
    }
  }, [invoiceData])

  const toWords = new ToWords({
    localeCode: currentCurrencyName === 'INR' ? 'en-IN' : 'en-US',
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
  if (error || invoiceDataErrors || !invoiceData || !detailsData)
    return (
      <div style={{ marginTop: 80, marginLeft: 60, fontWeight: 700, fontSize: 18 }}>
        Opps, something went wrong
      </div>
    )

  const total = getTotal(subTotal, invoice.discount, invoice.cgst, invoice.sgst, invoice.tax)

  function imageExists() {
    const http = new XMLHttpRequest()
    const temp = invoiceData.invoiceDetail.customer?.school?.logo
      ? invoiceData.invoiceDetail.customer?.school?.logo
      : 're'
    http.open('HEAD', temp, false)
    http.send()

    return http.status !== 404
  }

  const {
    schoolName,
    address,
    ifscCode,
    bankName,
    accountHolderName,
    bankAccountNo,
    country,
    upi,
    gpay,
    paytm,
  } = detailsData.schoolDetail

  return (
    <div style={{ display: 'flex' }}>
      <PDFViewer style={{ margin: 'auto', width: '90%', height: '1200px' }}>
        <Document>
          <Page
            size="A4"
            style={{
              flexDirection: 'row',
              backgroundColor: '#fff',
              padding: 10,
            }}
            wrap={false}
            scale={5}
          >
            <View style={{ width: '100%', height: '100%', margin: 'auto' }}>
              <View style={sectionMain}>
                <View style={{ ...section, height: '100px' }}>
                  <View style={{ width: '30%', alignSelf: 'center' }}>
                    <Image src={logo} style={{ width: '100%', alignSelf: 'center' }} />
                  </View>
                  <View
                    style={{
                      textAlign: 'center',
                      width: '250px',
                      alignSelf: 'center',
                      marginLeft: '20px',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        marginBottom: '4px',
                        width: '100%',
                        alignSelf: 'flex-start',
                        textAlign: 'left',
                      }}
                    >
                      {schoolName}
                    </Text>
                    <Text
                      style={{
                        marginBottom: '4px',
                        fontSize: 12,
                        width: '100%',
                        alignSelf: 'flex-start',
                        textAlign: 'left',
                      }}
                    >
                      {address}
                    </Text>
                    <Text
                      style={{
                        marginBottom: '4px',
                        fontSize: 12,
                        width: '100%',
                        alignSelf: 'flex-start',
                        textAlign: 'left',
                      }}
                    >
                      GSTIN 34453ZXBSNBSD
                    </Text>
                  </View>
                  <View
                    style={{
                      textAlign: 'center',
                      width: '200px',
                      alignSelf: 'center',
                    }}
                  >
                    <Text>{invoice.invoiceNo}</Text>
                  </View>
                </View>
                <View style={{ ...section, height: '120px', padding: '0' }}>
                  <View style={{ width: '50%', height: '100%', borderRight: '1px solid black' }}>
                    <View style={{ ...flexSection, paddingBottom: '0' }}>
                      <Text style={{ ...dateSection, fontWeight: 'bold' }}> #INV</Text>
                      <Text style={{ ...dateSection, width: '60%' }}> : {invoice.invoiceNo}</Text>
                    </View>
                    <View style={{ ...flexSection, paddingBottom: '0' }}>
                      <Text style={{ ...dateSection, fontWeight: 'bold' }}> Issue Date</Text>
                      <Text style={{ ...dateSection, width: '60%' }}> : {invoice.issueDate}</Text>
                    </View>
                    <View style={{ ...flexSection, paddingBottom: '0' }}>
                      <Text style={{ ...dateSection, fontWeight: 'bold' }}> Due Date</Text>
                      <Text style={{ ...dateSection, width: '60%' }}> : {invoice.dueDate}</Text>
                    </View>
                  </View>
                  <View style={{ width: '50%' }}>
                    <View style={{ ...flexSection, paddingBottom: '0' }}>
                      <Text style={{ ...dateSection, fontWeight: 'bold' }}> Place of supply</Text>
                      <Text style={{ ...dateSection, width: '60%' }}> : {invoice.address}</Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    borderBottom: '1px solid black',
                    height: '75px',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Text
                      style={{
                        ...general,
                        alignSelf: 'flex-start',
                        width: '100px',
                        fontWeight: 'bold',
                      }}
                    >
                      Bill To
                    </Text>
                    <Text style={{ ...general, alignSelf: 'flex-start', width: '300px' }}>
                      : {invoice.customer?.firstname} {invoice.customer?.lastname},{' '}
                      {invoice.address}
                    </Text>
                  </View>
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Text
                      style={{
                        ...general,
                        alignSelf: 'flex-start',
                        width: '100px',
                        fontWeight: 'bold',
                      }}
                    >
                      Email
                    </Text>
                    <Text style={{ ...general, alignSelf: 'flex-start', width: '300px' }}>
                      : {invoice.email}
                    </Text>
                  </View>
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
                      fontWeight: 'bold',
                    }}
                  >
                    Subject
                  </Text>
                  <Text style={{ ...general, alignSelf: 'flex-start', width: '300px' }}>
                    : Cogniable Service Invoice for {moment(invoice.issueDate).format('MMM')}{' '}
                    {moment(invoice.issueDate).format('YYYY')}
                  </Text>
                </View>
                <View style={{ ...rowStyle, backgroundColor: '#fafafa' }}>
                  <Text
                    style={{
                      ...qtyCol,
                      width: '30px',
                      alignSelf: 'flex-start',
                      borderLeft: 'none',
                    }}
                  >
                    #
                  </Text>
                  <Text style={{ ...serviceCol, fontWeight: 'bold' }}>Service</Text>
                  <View style={{ ...qtyCol, fontWeight: 'bold' }}>
                    <Text style={rightText}>Quantity</Text>
                  </View>
                  <View style={{ ...qtyCol, fontWeight: 'bold' }}>
                    <Text style={rightText}>Rate ({currentCurrencyName})</Text>
                  </View>
                  <View style={{ ...qtyCol, fontWeight: 'bold', width: '24%' }}>
                    <Text style={rightText}>Amount ({currentCurrencyName})</Text>
                  </View>
                </View>
                {invoice.invoiceFee.edges.map((item, index) => {
                  const tempTotal = Number(item.node.quantity * item.node.rate).toFixed(2)
                  return (
                    <View key={Math.random()} style={rowStyle}>
                      <View
                        style={{
                          ...qtyCol,
                          width: '30px',
                          borderLeft: 'none',
                        }}
                      >
                        <Text style={{ margin: 'auto' }}>{index + 1}. </Text>
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
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <Text style={{ ...general }}>Subtotal :</Text>
                  <View style={{ ...qtyCol, width: '18.8%', borderLeft: 'none' }}>
                    <Text style={rightText}>
                      {subTotal} {currentCurrencyName}
                    </Text>
                  </View>
                </View>
                <View style={{ ...section, padding: '0', height: '260px', borderBottom: 'none' }}>
                  <View style={{ width: '50%' }}>
                    <Text style={{ ...general, alignSelf: 'flex-start', width: '100%' }}>
                      {toWords.convert(total)}
                    </Text>
                    <View
                      style={{
                        ...general,
                        display: 'flex',
                        flexDirection: 'row',
                        alignSelf: 'flex-start',
                        width: '100%',
                      }}
                    >
                      <Text style={{ fontWeight: 'bold' }}>Razor Pay: </Text>
                      <Text style={{ color: 'blue' }}>{invoice.paymentLink}</Text>
                    </View>

                    <View
                      style={{
                        ...general,
                        paddingBottom: '2px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignSelf: 'flex-start',
                        width: '100%',
                      }}
                    >
                      <Text style={{ fontWeight: 'bold' }}>Bank A/C No: </Text>
                      <Text>{bankAccountNo}</Text>
                    </View>
                    <View
                      style={{
                        ...general,
                        padding: '2px 8px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignSelf: 'flex-start',
                        width: '100%',
                      }}
                    >
                      <Text style={{ fontWeight: 'bold' }}>IFSC Code: </Text>
                      <Text>{ifscCode}</Text>
                    </View>
                    <View
                      style={{
                        ...general,
                        display: 'flex',
                        padding: '2px 8px',
                        flexDirection: 'row',
                        alignSelf: 'flex-start',
                        width: '100%',
                      }}
                    >
                      <Text style={{ fontWeight: 'bold' }}>Branch: </Text>
                      <Text>{bankName}</Text>
                    </View>
                    <View
                      style={{
                        ...general,
                        display: 'flex',
                        padding: '2px 8px',
                        flexDirection: 'row',
                        alignSelf: 'flex-start',
                        width: '100%',
                      }}
                    >
                      <Text style={{ fontWeight: 'bold' }}>A/C Holder Name: </Text>
                      <Text style={{ width: 170 }}>{accountHolderName}</Text>
                    </View>
                    {upi ? (
                      <View
                        style={{
                          ...general,
                          display: 'flex',
                          padding: '6px 8px 2px',
                          flexDirection: 'row',
                          alignSelf: 'flex-start',
                          width: '100%',
                        }}
                      >
                        <Text style={{ fontWeight: 'bold' }}>UPI: </Text>
                        <Text>{upi}</Text>
                      </View>
                    ) : null}
                    {gpay ? (
                      <View
                        style={{
                          ...general,
                          display: 'flex',
                          padding: '2px 8px',
                          flexDirection: 'row',
                          alignSelf: 'flex-start',
                          width: '100%',
                        }}
                      >
                        <Text style={{ fontWeight: 'bold' }}>Google Pay: </Text>
                        <Text>{gpay}</Text>
                      </View>
                    ) : null}
                    {paytm ? (
                      <View
                        style={{
                          ...general,
                          display: 'flex',
                          padding: '2px 8px 6px',
                          flexDirection: 'row',
                          alignSelf: 'flex-start',
                          width: '100%',
                        }}
                      >
                        <Text style={{ fontWeight: 'bold' }}>Paytm: </Text>
                        <Text>{paytm}</Text>
                      </View>
                    ) : null}
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
                      <View style={taxSection}>
                        <Text style={{ ...rightText }}>
                          -{Number((subTotal / 100) * parseFloat(invoice.discount || 0)).toFixed(2)}{' '}
                          {currentCurrencyName}
                        </Text>
                      </View>
                      <View style={taxSection}>
                        <Text style={{ ...rightText }}>Discount ({invoice.discount || 0}%) :</Text>
                      </View>
                    </View>
                    <View style={{ ...flexSection, flexDirection: 'row-reverse' }}>
                      <View style={taxSection}>
                        <Text style={{ ...rightText }}>
                          {Number((subTotal / 100) * parseFloat(invoice.cgst || 0)).toFixed(2)}{' '}
                          {currentCurrencyName}
                        </Text>
                      </View>
                      <View style={taxSection}>
                        <Text style={{ ...rightText }}>CGST ({invoice.cgst || 0}%) :</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        ...flexSection,
                        flexDirection: 'row-reverse',
                      }}
                    >
                      <View style={taxSection}>
                        <Text style={{ ...rightText }}>
                          {Number((subTotal / 100) * parseFloat(invoice.sgst || 0)).toFixed(2)}{' '}
                          {currentCurrencyName}
                        </Text>
                      </View>
                      <View style={taxSection}>
                        <Text style={{ ...rightText }}>SGST ({invoice.sgst || 0}%) :</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        ...flexSection,
                        flexDirection: 'row-reverse',
                      }}
                    >
                      <View style={taxSection}>
                        <Text style={{ ...rightText }}>
                          {Number((subTotal / 100) * parseFloat(invoice.tax || 0)).toFixed(2)}{' '}
                          {currentCurrencyName}
                        </Text>
                      </View>
                      <View style={taxSection}>
                        <Text style={{ ...rightText }}>Taxes ({invoice.tax || 0}%) :</Text>
                      </View>
                    </View>
                    <View style={{ ...flexSection, flexDirection: 'row-reverse' }}>
                      <View style={taxSection}>
                        <Text style={{ ...rightText }}>
                          {total} {currentCurrencyName}
                        </Text>
                      </View>
                      <View style={taxSection}>
                        <Text style={{ ...rightText }}>Total :</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </div>
  )
}

export default PrintableInvoice
