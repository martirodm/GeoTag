import React, { useContext } from 'react'
import { SharedVariableContext } from '../widgetUI'

const GeoTagView = () => {
  const { credentials, siteName, token } = useContext(SharedVariableContext)

  console.log(credentials)
  console.log(siteName)
  console.log(token)

  const getData = async () => {

    const dataResponse = await fetch("http://localhost:3002/data", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await dataResponse.json()
    console.log(data)
  }
  getData();

  return <div>GeoTag View</div>
}

export default GeoTagView
