import { Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu.jsx';
import Landing from './pages/Landing.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';

function App() {

  return (
    <>
        <Routes>
          <Route path='/' element={<Landing />}/>
          <Route path='/menu' element={<Menu />}/>
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/signup' element={<SignupPage />}/>
        </Routes>
    </>
  )
}

export default App
