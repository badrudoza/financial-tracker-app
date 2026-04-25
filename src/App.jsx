import './App.css';
import Header from './components/Header';
import Dashboard from './components/pages/Dashboard';
import Signup from './components/pages/Signup';
import SignupSignin from './components/SignupSignin';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import ShowData from "./components/ShowData";

function App() {
  return (
    <>
    <ToastContainer/>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;