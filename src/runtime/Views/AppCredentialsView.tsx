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

const AppCredentialsView = ({ setView }) => {
  const { credentials, setCredentials, setToken } = useContext(SharedVariableContext) // Shared variable from widgetUI.tsx.
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setCredentials((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSend = async (event) => {
    event.preventDefault() // If I don't have it, I get: This item is not published. Please open this item in Experience Builder, then click Publish to publish it.
    // If all fields are filled I console.log()
    const data = `client_id: ${credentials.client_id}\nclient_secret: ${credentials.client_secret}\ntenant_id: ${credentials.tenant_id}`
    console.log(data)

    setLoading(true)

    // Send credentials to Express.
    await fetch("http://localhost:3002/set-credentials", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials) // Convert "credentials" to json string.
    })

    // Generate token.
    const tokenResponse = await fetch("http://localhost:3002/token")
    const tokenData = await tokenResponse.json()

    setToken(tokenData.accessToken)
    setView('home')

    setLoading(false)
  }


  return (
    <div className='Body'>
      <div>Write Credentials:</div>
      <form onSubmit={handleSend}>
        <br />
        <input
          type='text'
          name='client_id'
          placeholder='Application (client) ID'
          value={credentials.client_id}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type='text'
          name='client_secret'
          placeholder='Client secret value'
          value={credentials.client_secret}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type='text'
          name='tenant_id'
          placeholder='Directory (tenant) ID'
          value={credentials.tenant_id}
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

export default AppCredentialsView
