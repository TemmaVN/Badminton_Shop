import React, { useState } from 'react'
import PageHeader from './layouts/PageHeader'
import MainHeader from './layouts/MainHeader'
import MenuHeader from './layouts/MenuHeader'
import { useMediaQuery } from './mystate/useMediaQuery'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Advertisement from './components/Advertisement'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isHideMainHeader = useMediaQuery('(min-width: 1250px)');
  return (
    <BrowserRouter>
      <div className='bg-white relative h-auto w-full'>
        <PageHeader setIsMenuOpen={setIsMenuOpen} />
        {isHideMainHeader && <MainHeader />}
        <MenuHeader isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
         <Routes>
          <Route path='/' element={<Advertisement />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
