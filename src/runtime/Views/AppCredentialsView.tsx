import React, { useState } from 'react';
import '../../assets/stylesheets/home.css';

const AppCredentialsView = () => {
  const [formData, setFormData] = useState({
    client_id: '',
    client_secret: '',
    tenant_id: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSend = (event) => {
    event.preventDefault(); // If I don't have it, I get: This item is not published. Please open this item in Experience Builder, then click Publish to publish it.
    // If all fields are filled, proceed with further actions (e.g., sending data, etc.)
    const data = `client_id: ${formData.client_id}\nclient_secret: ${formData.client_secret}\ntenant_id: ${formData.tenant_id}`;
    console.log(data);
  };

  return (
    <div className='Body'>
      <form onSubmit={handleSend}>
        <div>Write Credentials:</div>
        <input
          type='text'
          name='client_id'
          placeholder='client_id'
          value={formData.client_id}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type='text'
          name='client_secret'
          placeholder='client_secret'
          value={formData.client_secret}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type='text'
          name='tenant_id'
          placeholder='tenant_id'
          value={formData.tenant_id}
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
  );
};

export default AppCredentialsView;