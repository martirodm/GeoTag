import React, { useContext, useState, useEffect } from 'react'
import { Button, styled } from '@mui/material'
import { DataSourceComponent } from 'jimu-core'
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'
import Point from 'esri/geometry/Point'
import { Spacer } from '@nextui-org/react'
import TextField from '@mui/material/TextField'
import { SharedVariableContext } from '../widgetUI'
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

const SeeFilesView = ({ setView, setPrevView, useDataSource, query, widgetId, dataRender, useMapWidgetIds }) => {
  const { nameTag, setNameTag } = useContext(SharedVariableContext)
  const [selectedTagType, setSelectedTagType] = useState(null)
  const [latitude, setLatitude] = useState<string>('')
  const [longitude, setLongitude] = useState<string>('')
  const CoordTagRef = React.useRef(null)
  const FieldTagRef = React.useRef(null)
  const [activeButton, setActiveButton] = useState<string | null>(null);

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
      setNameTag(latitude + longitude);
    }
  }, [latitude, longitude]);



  return (
    <div className='BodyTag'>
      <div>Find GeoTagged file</div>
      <AnimatedUnderlineButton variant="text" size="small" onClick={() => { setNameTag(null), setSelectedTagType('ByCoordinate'), setActiveButton('ByCoordinate') }} className={activeButton === 'ByCoordinate' ? 'active' : ''}>
        By Coordinate
      </AnimatedUnderlineButton>
      <AnimatedUnderlineButton variant="text" size="small" onClick={() => { setNameTag(null), setSelectedTagType('ByField'), setActiveButton('ByField') }} className={activeButton === 'ByField' ? 'active' : ''}>
        By Field
      </AnimatedUnderlineButton>
      <AnimatedUnderlineButton variant="text" size="small" onClick={() => { setNameTag(null), setSelectedTagType('Personalized'), setActiveButton('Personalized') }} className={activeButton === 'Personalized' ? 'active' : ''}>
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
            Name of the tag: {nameTag}
            <br />
            <Button ref={CoordTagRef} className='subButton' variant="contained" color="success" size="small" onClick={() => { setPrevView('seeFiles'), setView('seeTaggedFiles') }} disabled={nameTag === "" || nameTag === null}>SEARCH</Button>
            {(nameTag === "" || nameTag === null) && <p style={{ color: 'yellow' }}>Click on the part of the map where you want to see tagged files</p>}
          </p>
        </div>
      )}

      {selectedTagType === 'ByField' && (
        <div>
          <div>

            {/* This comes from widget.tsx */}
            <DataSourceComponent useDataSource={useDataSource} query={query} widgetId={widgetId} queryCount>
              {(ds) => dataRender(ds, setNameTag)}
            </DataSourceComponent>
            <Spacer y={0.5} />
            <Button ref={FieldTagRef} className='subButton' variant="contained" color="success" size="small" onClick={() => { setPrevView('seeFiles'), setView('seeTaggedFiles') }} disabled={nameTag === "" || nameTag === null}>SEARCH</Button>
          </div>
        </div>
      )}

      {selectedTagType === 'Personalized' && (
        <div>
          <Spacer y={0.5} />

          <TextField
            type='text'
            value={nameTag || ''}
            onChange={(e) => setNameTag(e.target.value)}
            label='Enter tag...'
            variant='filled'
            required
          />

          <Spacer y={0.5} />
          <Button ref={FieldTagRef} className='subButton' variant="contained" color="success" size="small" onClick={() => { setPrevView('seeFiles'), setView('seeTaggedFiles') }} disabled={nameTag === "" || nameTag === null}>SEARCH</Button>
        </div>
      )}
    </div>
  )
}

export default SeeFilesView