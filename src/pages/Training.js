import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import React, { useRef, useState, useEffect } from 'react'
import Webcam from 'react-webcam'
import { useSelector, useDispatch } from 'react-redux';
import { getPose, setPose, getPosePayload } from '../redux/Reducer';
import { TensorflowPointEnum, keypointConnections, classificationEnum, poseList } from '../utils/data';
import { drawPoint, drawSegment, landmarksToEmbedding } from '../utils/function'
import { Typography, Grid, Container, Button } from '@mui/material';



let skeletonColor = 'rgb(255,255,255)'
let flag = false

function Training() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const currentPose = useSelector(getPose);
  const currentPosePayload = useSelector(getPosePayload);
  const dispatch = useDispatch();
  const trainingTime = currentPosePayload.num;

  const [startingTime, setStartingTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [poseTime, setPoseTime] = useState(0)
  const [accumulatedTime, setAccumulatedTime] = useState(0)
  const [probability, setProbability] = useState(0)

  useEffect(() => {
    const timeDiff = (currentTime - startingTime) / 1000
    if(timeDiff >= accumulatedTime + 1){
      setPoseTime(poseTime+1)
      setAccumulatedTime(timeDiff)
      if(poseTime >= trainingTime){
        
      }
    }
  }, [currentTime])

  useEffect(() => {
    runMovenet()
  }, [])

  const runMovenet = async () => {
    const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER };
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
    const poseClassifier = await tf.loadLayersModel('model.json')
    setInterval(() => {
      detectPose(detector, poseClassifier)
    }, 100)
  }

  const detectPose = async (detector, poseClassifier) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      let notDetected = 0
      const video = webcamRef.current.video
      const pose = await detector.estimatePoses(video)
      const ctx = canvasRef.current.getContext('2d')
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      try {
        const keyTensorflowPointEnum = pose[0].keypoints
        let input = keyTensorflowPointEnum.map((keypoint) => {
          if (keypoint.score > 0.4) {
            if (!(keypoint.name === 'left_eye' || keypoint.name === 'right_eye')) {
              drawPoint(ctx, keypoint.x, keypoint.y, 8, 'rgb(255,255,255)')
              let connections = keypointConnections[keypoint.name]
              try {
                connections.forEach((connection) => {
                  let conName = connection.toUpperCase()
                  drawSegment(ctx, [keypoint.x, keypoint.y],
                    [keyTensorflowPointEnum[TensorflowPointEnum[conName]].x,
                    keyTensorflowPointEnum[TensorflowPointEnum[conName]].y]
                    , skeletonColor)
                })
              } catch (err) {

              }
            }
          } else {
            notDetected += 1
          }
          return [keypoint.x, keypoint.y]
        })
        if (notDetected > 4) {
          skeletonColor = 'rgb(255,255,255)'
          return
        }
        const processedInput = landmarksToEmbedding(input)
        const classification = poseClassifier.predict(processedInput)
        classification.array().then((data) => {
          const classNo = classificationEnum[currentPose]
          const probability = data[0][classNo]
          setProbability(probability)
          if (probability > 0.93) {
            if (!flag) {
              setStartingTime(new Date(Date()).getTime())
              flag = true
            }
            setCurrentTime(new Date(Date()).getTime())
            skeletonColor = 'rgb(0,255,0)'
          } else {
            flag = false
            setAccumulatedTime(0)
            skeletonColor = 'rgb(255,255,255)'
          }
        })
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="center" sx={{ mt: 5, backgroundColor: 'white', borderRadius: '30px', padding: '30px' }}>
        <Grid item xs={12} sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h5">Pose Time: {poseTime} s</Typography>
          <Typography variant="h5">Training Time: {trainingTime} s</Typography>
          <Typography variant="h3">Proba: {probability}</Typography>
        </Grid>
        <Grid container item xs={12} sx={{ textAlign: 'center', mb: 4 }}>
          <Grid item xs={6} position="relative">
            <Webcam
              width='640px'
              height='480px'
              id="webcam"
              ref={webcamRef}
              onUserMediaError={(error) => { console.log(error); }}
            />
            <canvas
              ref={canvasRef}
              id="my-canvas"
              width='640px'
              height='480px'
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                zIndex: 1
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <img width="100%" src={poseList[currentPose].image} />
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: 'center', mb: 4 }}>
          <Button variant="contained" onClick={(e) => { dispatch(setPose({})) }} className="btn">
            Stop Pose
          </Button>
        </Grid>
      </Grid>
    </Container>

  )

}

export default Training