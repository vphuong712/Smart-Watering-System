import React from "react";
import "./Cards.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Card from "../Card/Card";
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import LandslideIcon from '@mui/icons-material/Landslide';


const Cards = () => {

  const fakeData = [{
    temperature: 0,
    humidity: 0,
    soilMoisture: 0,
    timestamp: new Date().toISOString()
  }]
  
  const [data, setData] = useState(fakeData);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.1.58:5000/sensor-data')
      if(response.status === 200) {
        setData(response.data)
      }
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 5 * 1000);
    return () => clearInterval(intervalId) 
  }, [])
  

  const temperatureData = data.map( element => {
    return {
      temperature: +element.temperature.toFixed(2),
      timestamp: element.timestamp
    }
  })

  const humidityData = data.map( element => {
    return {
      humidity: +element.humidity.toFixed(2),
      timestamp: element.timestamp
    }
  })

  const soilMoistureData = data.map( element => {
    return {
      soilMoisture: +element.soilMoisture.toFixed(2),
      timestamp: element.timestamp
    }
  })


  const cardsData = [
    {
      title: "Temperature",
      color: {
        backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
        boxShadow: "0px 10px 20px 0px #e0c6f5",
      },
      barValue: temperatureData[0].temperature,
      value: temperatureData[0].temperature.toString() + "°C",
      png: DeviceThermostatIcon,
      series: [
        {
          name: "Temperature",
          data: temperatureData.map(element => element.temperature),
        },
      ],
      timestamp: temperatureData.map(element => element.timestamp)
    },
    {
      title: "Humidity",
      color: {
        backGround: "linear-gradient(180deg, #FF919D 0%, #FC929D 100%)",
        boxShadow: "0px 10px 20px 0px #FDC0C7",
      },
      barValue: humidityData[0].humidity,
      value: `${humidityData[0].humidity}%`,
      png: OpacityIcon,
      series: [
        {
          name: "Humidity",
          data: humidityData.map(element => element.humidity),
        },
      ],
      timestamp: humidityData.map(element => element.timestamp)
    },
    {
      title: "Soil-Moisture",
      color: {
        backGround:
          "linear-gradient(rgb(248, 212, 154) -146.42%, rgb(255 202 113) -46.42%)",
        boxShadow: "0px 10px 20px 0px #F9D59B",
      },
      barValue: soilMoistureData[0].soilMoisture,
      value: `${soilMoistureData[0].soilMoisture}%`,
      png: LandslideIcon,
      series: [
        {
          name: "Soil-Moisture",
          data: soilMoistureData.map(element => element.soilMoisture),
        },
      ],
      timestamp: soilMoistureData.map(element => element.timestamp)
    },
  ];

  return (
    <div className="Cards">
      {cardsData.map((card, id) => {
        return (
          <div className="parentContainer" key={id}>
            <Card
              title={card.title}
              color={card.color}
              barValue={card.barValue}
              value={card.value}
              png={card.png}
              series={card.series}
              timestamp={card.timestamp}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Cards;
