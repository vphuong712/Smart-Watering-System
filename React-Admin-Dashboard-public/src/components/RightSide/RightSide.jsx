import React from "react";
import "./RightSide.css";
import SwitchToggle from "../UI/SwitchToggle";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouteLoaderData } from "react-router-dom";


const RightSide = () => {

  const [isOn, setIsOn] = useState(false);
  const [predictMode, setPredictMode] = useState(false);

  const user = useRouteLoaderData('root');



  const clickHandle = () => {
      setIsOn(!isOn);
  }

  const predictHandle = () => {
    setPredictMode(!predictMode);
  }

  useEffect(() => {
    const postData = async () => {
      try {
        const response = await axios.post('http://192.168.1.58:5000/toggle',
        {
          isOn: isOn,
          user: user.firstName + ' ' + user.lastName
        },)
        if (response.status === 200) {
          console.log(response.data);
        }
      } catch (error) {
        throw error;
      }
    }
    postData();
  }, [isOn, user.firstName, user.lastName])

  useEffect(() => {
    if(predictMode) {
      const postData = async () => {
        try {
          const response = await axios.post('http://192.168.1.58:5000/sensor-data/auto', { predictMode: predictMode })
          if(response.status === 200) {
            alert(response.data);
          }
        } catch (error) {
          throw error
        }
      }
      postData();
    }
  }, [predictMode])
 
  return (
    <div className="RightSide">
      <div className="btn-wrap" >
          <div>
            <h3>Watering</h3>
            <SwitchToggle disabled={predictMode} click={clickHandle} />
          </div>
          <div>
              <h3>Predict Mode</h3>
              <SwitchToggle click={predictHandle} />
          </div>
      </div>

    </div>
  );
};

export default RightSide;
