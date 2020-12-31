/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-useless-concat */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable no-var */
/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable camelcase */
/* eslint-disable prefer-const */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable prefer-template */
/* eslint-disable no-shadow */
/* eslint-disable react/react-in-jsx-scope */

import React from 'react'
import { ResponsiveBar } from '@nivo/bar'
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const data = [
    {
        "country": "AD",
        "hot dog": 68,
        "hot dogColor": "hsl(281, 70%, 50%)",
        "burger": 191,
        "burgerColor": "hsl(332, 70%, 50%)",
        "sandwich": 66,
        "sandwichColor": "hsl(140, 70%, 50%)",
        "kebab": 141,
        "kebabColor": "hsl(72, 70%, 50%)",
        "fries": 107,
        "friesColor": "hsl(48, 70%, 50%)",
        "donut": 150,
        "donutColor": "hsl(275, 70%, 50%)"
    },
    {
        "country": "AE",
        "hot dog": 169,
        "hot dogColor": "hsl(108, 70%, 50%)",
        "burger": 73,
        "burgerColor": "hsl(244, 70%, 50%)",
        "sandwich": 6,
        "sandwichColor": "hsl(323, 70%, 50%)",
        "kebab": 109,
        "kebabColor": "hsl(264, 70%, 50%)",
        "fries": 120,
        "friesColor": "hsl(175, 70%, 50%)",
        "donut": 47,
        "donutColor": "hsl(66, 70%, 50%)"
    },
    {
        "country": "AF",
        "hot dog": 19,
        "hot dogColor": "hsl(124, 70%, 50%)",
        "burger": 139,
        "burgerColor": "hsl(318, 70%, 50%)",
        "sandwich": 105,
        "sandwichColor": "hsl(278, 70%, 50%)",
        "kebab": 28,
        "kebabColor": "hsl(104, 70%, 50%)",
        "fries": 10,
        "friesColor": "hsl(315, 70%, 50%)",
        "donut": 8,
        "donutColor": "hsl(265, 70%, 50%)"
    },
    {
        "country": "AG",
        "hot dog": 171,
        "hot dogColor": "hsl(317, 70%, 50%)",
        "burger": 167,
        "burgerColor": "hsl(243, 70%, 50%)",
        "sandwich": 43,
        "sandwichColor": "hsl(277, 70%, 50%)",
        "kebab": 169,
        "kebabColor": "hsl(72, 70%, 50%)",
        "fries": 180,
        "friesColor": "hsl(148, 70%, 50%)",
        "donut": 64,
        "donutColor": "hsl(283, 70%, 50%)"
    },
    {
        "country": "AI",
        "hot dog": 85,
        "hot dogColor": "hsl(257, 70%, 50%)",
        "burger": 37,
        "burgerColor": "hsl(111, 70%, 50%)",
        "sandwich": 94,
        "sandwichColor": "hsl(246, 70%, 50%)",
        "kebab": 28,
        "kebabColor": "hsl(102, 70%, 50%)",
        "fries": 135,
        "friesColor": "hsl(1, 70%, 50%)",
        "donut": 77,
        "donutColor": "hsl(307, 70%, 50%)"
    },
    {
        "country": "AL",
        "hot dog": 171,
        "hot dogColor": "hsl(250, 70%, 50%)",
        "burger": 11,
        "burgerColor": "hsl(327, 70%, 50%)",
        "sandwich": 76,
        "sandwichColor": "hsl(208, 70%, 50%)",
        "kebab": 125,
        "kebabColor": "hsl(171, 70%, 50%)",
        "fries": 21,
        "friesColor": "hsl(232, 70%, 50%)",
        "donut": 120,
        "donutColor": "hsl(55, 70%, 50%)"
    },
    {
        "country": "AM",
        "hot dog": 70,
        "hot dogColor": "hsl(245, 70%, 50%)",
        "burger": 125,
        "burgerColor": "hsl(158, 70%, 50%)",
        "sandwich": 175,
        "sandwichColor": "hsl(12, 70%, 50%)",
        "kebab": 44,
        "kebabColor": "hsl(231, 70%, 50%)",
        "fries": 158,
        "friesColor": "hsl(258, 70%, 50%)",
        "donut": 173,
        "donutColor": "hsl(111, 70%, 50%)"
    }
]

const MyResponsiveBar = ({ data /* see data tab */ }) => (
    <ResponsiveBar
        data={data}
        keys={['hot dog', 'burger', 'sandwich', 'kebab', 'fries', 'donut']}
        indexBy="country"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: 'nivo' }}
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#38bcb2',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: '#eed312',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'fries'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'sandwich'
                },
                id: 'lines'
            }
        ]}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'country',
            legendPosition: 'middle',
            legendOffset: 32
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'food',
            legendPosition: 'middle',
            legendOffset: -40
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
    />
)

export default MyResponsiveBar