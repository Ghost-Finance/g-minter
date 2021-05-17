import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box'
import { makeStyles, Theme } from '@material-ui/core'

const useStyles = makeStyles((theme: Theme) => {
  return {
    root: {
      margin: 'auto',
      padding: '10px'
    },
    svg: {
      display: 'block',
      maxWidth: '100%'
    },
    svgCircle: {
      fill: 'none'
    },
    svgCircleText: {
      textAnchor: 'middle',
      fill: '#fff',
      fontWeight: 'bold',
      fontSize: '1.2rem'
    },
    text: {
      color: theme.palette.secondary.dark,
      textTransform: 'uppercase'
    }
  }
})

interface Props {
  size: number
  progress: number
  strokeWidth: number
  circleOneStroke: string
  circleTwoStroke: string
  errorColorStroke: string
}

const CircularProgressBar = (props: Props) => {
  const classes = useStyles()
  const [offset, setOffset] = useState(0)
  const circleRef = useRef<SVGCircleElement>(null)
  const {
    size,
    progress,
    strokeWidth,
    circleOneStroke,
    circleTwoStroke,
    errorColorStroke
  } = props
  const [colorStroke, setColorStroke] = useState(circleTwoStroke)

  const center = size / 2
  const radius = size / 2 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius

  useEffect(() => {
    const progressOffset = ((900 - progress) / 900) * circumference
    const color = progress < 0 ? errorColorStroke : circleTwoStroke

    setOffset(progressOffset)
    setColorStroke(color)
  }, [setOffset, setColorStroke, progress, colorStroke, circumference, offset])

  const SVGCircleProgress = () => (
    <svg className={classes.svg} width={size} height={size}>
      <circle
        className={classes.svgCircle}
        stroke={circleOneStroke}
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={strokeWidth}
      />
      <circle
        className={classes.svgCircle}
        ref={circleRef}
        stroke={colorStroke}
        cx={center}
        cy={center}
        r={radius}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
      <text x={`${center}`} y={`${center}`} className={classes.svgCircleText}>
        {`${Math.round(progress)}%`}
      </text>
    </svg>
  )

  return (
    <>
      <Box
        position="relative"
        display="flex"
        alignSelf="center"
        className={classes.root}
      >
        <SVGCircleProgress />
      </Box>
      <Box
        component="div"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        className={classes.text}
      >
        <span>C-Ratio</span>
        <span>of 900%</span>
      </Box>
    </>
  )
}

CircularProgressBar.protoTypes = {
  size: PropTypes.number,
  progress: PropTypes.number,
  strokeWidth: PropTypes.number,
  circleOneStroke: PropTypes.string,
  circleTwoStroke: PropTypes.string,
  errorColorStroke: PropTypes.string
}

export default CircularProgressBar
