import { Routes, Route } from "react-router-dom";


import Menu from './components/Menu.jsx';
import Landing from './components/Landing.jsx';
import LoginPage from './components/LoginPage.jsx';
import SignupPage from './components/SignupPage.jsx';

function App() {

  return (
    <>
        <Routes>
          <Route path='/' element={<Landing />}/>
          <Route path='/menu' element={<Menu />}/>
          <Route path='/login' element={<LoginPage />}/>
          <Route path='/signup' element={<SignupPage />}/>
        </Routes>
        <Menu></Menu>
    </>
  )
}

export default App
