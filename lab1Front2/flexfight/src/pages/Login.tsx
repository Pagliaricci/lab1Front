import LoginFormsComponent from '../components/login/LoginFormsComponent';

function Login() {
    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-orange-600 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600">Sign in to continue your fitness journey</p>
                </div>
                <LoginFormsComponent />
            </div>
        </div>
    );
}

export default Login;