import React, { useContext  } from 'react'
import { SharedVariableContext } from '../widgetUI'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { styled } from '@mui/system'
import '../../assets/stylesheets/home.css'

const StyledButton = styled(Button)({
  marginRight: '7px',
  marginLeft: '7px',
  marginTop: '10px',
})


const HomeView = ({ setView, setPrevView }) => {

  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(null)
  const deleteButtonRef1 = React.useRef(null)
  const deleteButtonRef2 = React.useRef(null)
  const { credentials, setCredentials, siteName, setSiteName } = useContext(SharedVariableContext)

  const handleOpen = (ref, name) => {
    setOpen(true)
    setSelected(name)
    if (ref.current) {
      ref.current.blur()
    }
  }

  const handleClose = () => setOpen(false)

  const handleDelete = () => {
    if (selected === 'App Credentials') {
      setCredentials({
        client_id: '',
        client_secret: '',
        tenant_id: '',
      })
    } else if (selected === 'Site Name') {
      setSiteName('')
    }
    handleClose()
}


  const style = {
    color: 'whitesmoke',
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#23272f',
    border: '2px solid #23272f',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
    textAlign: 'center',
  }

  return (
    <div className='Body'>
      <div>
        <div>App Credentials:</div>
        <StyledButton variant="contained" color="success" size="small" onClick={() => { setPrevView('home'); setView('AppCredentials') }}>
          Add
        </StyledButton>
        <StyledButton ref={deleteButtonRef1} variant="contained" color="error" size="small" onClick={() => handleOpen(deleteButtonRef1, 'App Credentials')}>Delete</StyledButton>
      </div>
      <br />
      <div>
        <div>Site Name:</div>
        <StyledButton variant="contained" color="success" size="small" onClick={() => { setPrevView('home'); setView('SiteName') }}>
          Add
        </StyledButton>
        <StyledButton ref={deleteButtonRef2} variant="contained" color="error" size="small" onClick={() => handleOpen(deleteButtonRef2, 'Site Name')}>Delete</StyledButton>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bolder', color: 'whitesmoke' }}>
            Warning
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {`Are you sure you want to delete the ${selected}?`}
          </Typography>
          <StyledButton variant="contained" color="error" onClick={handleDelete}>Yes, delete it</StyledButton>
          <StyledButton variant="contained" color="success" onClick={handleClose}>No, take me back</StyledButton>
        </Box>
      </Modal>
    </div>
  )
}

export default HomeView
