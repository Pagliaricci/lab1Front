import LoginFormsComponent from '../components/login/LoginFormsComponent';

function Login() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-xs">
                <h1 className="py-10 text-center text-2xl font-bold">Login</h1>
                <LoginFormsComponent />
            </div>
        </div>
    );
}

export default Login;