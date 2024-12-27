import HomeButton from '../components/home/HomeButton';
import { FaDumbbell, FaRunning, FaBiking } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const handleCreateRoutine = () => {
        navigate('/create-routine');
        console.log('Create Routine clicked');
    };

    const handleSavedRoutines = () => {
        console.log('Saved Routines clicked');
    };

    const handleSubscribeToACourse = () => {
        console.log('Subscribe to a course clicked');
    };

    return (
        <div className="home flex flex-wrap gap-4 justify-center items-center min-h-screen bg-gray-100">
            <HomeButton name="Create Routine" icon={<FaDumbbell />} onClick={handleCreateRoutine} />
            <HomeButton name="Saved Routines" icon={<FaRunning />} onClick={handleSavedRoutines} />
            <HomeButton name="Subscribe to a Course" icon={<FaBiking />} onClick={handleSubscribeToACourse} />
        </div>
    );
}

export default Home;