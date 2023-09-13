import React, { useContext, useState } from 'react';
import { SharedVariableContext } from '../widgetUI';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/system';

const ColoredCircularProgress = styled(CircularProgress)(({ theme }) => ({
  color: '#f5f5f5',
}));

const ColoredLoadingButton = styled(LoadingButton)(({ theme }) => ({
  color: '#f5f5f5',
}));

const AppCredentialsView = ({ setView }) => {
  const { serverIP, credentials, setCredentials, setToken } = useContext(SharedVariableContext);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSend = async (event) => {
    event.preventDefault() // If I don't have it, I get: This item is not published. Please open this item in Experience Builder, then click Publish to publish it.
    const data = `client_id: ${credentials.client_id}\nclient_secret: ${credentials.client_secret}\ntenant_id: ${credentials.tenant_id}`

    setLoading(true);

    // Send credentials to Express.
    await fetch('http://'+serverIP+':3002/set-credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    // Generate token.
    const tokenResponse = await fetch('http://'+serverIP+':3002/token');
    const tokenData = await tokenResponse.json();

    setToken(tokenData.accessToken);
    setView('home');

    setLoading(false);
  };

  return (
    <div className='Body'>
      <div>Write Credentials:</div>
      <form onSubmit={handleSend}>
        <br />
        <TextField
          type='text'
          name='client_id'
          value={credentials.client_id}
          onChange={handleChange}
          label='Application (client) ID'
          variant='filled'
          required
        />
        <br />
        <TextField
          type='text'
          name='client_secret'
          value={credentials.client_secret}
          onChange={handleChange}
          label='Client secret value'
          variant='filled'
          required
        />
        <br />
        <TextField
          type='text'
          name='tenant_id'
          value={credentials.tenant_id}
          onChange={handleChange}
          label='Directory (tenant) ID'
          variant='filled'
          required
        />
        <br />
        <br />
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
          Submit
        </ColoredLoadingButton>
      </form>
    </div>
  );
};

export default AppCredentialsView;
