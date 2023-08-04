import React, { useContext  } from 'react'
import { SharedVariableContext } from '../widgetUI'
import '../../assets/stylesheets/home.css'

const AppCredentialsView = ({ setView }) => {
  const { credentials, setCredentials } = useContext(SharedVariableContext)

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSend = (event) => {
    event.preventDefault() // If I don't have it, I get: This item is not published. Please open this item in Experience Builder, then click Publish to publish it.
    // If all fields are filled I console.log()
    const data = `client_id: ${credentials.client_id}\nclient_secret: ${credentials.client_secret}\ntenant_id: ${credentials.tenant_id}`
    console.log(data)
    setView('home')
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