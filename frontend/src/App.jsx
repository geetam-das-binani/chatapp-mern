import React from 'react'
import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import HomePage from './Pages/HomePage'
import ChatPage from './Pages/ChatPage'
const App = () => {
  return (
        <div className='app'>
    <BrowserRouter>
     <Routes>
     <Route path='/' element={<HomePage/>}/>
     <Route path='/chats' element={<ChatPage/>}/>
  
     </Routes>
   
    </BrowserRouter>
    </div>
  )
}

export default App
