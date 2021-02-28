/* eslint-disable prefer-template */
/* eslint-disable  react-hooks/rules-of-hooks */
/* eslint-disable no-array-constructor */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable radix */
/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Page, Text, View, Document, StyleSheet, Image, PDFViewer, Font } from '@react-pdf/renderer'
import { Typography, Row, Layout, Col, Tabs, Card, Table, Tag, Select, Button } from 'antd'
import moment from 'moment'
import { calculateAge } from '../../utilities'

const dateFormat = 'YYYY-MM-DD'
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
const page = {
  padding: '20px 15px',
}

function ReportPdf({
  textBoxObj,
  start,
  learnerDetails,
  goalsDetails,
  behaviorTemplates,
  goalsImages,
}) {
  return (
    <PDFViewer style={{ margin: '0 auto', width: '900px', height: '750px' }}>
      <Document>
        <Page size="A4" wrap={true} style={page} scale={1}>
          <View style={{ display: 'flex', textAlign: 'center', backgroundColor: '#ccffff' }}>
            <Text style={{ margin: 'auto' }}>Monthly Report</Text>
          </View>
          <View style={{ fontSize: '11px', padding: '15px 0' }}>
            <Text style={{ marginBottom: '5px' }}>
              Name: {learnerDetails?.firstname} {learnerDetails?.lastname}
            </Text>
            <Text style={{ marginBottom: '5px' }}>Date of Birth: {learnerDetails?.dob}</Text>
            <Text style={{ marginBottom: '5px' }}>
              Age: {learnerDetails?.dob && calculateAge(learnerDetails?.dob)}
            </Text>
            <Text style={{ marginBottom: '5px' }}>Location: {learnerDetails?.currentAddress}</Text>
            <Text style={{ marginBottom: '5px' }}>
              Month: {monthNames[moment(start).format('MM') - 1]} {moment(start).format('YYYY')}
            </Text>
          </View>
          <View style={{ display: 'flex', textAlign: 'center', backgroundColor: '#ccffff' }}>
            <Text style={{ margin: 'auto' }}>Progress Overview</Text>
          </View>
          <View style={{ fontSize: '11px', padding: '15px 0', color: 'red' }}>
            <Text>{textBoxObj.progressOverview}</Text>
            <View>
              {goalsImages.progressGraph && (
                <Image
                  src={goalsImages.progressGraph}
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    margin: '10px auto',
                  }}
                ></Image>
              )}
            </View>
          </View>

          <View
            style={{
              display: 'flex',
              textAlign: 'center',
              marginTop: '10px',
              backgroundColor: '#ccffff',
            }}
          >
            <Text style={{ margin: 'auto' }}>Goals</Text>
          </View>
          <View style={{ fontSize: '11px', padding: '15px 0', color: 'red' }}>
            <Text style={{ marginBottom: '5px' }}>{textBoxObj.goals}</Text>
          </View>
          <View style={{ fontSize: '11px' }}>
            <View>
              {goalsDetails &&
                goalsDetails.map((item, itemIndex) => (
                  <View>
                    <View style={{ padding: 5, backgroundColor: '#f9f9f9', margin: '5px 0' }}>
                      <Text style={{ margin: '5px 0 7px' }}>
                        Long Term Goals {itemIndex + 1}: {item.goal.goalName}
                      </Text>
                      <Text style={{ marginBottom: '5px' }}>
                        Status: {item.goal.goalStatus.status}, Initiated Date:{' '}
                        {moment(item.goal.dateInitialted).format(dateFormat)}, Mastered Date:{' '}
                        {item.dateMastered}
                      </Text>
                    </View>

                    {item.goal.shorttermgoalSet.edges.map((shortItem, shortItemIndex) => (
                      <View style={{ paddingLeft: 20, margin: '5px 0' }}>
                        <Text style={{ marginBottom: '5px' }}>
                          Short Term Goals {itemIndex + 1}.{shortItemIndex + 1} :{' '}
                          {shortItem.node.goalName}
                        </Text>
                        <Text style={{ marginBottom: '5px' }}>
                          Status: {shortItem.node.goalStatus.status}, Initiated Date:{' '}
                          {moment(shortItem.node.dateInitialted).format(dateFormat)}, Mastered Date:{' '}
                          {shortItem.node.masterDate}
                        </Text>
                        {shortItem.node.targetAllocateSet.edges.map(targetItem => {
                          return (
                            <View style={{ paddingLeft: 20 }}>
                              {targetItem.node && targetItem.node.masterDate && (
                                <>
                                  <Text style={{ marginBottom: '5px' }}>
                                    Target: {targetItem.node.targetAllcatedDetails?.targetName}
                                  </Text>
                                  <Text style={{ marginBottom: '5px' }}>
                                    Status: {targetItem.node.targetStatus?.statusName}, Initiated
                                    Date:{' '}
                                    {moment(
                                      targetItem.node.targetAllcatedDetails?.dateBaseline,
                                    ).format(dateFormat)}
                                    , Mastered Date:{' '}
                                    {targetItem.node.masterDate
                                      ? targetItem.node.masterDate
                                      : 'Null'}
                                  </Text>
                                  <View>
                                    {goalsImages[targetItem.node.id] && (
                                      <Image
                                        src={goalsImages[targetItem.node.id]}
                                        style={{
                                          width: '100%',
                                          alignSelf: 'center',
                                          margin: '10px auto',
                                        }}
                                      ></Image>
                                    )}
                                  </View>
                                </>
                              )}
                            </View>
                          )
                        })}
                      </View>
                    ))}
                  </View>
                ))}
            </View>
          </View>
          <View wrap={false}>
            <View
              style={{
                display: 'flex',
                textAlign: 'center',
                marginTop: '10px',
                backgroundColor: '#ccffff',
              }}
            >
              <Text style={{ margin: 'auto' }}>Behaviour Report</Text>
            </View>
            <View style={{ fontSize: '11px', padding: '10px 0', color: 'red' }}>
              <Text>{textBoxObj.behaviour}</Text>
            </View>
          </View>
          <View>
            {behaviorTemplates.map(templateItem => (
              <View>
                {goalsImages[templateItem.template.id] && (
                  <Image
                    src={goalsImages[templateItem.template.id]}
                    style={{
                      width: '100%',
                      alignSelf: 'center',
                      margin: '10px auto',
                    }}
                  ></Image>
                )}
              </View>
            ))}
          </View>
          <View wrap={false}>
            <View
              style={{
                display: 'flex',
                marginTop: '10px',
                textAlign: 'center',
                backgroundColor: '#ccffff',
              }}
            >
              <Text style={{ margin: 'auto' }}>Mand Report</Text>
            </View>
            <View style={{ fontSize: '11px', padding: '15px 0', color: 'red' }}>
              <Text style={{ marginBottom: '5px' }}>{textBoxObj.mand}</Text>
            </View>
          </View>
          <View>
            <View>
              {goalsImages.mandGraph && (
                <Image
                  src={goalsImages.mandGraph}
                  style={{
                    width: '100%',
                    alignSelf: 'center',
                    margin: '10px auto',
                  }}
                ></Image>
              )}
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  )
}

export default ReportPdf
