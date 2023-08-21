import React, { useContext, useEffect, useState } from 'react'
import { SharedVariableContext } from '../widgetUI'

const AddTagView = ({ setView }) => {
  const { folderId, fileId } = useContext(SharedVariableContext)
  return <div>Folder:{folderId},File:{fileId}</div>
}

export default AddTagView
