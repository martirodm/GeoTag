import React, { useContext } from 'react'
import { SharedVariableContext } from '../widgetUI'
import '../../assets/stylesheets/home.css'
import { loadToken } from './TokenFetch'

const AppCredentialsView = ({ setView }) => {
  const { credentials, setCredentials, setToken } = useContext(SharedVariableContext)

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSend = async (event) => {
    event.preventDefault();
    const data = `client_id: ${credentials.client_id}\nclient_secret: ${credentials.client_secret}\ntenant_id: ${credentials.tenant_id}`
    console.log(data);

    // Send credentials to Express
    await fetch("http://localhost:3002/set-credentials", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    // Generate token
    const tokenResponse = await fetch("http://localhost:3002/token");
    const tokenData = await tokenResponse.json();

    setToken(tokenData.accessToken)
    console.log(tokenData.accessToken)
    setView('home');
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
            <button type='submit'>Send</button>
          </center>
        </div>
      </form>
    </div>
  )
}

export default AppCredentialsView;
