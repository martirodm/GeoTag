import React, { useContext } from 'react'
import { SharedVariableContext } from '../widgetUI'
import '../../assets/stylesheets/home.css'

const SiteNameView = ({ setView }) => {
  const { siteName, setSiteName, token, siteId, setSiteId } = useContext(SharedVariableContext)

  const handleChange = (event) => {
    const { name, value } = event.target
    setSiteName((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSend = async (event) => {
    event.preventDefault()
    console.log("Site name: " + siteName.site_name)

    await fetch("http://localhost:3002/set-siteName", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(siteName)
    })

    const getSites = await fetch("http://localhost:3002/getSites", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const sites = await getSites.text()
    if (sites != null) {
      setSiteId(sites)
      console.log("SiteID setted: " + sites)
    } else {
      console.log("Site doesn't exist")
    }

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