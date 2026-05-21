import { useState } from 'react'
import PageHeader from './layouts/PageHeader'
import MainHeader from './layouts/MainHeader'
import MenuHeader from './layouts/MenuHeader'
import HomePage from './layouts/HomePage'
import Product from './layouts/Product'
import ProductDetail from './layouts/ProductDetail'
import { useMediaQuery } from './mystate/useMediaQuery'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

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
          <Route path='/' element={<HomePage />} />
          <Route path='/:categorySlug/*' element={<Product />} />
          <Route path='/p/:productSlug' element={<ProductDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
