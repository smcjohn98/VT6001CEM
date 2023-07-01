import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'

import Home from './pages/Home'
import Start from './pages/Start'
import Help from './pages/Help'
import AccountInfo from './pages/AccountInfo'
import './App.css'

export default function App() {
  return (
    <Router>
      <AccountInfo/>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/start' element={<Start />} />
        <Route path='/help' element={<Help />} />
      </Routes>
    </Router>
  )
}


