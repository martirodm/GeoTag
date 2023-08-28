import React, { useContext } from 'react'
import { DataSourceComponent } from 'jimu-core'
import { SharedVariableContext } from '../widgetUI'

const SeeFilesView = ({ useDataSource, query, widgetId, dataRender, queryCount }) => {
  const { token } = useContext(SharedVariableContext)

  if (!token) {
    return (
      <div className="no-credentials">Please add credentials.</div>
    )
  }

  return (
    <DataSourceComponent useDataSource={useDataSource} query={query} widgetId={widgetId} queryCount>
      {dataRender}
    </DataSourceComponent>
  )
}

export default SeeFilesView
