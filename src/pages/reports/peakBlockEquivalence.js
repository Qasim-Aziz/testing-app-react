/* eslint-disable */
import React, { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react'

export const PeakBlockEqui = forwardRef((props, ref) => {
  const { peakBlockData, peakBlockLoading } = props

  useEffect(() => {
    console.log(peakBlockData, peakBlockLoading, 'loading')

    if (peakBlockData) {
      const tempTable = []
      let tempDate = []
      // peakBlockData.map((item, index) => {
      //   const target = item.target?.targetAllcatedDetails?.targetName
      //   const classes = item.target?.classes.edges
      //   tempDate.push(item.date)
      //   console.log(target, classes)
      //   if (target) {
      //     let isOld = false
      //     let objIdx = -1
      //     for (let i = 0; i < tempTable.length; i += 1) {
      //       const obj = tempTable[i]
      //       if (obj.target === target) {
      //         isOld = true
      //         objIdx = i
      //         break
      //       }
      //     }
      //     if (!isOld) {
      //       tempTable.push({
      //         key: target,
      //         grandParent: true,
      //         target,
      //         children: [],
      //       })
      //       if (classes.length > 0) {
      //         for (let i = 0; i < classes.length; i += 1) {
      //           console.log(target, classes[i], 'i: ', i)
      //           let train = 0
      //           let test = 0
      //           classes[i].node.peakequivalancedatarecordingSet.edges?.map(item => {
      //             // console.log(item.node, 'nose')
      //             if (item.node.recType === 'TRAIN') {
      //               train += item.node.score
      //             } else {
      //               test += item.node.score
      //             }
      //           })
      //           console.log(train, test)
      //           tempTable[tempTable.length - 1].children.push({
      //             target: classes[i].node.name,
      //             key: `${target} ${classes[i].node.name}`,
      //             parent: true,
      //             children: [
      //               {
      //                 key: `${target} ${classes[i].node.name} TRAIN`,
      //                 target: 'TRAIN',
      //                 [item.date]: train,
      //               },
      //               {
      //                 key: `${target} ${classes[i].node.name} TRAIN`,
      //                 target: 'TEST',
      //                 [item.date]: test,
      //               },
      //             ],
      //           })
      //         }
      //       }
      //     }

      //     if (isOld) {
      //       for (let i = 0; i < classes.length; i += 1) {
      //         let train = 0
      //         let test = 0
      //         console.log(target, classes[i], 'i: ', i)
      //         classes[i].node.peakequivalancedatarecordingSet.edges?.map(item => {
      //           // console.log(item.node, 'nose')
      //           if (item.node.recType === 'TRAIN') {
      //             train += item.node.score
      //           } else {
      //             test += item.node.score
      //           }
      //         })
      //         console.log(train, test, 'trts')
      //         tempTable[objIdx].children[i].children[0] = {
      //           ...tempTable[objIdx].children[i].children[0],
      //           [item.date]: train,
      //         }
      //         tempTable[objIdx].children[i].children[1] = {
      //           ...tempTable[objIdx].children[i].children[0],
      //           [item.date]: test,
      //         }
      //       }
      //     }
      //   }
      // })
      console.log(tempTable, 'tempTable')
    }
  }, [peakBlockData])

  return <div>Under development</div>
})
