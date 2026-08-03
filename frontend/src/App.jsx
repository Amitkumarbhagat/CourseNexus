import './App.css';
import {BrowserRouter , Routes , Route} from 'react-router-dom';
import Login from './pages/auth/login';
import Register from './pages/auth/register'
import ForgotPassword from './pages/Auth/ForgotPassword';
import Course from './pages/course/course';
import Courses from './pages/course/Courses';
import CourseInfo from './pages/course/CourseInfo';
import Profile from './pages/profile/profile';
import Learnings from './pages/learning/learnings';
import Home from './pages/landing/Home';
import About from './pages/landing/About';
import DUsers from './pages/dashBoard/DUsers';
import DCourses from './pages/dashBoard/DCourses';
import ErrorPage from './pages/error/ErrorPage';
import Forum from './pages/course/forum';
import AdminDashboard from './pages/dashBoard/AdminDashboard';
import InstructorDashboard from './pages/dashBoard/InstructorDashboard';
import ProtectedRoute from './Components/common/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path='/login' Component={Login}></Route>
          <Route path='/register' Component={Register}></Route>
          <Route path='/forgot-password' Component={ForgotPassword}></Route>
          <Route path='/' Component={Home}></Route>
          <Route path='/about' Component={About}></Route>
          <Route path='/courses' Component={Courses}></Route>
          <Route path='/course-info/:id' Component={CourseInfo}></Route>

          {/* Admin Only Routes */}
          <Route path='/admin' element={<ProtectedRoute requiredRole="ROLE_ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path='/Dcourses' element={<ProtectedRoute requiredRole="ROLE_ADMIN"><DCourses /></ProtectedRoute>} />
          <Route path='/Dusers' element={<ProtectedRoute requiredRole="ROLE_ADMIN"><DUsers /></ProtectedRoute>} />

          {/* Authenticated User Routes */}
          <Route path='/course/:id' element={<ProtectedRoute><Course /></ProtectedRoute>} />
          <Route path='/discussion/:id' element={<ProtectedRoute><Forum /></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='/Learnings' element={<ProtectedRoute><Learnings /></ProtectedRoute>} />
          <Route path='/Performance' element={<ProtectedRoute><Performance /></ProtectedRoute>} />
          
          {/* Instructor Only Routes */}
          <Route path='/instructor' element={<ProtectedRoute requiredRole="ROLE_INSTRUCTOR"><InstructorDashboard /></ProtectedRoute>} />

          <Route path='*' Component={ErrorPage}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
