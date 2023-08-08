import React, { useContext, useState } from 'react'
import { SharedVariableContext } from '../widgetUI'
import '../../assets/stylesheets/home.css'
import SendIcon from '@mui/icons-material/Send'
import LoadingButton from '@mui/lab/LoadingButton'
import CircularProgress from '@mui/material/CircularProgress'
import { styled } from '@mui/system'

const ColoredCircularProgress = styled(CircularProgress)(({ theme }) => ({
  color: '#f5f5f5',
}))

const ColoredLoadingButton = styled(LoadingButton)(({ theme }) => ({
  color: '#f5f5f5',
}))

const SiteNameView = ({ setView }) => {
  const { siteName, setSiteName, token, siteId, setSiteId } = useContext(SharedVariableContext)
  const [loading, setLoading] = useState(false)

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
    setLoading(true)
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
    setLoading(false)
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
            <ColoredLoadingButton
              color="success"
              size="small"
              loading={loading}
              loadingPosition="end"
              endIcon={<SendIcon />}
              variant="contained"
              type="submit"
              loadingIndicator={<ColoredCircularProgress size={20} />}
              style={{ color: '#f5f5f5' }}
            >
              Send
            </ColoredLoadingButton>
          </center>
        </div>
      </form>
    </div>
  )
}

export default SiteNameView