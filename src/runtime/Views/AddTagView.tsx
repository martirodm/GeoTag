import React, { useContext, useState } from 'react'
import { SharedVariableContext } from '../widgetUI'
import { Button, styled } from '@mui/material'
import { DataSourceComponent } from 'jimu-core'
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'
import Point from 'esri/geometry/Point'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import List from '@mui/material/List'
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
  }
}));

const AddTagView = ({ setView, useDataSource, query, widgetId, dataRender, useMapWidgetIds }) => {
  const { folderId, fileId, fileName } = useContext(SharedVariableContext)
  const [selectedTagType, setSelectedTagType] = useState(null);
  const [latitude, setLatitude] = useState<string>('')
  const [longitude, setLongitude] = useState<string>('')

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


  return (
    <div className='BodyTag'>
      <div>Add Tag to {fileName}:</div>
      <AnimatedUnderlineButton variant="text" size="small" onClick={() => { setSelectedTagType('ByCoordinate') }}>
        By Coordinate
      </AnimatedUnderlineButton>
      <AnimatedUnderlineButton variant="text" size="small" onClick={() => { setSelectedTagType('ByField') }}>
        By Field
      </AnimatedUnderlineButton>
      <AnimatedUnderlineButton variant="text" size="small" onClick={() => { setSelectedTagType('Personalized') }}>
        Personalized
      </AnimatedUnderlineButton>
      <br />
      <br />
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
            Name of the tag: "{latitude}{longitude}"
          </p>
        </div>
      )}

      {selectedTagType === 'ByField' && (
        <List className='scrollableList2'>
          <DataSourceComponent useDataSource={useDataSource} query={query} widgetId={widgetId} queryCount>
            {dataRender}
          </DataSourceComponent>
        </List>
      )}

      {selectedTagType === 'Personalized' && (
        <div>
          Displaying content for Personalized.
        </div>
      )}
    </div>
  )
}

export default AddTagView