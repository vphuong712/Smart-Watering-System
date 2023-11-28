import classes from './Root.module.css';
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { redirect } from 'react-router-dom';
import axios from 'axios';


const Root = () => {
    return (
        <div className={classes.Root}>
            <div className={classes['RootGlass']} >
                <Sidebar />
                <Outlet />
            </div>
        </div>
    );
}

export default Root;

export const loader = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');

    if(!token || !userId) {
        return redirect('/authentication');
    }
    try {
        const response = await axios.get(`http://192.168.1.58:5000/users/${userId}`, {
            headers: {
                'Authorization': 'Bearer ' + token
                }
        })
        if(response.status === 200) {
            return response.data;
        }
    } catch (error) {
        throw error;
    }
}


