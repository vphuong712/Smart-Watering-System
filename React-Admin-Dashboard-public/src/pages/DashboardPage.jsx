import MainDash from '../components/MainDash/MainDash';
import RightSide from '../components/RightSide/RightSide';
import axios from 'axios';

const DashBoardPage = () => {
    return <>
        <MainDash/>
        <RightSide/>
    </>
}

export default DashBoardPage;

export const loader =  async () => {
    try {
        const response = await axios.get('http://192.168.1.58:5000/toggle');
        if(response.status === 200) {
            return response.data;
        }
    } catch (error) {
        throw error;
    }
    return null;
}
