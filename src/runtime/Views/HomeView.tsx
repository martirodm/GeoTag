import React from 'react'
import '../../assets/stylesheets/home.css'

const HomeView = ({ setView, setPrevView }) => {
  return (
    <div className='Body'>
      <button onClick={() => { setPrevView('home'); setView('AppCredentials') }}>
        Add App Credentials
      </button>
    </div>
  )
}

export default HomeView
