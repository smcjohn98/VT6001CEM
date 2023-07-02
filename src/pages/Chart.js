import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { getUser } from '../redux/Reducer';
import { Typography, Grid, Container, Button, Dialog, DialogContent, CircularProgress, Switch } from '@mui/material';
import { DAY_AGGREGATION, MONTH_AGGREGATION, getAggregationRecord } from '../utils/mongoAtlas';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts'
import { poseList } from '../utils/data';

function Chart() {
  const user = useSelector(getUser)
  const [trainingRecord, setTrainingRecord] = useState([]);
  const [poseKeyList, setPoseKeyList] = useState({});
  const [loading, setLoading] = useState(true);
  const [aggregationByDay, setAggregationByDay] = useState(true);

  const stringToColor = (string) => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  }

  const handleChange = (event) => {
    setAggregationByDay(event.target.checked);
  };

  const fetchData = () => {
    setLoading(true)
    getAggregationRecord(user.userId, aggregationByDay ? DAY_AGGREGATION : MONTH_AGGREGATION).then(r => {
      let keyList = {}
      const normalizeData = r.reduce((acc, { _id, count }) => {
        const { date, pose } = _id;
        if (!keyList.hasOwnProperty(pose))
          keyList[pose] = 1
        if (!acc[date]) {
          acc[date] = {};
        }
        acc[date][pose] = count;
        return acc;
      }, {});

      let data = []
      Object.keys(normalizeData).map(k => {
        let tmp = normalizeData[k]
        data.push({ date: k, ...tmp })
      })

      data.sort((a, b) => new Date(a.date) - new Date(b.date));

      console.log(data)
      setTrainingRecord(data)
      setPoseKeyList(keyList)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchData()
  }, [aggregationByDay])

  return (
    <Container maxWidth="lg">
      <Grid container justifyContent="center" sx={{ mt: 5, backgroundColor: 'white', borderRadius: '30px', padding: '30px' }}>
        <Grid item xs={12} sx={{ textAlign: 'center', mb: 4 }}>
          Aggregation By Day
          <Switch
            checked={aggregationByDay}
            onChange={handleChange}
            name="aggregationByDay"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sx={{ textAlign: 'center', mb: 4 }}>
          {
            loading ?
              <CircularProgress />
              :
              <ResponsiveContainer width="100%" height={600} >
                <BarChart data={trainingRecord}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {Object.keys(poseKeyList).map((pose) => (
                    <Bar key={pose} dataKey={`${pose}`} name={poseList[pose].name} fill={poseList[pose].chartColor} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
          }
        </Grid>
      </Grid>
    </Container>

  )

}

export default Chart

/*
{Object.keys(poseKeyList).map((pose) => (
                    <Bar key={pose} dataKey={`${pose}`} name={pose}  />
                  ))}
*/