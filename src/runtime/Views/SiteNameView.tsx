import React, { useContext } from 'react'
import { SharedVariableContext } from '../widgetUI'
import '../../assets/stylesheets/home.css'

const SiteNameView = ({ setView }) => {
  const { siteName, setSiteName } = useContext(SharedVariableContext)

  const handleChange = (event) => {
    const { name, value } = event.target
    setSiteName((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSend = (event) => {
    event.preventDefault()
    console.log("Site name: " + siteName.site_name)
    setView('home')
  }

  return (
    <div className='Body'>
      <form onSubmit={handleSend}>
        <div>Write the name of your SharePoint Site:</div>
        <br />
        <input
          className='SiteInput'
          type='text'
          name='site_name'
          placeholder='site_name'
          value={siteName.site_name}
          onChange={handleChange}
          required
        />
        <br />
        <div>
          <br />
          <center>
            <button type='submit'>Send</button>
          </center>
        </div>
      </form>
    </div>
  )
}

export default SiteNameView