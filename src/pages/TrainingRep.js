import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import React, { useRef, useState, useEffect } from 'react'
import Webcam from 'react-webcam'
import { useSelector, useDispatch } from 'react-redux';
import { getPose, setPose, getPosePayload, getUser } from '../redux/Reducer';
import { TensorflowPointEnum, keypointConnections, poseList, classificationPhysicalEnum } from '../utils/data';
import { drawPoint, drawSegment, landmarksToEmbedding } from '../utils/function'
import { Typography, Grid, Container, Button, Dialog, DialogContent, CircularProgress } from '@mui/material';
import { saveRecordToMongoAtlas } from '../utils/mongoAtlas';
import { finishMusic, countMusic } from '../utils/music';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

let skeletonColor = 'rgb(255,255,255)'

function TrainingRep() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const user = useSelector(getUser);
  const currentPose = useSelector(getPose);
  const currentPosePayload = useSelector(getPosePayload);
  const dispatch = useDispatch();
  const trainingTime = currentPosePayload.num;
  const upPassProbability = classificationPhysicalEnum[currentPose]['upProbability']
  const downPassProbability = classificationPhysicalEnum[currentPose]['downProbability']
  const upPoseClassNo = classificationPhysicalEnum[currentPose]['upClassNo']
  const downPoseClassNo = classificationPhysicalEnum[currentPose]['downClassNo']


  const [poseStatus, setPoseStatus] = useState(classificationPhysicalEnum[currentPose]['defaultStatus'])
  const [count, setCount] = useState(-1)
  const [downProbability, setDownProbability] = useState(0)
  const [upProbability, setUpProbability] = useState(0)
  const [pass, setPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [detector, setDetector] = useState(null);
  const [poseClassifier, setPoseClassifier] = useState(null);
  const countAudio = new Audio(countMusic)
  const finishAudio = new Audio(finishMusic)

  useEffect(() => {
    const defaultStatus = classificationPhysicalEnum[currentPose]['defaultStatus'];
    if (poseStatus === defaultStatus) {
      if (count >= 0)
        countAudio.play()
      setCount(count + 1)
    }
  }, [poseStatus])

  useEffect(() => {
    if (count >= trainingTime && !pass) {
      setPass(true)
      finishAudio.play()
    }
  }, [count])

  useEffect(() => {
    runMovenet()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      detectPose()
    }, 100)

    return (() => {
      clearInterval(interval)
    })
  }, [poseStatus, detector, poseClassifier])

  const finishPose = async () => {
    let obj = { userId: user.userId, pose: currentPose, count: trainingTime, type: currentPosePayload.type }
    setLoading(true)
    saveRecordToMongoAtlas(obj).then(r => {
      setLoading(false)
      dispatch(setPose({}))
    });
  }

  const runMovenet = async () => {
    const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER };
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
    setDetector(detector);
    const poseClassifier = await tf.loadLayersModel('model2.json');
    setPoseClassifier(poseClassifier);
  }

  const detectPose = async () => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      try {
        let notDetected = 0
        const video = webcamRef.current.video
        const pose = await detector.estimatePoses(video)
        const ctx = canvasRef.current.getContext('2d')
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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
        const s = poseStatus;
        classification.array().then((data) => {

          const passPoseClassNo = s === 'Up' ? downPoseClassNo : upPoseClassNo;
          const passProbability = s === 'Up' ? downPassProbability : upPassProbability;
          const updatePoseStatus = s === 'Up' ? 'Down' : 'Up'

          const downProbability = data[0][downPoseClassNo]
          const upProbability = data[0][upPoseClassNo]
          setUpProbability(upProbability)
          setDownProbability(downProbability)

          console.log(data[0])


          const probability = data[0][passPoseClassNo]
          if (probability > passProbability) {
            setPoseStatus(updatePoseStatus);
            skeletonColor = 'rgb(0,255,0)'
          } else {
            skeletonColor = 'rgb(255,255,255)'
          }
        })

      } catch (err) {

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
            <Typography variant="h5">Count: {count}</Typography>
            <Typography variant="h5">Training Time: {trainingTime}</Typography>
            <Typography variant="h5">Status: {poseStatus}</Typography>
            {
              pass &&
              <Grid item xs={12} sx={{ justifyContent: 'center' }} container alignItems="center" spacing={2}>
                <Typography sx={{ fontSize: 100 }} color="success" display="inline">Passed</Typography>
                <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 100 }} color="success" />
              </Grid>
            }
            <Typography variant="h3">Proba: {upProbability} / {downProbability}</Typography>
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

export default TrainingRep