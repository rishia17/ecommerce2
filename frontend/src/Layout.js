import React from 'react'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import { Outlet } from 'react-router-dom'
function Layout() {
  return (
    <div>
        <div>
      <Header />
      <div style={{ minHeight: "70vh" }}>
        <div className="">
          {" "}
        <Outlet />
        </div>
      </div>
      <div style={{ marginTop: "100px" }}>
      <Footer />
      </div>
    </div>
    </div>
  )
}

export default Layout