import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import React, { useRef, useState, useEffect } from 'react'
import Webcam from 'react-webcam'
import { useSelector, useDispatch } from 'react-redux';
import { getPose, setPose, getPosePayload, getUser } from '../redux/Reducer';
import { TensorflowPointEnum, keypointConnections, classificationEnum, poseList } from '../utils/data';
import { drawPoint, drawSegment, landmarksToEmbedding } from '../utils/function'
import { Typography, Grid, Container, Button, Dialog, DialogContent, CircularProgress } from '@mui/material';
import { saveRecordToMongoAtlas } from '../utils/mongoAtlas';
import { finishMusic, countMusic } from '../utils/music'; 
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

let skeletonColor = 'rgb(255,255,255)'
let flag = false

function Training() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const user = useSelector(getUser);
  const currentPose = useSelector(getPose);
  const currentPosePayload = useSelector(getPosePayload);
  const dispatch = useDispatch();
  const trainingTime = currentPosePayload.num;

  const [startingTime, setStartingTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [poseTime, setPoseTime] = useState(0)
  const [accumulatedTime, setAccumulatedTime] = useState(0)
  const [probability, setProbability] = useState(0)
  const [pass, setPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const countAudio = new Audio(countMusic)
  const finishAudio = new Audio(finishMusic)

  useEffect(() => {
    const timeDiff = (currentTime - startingTime) / 1000
    if (timeDiff >= accumulatedTime + 1) {
      setPoseTime(poseTime + 1)
      setAccumulatedTime(timeDiff)
      countAudio.play()
    }
  }, [currentTime])

  useEffect(() => {
    if (poseTime >= trainingTime && !pass) {
      setPass(true)
      finishAudio.play()
    }
  }, [poseTime])

  useEffect(() => {
    runMovenet()
  }, [])

  const finishPose = async () => {
    if(!user.userId){
      dispatch(setPose({}))
      return;
    }
    let obj = { userId: user.userId, pose: currentPose, count: trainingTime, type:currentPosePayload.type }
    setLoading(true)
    saveRecordToMongoAtlas(obj).then(r => {
      setLoading(false)
      dispatch(setPose({}))
    });
  }

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
    <>
      <Dialog open={loading}>
        <DialogContent>
          <Typography variant='h5'>Saving the training</Typography>
          <CircularProgress />
        </DialogContent>
      </Dialog>
      <Container maxWidth="lg">
        <Grid container justifyContent="center" sx={{ mt: 5, backgroundColor: 'white', borderRadius: '30px', padding: '30px' }}>
          <Grid item xs={12} sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h5">Pose Time: {poseTime} s</Typography>
            <Typography variant="h5">Training Time: {trainingTime} s</Typography>
            {
              pass &&
              <Grid item xs={12} sx={{ justifyContent: 'center' }} container alignItems="center" spacing={2}>
                <Typography sx={{ fontSize: 100 }} color="success" display="inline">Passed</Typography>
                <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 100 }} color="success" />
              </Grid>
            }
            <Typography variant="h3">Correctness: {Math.round(probability * 10000) / 100 } %</Typography>
          </Grid>
          <Grid container item xs={12} sx={{ textAlign: 'center', mb: 4 }}>
            <Grid item xs={12} lg={6} position="relative">
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
            <Grid item xs={12} lg={6}>
              <img width="100%" src={poseList[currentPose].image} />
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center', mb: 4 }}>
            {!pass ?
              <Button variant="contained" onClick={(e) => { dispatch(setPose({})) }} className='btn-error' >
                Stop Pose
              </Button> :
              <Button variant="contained" onClick={finishPose} className='btn-pass' >
                Finish
              </Button>
            }

          </Grid>
        </Grid>
      </Container>
    </>

  )

}

export default Training