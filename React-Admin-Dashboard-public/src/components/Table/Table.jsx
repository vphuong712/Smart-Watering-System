import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./Table.css";
import { useLoaderData } from "react-router-dom";


const convertTime = (date) => {
  const convertDate = new Date(date); 
  if(isNaN(convertDate)) {
    return date;
  }
  const convertDay = `${convertDate.getMonth() + 1}/${convertDate.getDate()}/${convertDate.getFullYear()}`; 
  const hours = `${convertDate.getUTCHours()}:${convertDate.getUTCMinutes()}:${convertDate.getUTCSeconds()}`
  return `${convertDay} ${hours}`; 
}


export default function BasicTable() {
  const data = useLoaderData();
  const lastTurnOff = data.find(element => element['isOn'] === false)
  const lastTurnOn = data.find(element => element['isOn'] === true) || {
    isOn: true,
    timestamp: 'Recently the device has not turned on'
  }

  
  const obj = {
    user: lastTurnOff.user,
    timeOn: convertTime(lastTurnOn.timestamp),
    timeOff: convertTime(lastTurnOff.timestamp)
  }


  return (
      <div className="Table">
      <h3>Pump Control Times</h3>
        <TableContainer
          component={Paper}
          style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="left">Last Turned On</TableCell>
                <TableCell align="left">Last Turned Of</TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ color: "white" }}>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {obj.user}
                </TableCell>
                <TableCell align="left">{obj.timeOn}</TableCell>
                <TableCell align="left">{obj.timeOff}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
  );
}
