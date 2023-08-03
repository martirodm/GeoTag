import React from 'react'
import { Spacer } from '@nextui-org/react'
import '../../assets/stylesheets/home.css'

const HomeView = ({ setView, setPrevView }) => {
  return (
    <div className='Body'>
      <div>
        <div>App Credentials:</div>
        <button className='ButtonAdd' onClick={() => { setPrevView('home'); setView('AppCredentials') }}>
          Add
        </button>
        <button className='ButtonDel' onClick={() => { setPrevView('home'); setView('AppCredentials') }}>
          Delete
        </button>
      </div>
      <br />
      <div>
        <div>Site Name:</div>
        <button className='ButtonAdd' onClick={() => { setPrevView('home'); setView('SiteName') }}>
          Add
        </button>
        <button className='ButtonDel' onClick={() => { setPrevView('home'); setView('SiteName') }}>
          Delete
        </button>
      </div>
    </div>
  )
}

export default HomeView
