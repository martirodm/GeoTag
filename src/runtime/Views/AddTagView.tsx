import React, { useContext, useState, useEffect } from 'react'
import { SharedVariableContext } from '../widgetUI'
import { Button, styled } from '@mui/material'
import { DataSourceComponent } from 'jimu-core'
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'
import Point from 'esri/geometry/Point'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { Spacer } from '@nextui-org/react'
import '../../assets/stylesheets/addtag.css'

const AnimatedUnderlineButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '50%',
    bottom: 0,
    transform: 'translateX(-50%) scaleX(0)',  // Start from center and no horizontal scale
    transformOrigin: 'center',
    borderBottom: '2px solid whitesmoke',
    width: '100%',  // Full width of the button
    transition: 'transform 0.3s',
  },
  '&:hover::after': {
    transform: 'translateX(-50%) scaleX(1)',  // Scale horizontally to full size on hover
  },
  '&.active::after': {
    transform: 'translateX(-50%) scaleX(1)',
  }
}));

const AddTagView = ({ setView, useDataSource, query, widgetId, dataRender, useMapWidgetIds }) => {
  const { folderId, fileId, fileName, token, siteId } = useContext(SharedVariableContext)
  const [selectedTagType, setSelectedTagType] = useState(null);
  const [latitude, setLatitude] = useState<string>('')
  const [longitude, setLongitude] = useState<string>('')
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(null)
  const [tag, setTag] = React.useState(null)
  const CoordTagRef = React.useRef(null)
  const FieldTagRef = React.useRef(null)
  const [activeButton, setActiveButton] = useState<string | null>(null);


  const handleOpen = (ref, name) => {
    setOpen(true)
    setSelected(name)
    if (ref.current) {
      ref.current.blur()
    }
  }

  const handleClose = () => setOpen(false)

  const handleAdd = () => {
    const addTag = async () => {
      const dataResponse = await fetch("http://localhost:3002/addTag", {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'siteId': siteId,
          'tag': tag
        }
      })
      const data = await dataResponse.text()
      console.log(data)
    }
    addTag()

    handleClose()
  }

  const StyledButton = styled(Button)({
    marginRight: '7px',
    marginLeft: '7px',
    marginTop: '10px',
  })

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

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      jmv.view.on('click', evt => {
        const point: Point = jmv.view.toMap({
          x: evt.x,
          y: evt.y
        })
        setLatitude(point.latitude.toFixed(3))
        setLongitude(point.longitude.toFixed(3))
      })
    }
  }

  useEffect(() => {
    if (selectedTagType === 'ByCoordinate') {
      setTag(latitude + longitude);
    }
  }, [latitude, longitude]);



  return (
    <div className='BodyTag'>
      <div>Add Tag to <span style={{ color: '#b0b0b0' }}>{fileName}</span></div>
      <AnimatedUnderlineButton variant="text" size="small" onClick={() => { setTag(null), setSelectedTagType('ByCoordinate'), setActiveButton('ByCoordinate') }} className={activeButton === 'ByCoordinate' ? 'active' : ''}>
        By Coordinate
      </AnimatedUnderlineButton>
      <AnimatedUnderlineButton variant="text" size="small" onClick={() => { setTag(null), setSelectedTagType('ByField'), setActiveButton('ByField') }} className={activeButton === 'ByField' ? 'active' : ''}>
        By Field
      </AnimatedUnderlineButton>
      <AnimatedUnderlineButton variant="text" size="small" onClick={() => { setTag(null), setSelectedTagType('Personalized'), setActiveButton('Personalized') }} className={activeButton === 'Personalized' ? 'active' : ''}>
        Personalized
      </AnimatedUnderlineButton>
      <Spacer y={0.5} />
      {selectedTagType === 'ByCoordinate' && (
        <div>
          {
            useMapWidgetIds &&
            useMapWidgetIds.length === 1 && (
              <JimuMapViewComponent
                useMapWidgetId={useMapWidgetIds[0]}
                onActiveViewChange={activeViewChangeHandler}
              />
            )
          }
          <p>
            Selected latitude: {latitude}
            <br />
            Selected longitude: {longitude}
            <br />
            Name of the tag: {tag}
            <br />
            <Button ref={CoordTagRef} className='subButton' variant="contained" color="success" size="small" onClick={() => handleOpen(CoordTagRef, 'CoordTag')} disabled={tag === "" || tag === null}>ADD</Button>
            {(tag === "" || tag === null) && <p style={{ color: 'yellow' }}>Click on the part of the map you want to Tag</p>}
          </p>
        </div>
      )}

      {selectedTagType === 'ByField' && (
        <div>
          <div>
            <DataSourceComponent useDataSource={useDataSource} query={query} widgetId={widgetId} queryCount>
              {(ds) => dataRender(ds, setTag)}
            </DataSourceComponent>
            <Spacer y={0.5} />
            <Button ref={FieldTagRef} className='subButton' variant="contained" color="success" size="small" onClick={() => handleOpen(FieldTagRef, 'FieldTag')} disabled={tag === "" || tag === null}>ADD</Button>
          </div>
        </div>
      )}

      {selectedTagType === 'Personalized' && (
        <div>
          <Spacer y={0.5} />
          <input
            type="text"
            value={tag || ''}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Enter tag..."
          />
          <Spacer y={0.5} />
          <Button ref={FieldTagRef} className='subButton' variant="contained" color="success" size="small" onClick={() => handleOpen(FieldTagRef, 'FieldTag')} disabled={tag === "" || tag === null}>ADD</Button>
        </div>
      )}


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
            <>
              Add the tag <span style={{ color: '#b0b0b0' }}><strong>{tag}</strong></span> to the file <span style={{ color: '#b0b0b0' }}><strong>{fileName}</strong></span>?
            </>

          </Typography>
          <StyledButton variant="contained" color="error" onClick={handleAdd}>Yes</StyledButton>
          <StyledButton variant="contained" color="success" onClick={handleClose}>No</StyledButton>
        </Box>
      </Modal>
    </div>
  )
}

export default AddTagView