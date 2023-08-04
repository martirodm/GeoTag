import React, { useContext } from 'react'
import { SharedVariableContext } from '../widgetUI'

const GeoTagView = () => {
  const { credentials, siteName } = useContext(SharedVariableContext)
  
  console.log(credentials)
  console.log(siteName)

  return <div>GeoTag View</div>
}

export default GeoTagView
