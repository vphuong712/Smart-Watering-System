import LoginForm from "../components/AuthForm/LoginForm";
import RegisterForm from "../components/AuthForm/RegisterForm";
import { useSearchParams } from "react-router-dom";
import { redirect } from "react-router-dom";

const AuthPage = () => {
    const [ searchParams ] = useSearchParams();
    const modeParam = searchParams.get('mode');
    const isLogin = modeParam === 'signin' || !modeParam;

    return (
        <>
            {isLogin ? <LoginForm/> : <RegisterForm/>}
        </>
    )
}

export default AuthPage;

export const loader = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');

    if(token && userId) {
        return redirect('/')
    }
    return null;
}