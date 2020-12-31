import React, { useState, useEffect } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useMutation } from 'react-apollo'
import { GET_TASK_QUESTIONS, GET_TASK_REPORT } from './query'
import TaskQuartionForm from './TaskQuartionForm'
import { leftDivStyle, rightDivStyle, assessmentCompletedBlockStyle, defaultDivStyle, leftListBoxStyle, recordResponseButtonStyle } from './customStyle'

export default ({ group, masterId }) => {
  const [selectedQ, setSelectedQ] = useState()
  const [questions, setQuestions] = useState([])
  const [reportRe, setReportRe] = useState(false)

  const [getReport, { data: reportData, error: reportError, loading: reportLoading }] = useMutation(
    GET_TASK_REPORT,
    {
      variables: {
        groupId: group.id,
        masterId,
      },
    },
  )

  const [getQuestions, { data, error, loading }] = useMutation(GET_TASK_QUESTIONS, {
    skip: !group,
    variables: {
      studentId: localStorage.getItem('studentId'),
      masterId,
      group: group?.id,
    },
  })

  useEffect(() => {
    getReport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group])

  useEffect(() => {
    if (reportData && questions && !reportRe) {
      if (reportData.vbmappGetReport.records.length > 0 && questions) {
        const findLastNoAnswerdQ = questions.find(node => {
          const prevRecords = reportData.vbmappGetReport.records
          return node.questionNum === prevRecords[prevRecords.length - 1].questionNum + 1
        })
        if (findLastNoAnswerdQ) {
          setSelectedQ({
            question: findLastNoAnswerdQ,
            index: findLastNoAnswerdQ.questionNum - 1,
          })
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportData, questions])

  useEffect(() => {
    if (reportData && reportRe) {
      setReportRe(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportData])

  useEffect(() => {
    getQuestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group])

  useEffect(() => {
    if (data) {
      const parseData = JSON.parse(data.vbmappGetQuestions.questions)
      setQuestions(parseData)
      setSelectedQ({ question: parseData[0], index: 0 })
    }
  }, [data])

  const getPrevious = () => {
    setSelectedQ(state => {
      console.log(state)
      if (state.index > 0) {
        const newIndex = state.index - 1
        console.log('new', questions[newIndex])
        return {
          question: questions[newIndex],
          index: newIndex,
        }
      }
      return state
    })
  }

  const getNext = () => {
    getReport()
    setSelectedQ(state => {
      if (state.index < group.noQuestion - 1) {
        const newIndex = state.index + 1
        return {
          question: questions[newIndex],
          index: newIndex,
        }
      }
      return state
    })
  }

  if (!group) {
    return <div>Please select a group first</div>
  }

  if (error || reportError) {
    return <h4 style={{ color: 'red' }}>Opps their are something wrong</h4>
  }

  if (loading || !selectedQ) {
    return <h4>Loading...</h4>
  }

  return (
    <div
      style={defaultDivStyle}
    >
      {/* Action bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ textTransform: 'uppercase' }}>
          {group?.groupName} . Level {selectedQ.question?.level}
          <br />
          <hr />
          Question {selectedQ.question.questionNum} of {group?.noQuestion}
        </span>
        <span style={{ display: 'flex', flexDirection: 'row', marginTop: 15 }}>
          {selectedQ.question.questionNum !== 1 && (
            <Button
              style={{ cursor: 'pointer', marginLeft: 10, marginRight: 10 }}
              onClick={() => getPrevious()}
              type="link"
            >
              <LeftOutlined style={{ fontSize: 22 }} />
            </Button>
          )}

          {selectedQ.question.questionNum !== group.noQuestion && (
            <Button
              style={{ cursor: 'pointer', marginLeft: 10, marginRight: 10 }}
              onClick={() => getNext()}
              type="link"
            >
              <RightOutlined style={{ fontSize: 22 }} />
            </Button>
          )}
        </span>
      </div>

      {/* Quastion View */}
      <div>
        {selectedQ && (
          <>
            <p style={{ fontSize: 18, textAlign: 'justify', fontWeight: '700', marginTop: 15 }}>
              Task: {selectedQ.question.objective}
            </p>
            {selectedQ && (
              <TaskQuartionForm
                currentQuestion={selectedQ.question}
                masterId={masterId}
                group={group.id}
                questionNo={selectedQ.question.questionNum}
                prevRecord={reportData?.vbmappGetReport.records.filter(({ questionNum }) => {
                  return questionNum === selectedQ.question.questionNum
                })}
                refatch={getReport}
                reportLoading={reportLoading}
                setReportRe={setReportRe}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
