import ButtonComponent from '../components/login/LoginButtonComponent';
import { useNavigate } from 'react-router-dom';

function Welcome() {
    const navigate = useNavigate();

    const handleWelcomeClick = () => {
        navigate('/login');
    };

    return (
        <div className="flex flex-col items-center gap-5 py-5">
            <h1 className="text-2xl font-bold">Welcome to FlexFight!</h1>
            <p>FlexFight is a web application that allows users to create, share, subscribe, and manage their gym routines.</p>
            <ButtonComponent type="button" text="Get Started!" variant="primary" onclick={handleWelcomeClick} />
        </div>
    );
}

export default Welcome;