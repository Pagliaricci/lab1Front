import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import CreateRoutine from './pages/CreateRoutine';
import Profile from './pages/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import the default styles
import SavedRoutines from "./pages/SavedRoutines";

function App() {
  return (
    <div>
      <ToastContainer />
    <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-routine" element={<CreateRoutine />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/saved-routines" element={<SavedRoutines />} />
    </Routes>
    </div>
  );
}

export default App;