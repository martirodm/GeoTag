import React, { useContext, useState } from 'react'
import { SharedVariableContext } from '../widgetUI'
import { Button, styled } from '@mui/material'
import { DataSourceComponent } from 'jimu-core'
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

const AddTagView = ({ setView, useDataSource, query, widgetId, dataRender, queryCount }) => {
  const { folderId, fileId, fileName } = useContext(SharedVariableContext)
  const [selectedTagType, setSelectedTagType] = useState(null);

  return (
    <div className='BodyTag'>
      <div>Add Tag to {fileName}:</div>
      <AnimatedUnderlineButton variant="text" size="small" onClick={() => { setSelectedTagType('ByCoordinate') }}>
        By Coordinate
      </AnimatedUnderlineButton>
      <AnimatedUnderlineButton variant="text" size="small" onClick={() => { setSelectedTagType('ByTag') }}>
        By Tag
      </AnimatedUnderlineButton>
      <AnimatedUnderlineButton variant="text" size="small" onClick={() => { setSelectedTagType('Personalized') }}>
        Personalized
      </AnimatedUnderlineButton>
      <br />
      <br />
      {selectedTagType === 'ByCoordinate' && (
        <div>
          Displaying content for By Coordinate.
        </div>
      )}

      {selectedTagType === 'ByTag' && (
        <DataSourceComponent useDataSource={useDataSource} query={query} widgetId={widgetId} queryCount>
        {dataRender}
      </DataSourceComponent>
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