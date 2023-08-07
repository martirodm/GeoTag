import React, { useContext, useEffect } from 'react'
import { SharedVariableContext } from '../widgetUI'

const GeoTagView = () => {
  const { token, siteId } = useContext(SharedVariableContext)
  console.log(siteId)

  useEffect(() => { //For only executing one time
    const getData = async () => {
      const dataResponse = await fetch("http://localhost:3002/display-ff", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'siteId': siteId
        }
      });
      const data = await dataResponse.json()
      console.log(data)
    }
    getData()
  }, [])

  return <div>GeoTag View</div>
}

export default GeoTagView
