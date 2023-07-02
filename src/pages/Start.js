import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Grid, Typography, Button, MenuItem, Select, TextField } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux';
import { getPose, setPose } from '../redux/Reducer';
import { poseList, REP_POSE, HOLD_POSE } from '../utils/data';
import Training from './Training';
import TrainingRep from './TrainingRep';


function Start() {
  const currentPose = useSelector(getPose);
  const dispatch = useDispatch();
  const [selectedPose, setSelectedPose] = useState('Tree');
  const [poseNum, setPoseNum] = useState(30);

  const poseOnChange = (e) => {
    setSelectedPose(e.target.value)
    setPoseNum(poseList[e.target.value].defaultNum);
  }

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    if (!isNaN(inputValue)) {
      setPoseNum(Number(inputValue));
    }
  };

  const startTraining = (e) => {
    let obj = {pose:selectedPose, payload:{type:poseList[selectedPose].type, num:poseNum}}
    dispatch(setPose(obj));
  }

  const poseOptions = Object.entries(poseList).map(([key, value]) => (
    <MenuItem key={key} value={key} sx={{justifyContent:"center"}}>
      {value.name}
      <img src={value.image} alt={key} width="80" height="80" />
    </MenuItem>
  ));

  const typeEnumToString = (typeEnum) => {

    if(typeEnum === REP_POSE)
      return "Repetition"
    else if(typeEnum === HOLD_POSE)
      return "Holding"

    return "None"
  }

  if(currentPose){
    if(poseList[selectedPose].type === HOLD_POSE)
      return <Training/>
    else if(poseList[selectedPose].type === REP_POSE)
      return <TrainingRep/>
  }
  
  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="center" sx={{ mt: 5, backgroundColor: 'white', borderRadius: '30px', padding: '30px' }}>
        <Grid item xs={12} sx={{ textAlign: 'center', mb: 4 }}>
          <Select value={selectedPose} onChange={poseOnChange} sx={{ width: "400px" }}> 
            {poseOptions}
          </Select>
        </Grid>

        <Grid container item xs={12} sx={{ textAlign: 'center', mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Description
            </Typography>
            <Typography sx={{ mb: 2 }} >{poseList[selectedPose]?.description}</Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Benefit
            </Typography>
            <Typography sx={{ mb: 2 }}>{poseList[selectedPose]?.benefit}</Typography>
            <Typography variant="h6" sx={{ mb: 2 }} display="inline">Pose Type : {typeEnumToString(poseList[selectedPose]?.type)}</Typography>
          </Grid>
          <Grid item xs={12} lg={4}>
            <img height="100%" width="100%" src={poseList[selectedPose]?.image} />
          </Grid>
        </Grid>

        <Grid item xs={12} sx={{ textAlign: 'center', mb: 4 }}>
            <TextField
            label="Training Time"
            type="number"
            value={poseNum}
            onChange={handleInputChange}
            inputProps={{ min: 0, max: 100, step: 1 }}
          />
          <Button variant="contained" onClick={startTraining} className="btn">
            Start Pose
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Start