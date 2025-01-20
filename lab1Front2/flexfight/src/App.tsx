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
import ActiveRoutine from "./pages/ActiveRoutine";
import Statistics from "./pages/Statistics";
import SubscribeToACourse from "./pages/SubscribeToACourse";
import CourseSubscribers from "./pages/CourseSubscribers";
import Chats from "./pages/Chats";
import ChatPage from './pages/ChatPage';

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
        <Route path="/active-routine" element={<ActiveRoutine />} />
        <Route path="/stats" element={<Statistics />} />
        <Route path="/subscribe-to-course" element={<SubscribeToACourse />} />
        <Route path="/course-subs" element={<CourseSubscribers />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/chat/:chatId" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;