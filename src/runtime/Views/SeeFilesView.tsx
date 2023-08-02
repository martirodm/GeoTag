import React from 'react'
import { DataSourceComponent } from 'jimu-core'

const SeeFilesView = ({ useDataSource, query, widgetId, dataRender, queryCount }) => {
  return (
    <DataSourceComponent useDataSource={useDataSource} query={query} widgetId={widgetId} queryCount>
      {dataRender}
    </DataSourceComponent>
  )
}

export default SeeFilesView
