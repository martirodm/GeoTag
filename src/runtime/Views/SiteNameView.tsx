import React, { useState } from 'react'
import '../../assets/stylesheets/home.css'

const SiteNameView = () => {
  const [formData, setFormData] = useState({
    site_name: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSend = (event) => {
    event.preventDefault()
    console.log("Site name:" + formData.site_name)
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
          value={formData.site_name}
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