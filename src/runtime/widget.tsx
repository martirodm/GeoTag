/* eslint-disable react-hooks/exhaustive-deps */
import { React, DataSource, DataSourceStatus, FeatureLayerQueryParams, AllWidgetProps } from 'jimu-core'
import DataSourceRenderer from './widgetUI'
import { styled } from '@mui/system'
import Button from '@mui/material/Button'
import '../assets/stylesheets/css.css'

const { useState, useEffect, useRef } = React

export default function Widget(props: AllWidgetProps<{}>) { // Function Component.
  const [query, setQuery] = useState<FeatureLayerQueryParams>(null) // The inicial value of query variable is null.
  const nameRef = useRef<HTMLInputElement>(null) // References the HTML input element, which basically is the pop up.

  useEffect(() => { // This function is called when Widget is rendered, but just one time.
    queryFunc()
  }, []) // The empty array means that it doesn't depend on any values, so it means that it won't execute again, even if I change a value of the values of queryFunc().

  const isDsConfigured = () => {
    if (props.useDataSources &&
      props.useDataSources.length === 1 &&
      props.useDataSources[0].fields &&
      props.useDataSources[0].fields.length === 1) {
      return true
    }
    return false
  }

  const queryFunc = () => {
    if (!isDsConfigured()) {
      return
    }
    const fieldName = props.useDataSources[0].fields[0]
    const w = nameRef.current && nameRef.current.value // If nameRef.current exists and the value of it is not null:
      ? `${fieldName} like '%${nameRef.current.value}%'` // If it's 1, I check if the nameRef.current field is the same as the entered name.
      : '1=1' // If it's 0, if nameRef.current is false (or doesn't exist), I match all the records (because 1=1 works like an always True.).

    setQuery({
      where: w,
      outFields: ['*'], // I select everything.
      pageSize: 10
    })
  }

  const StyledButton = styled(Button)({
    marginRight: '7px',
    marginLeft: '7px',
    marginTop: '10px',
  })

  const dataRender = (ds: DataSource) => { // Function that renders all the data to the widget.
    return (
      <div className="record-list">
        {
          ds && ds.getStatus() === DataSourceStatus.Loaded
            ? ( // If the DataSource exists and is active:
              ds.getRecords().length > 0 // If there are any records available:
                ? (() => {
                  // Group records by unique identifier.
                  const groupedRecords = ds.getRecords().reduce((acc, record) => { // acc = unique identifier; reduce function is to group by the uniqueIdentifier.
                    const rowData = record.getData()
                    const uniqueIdentifier = rowData.OBJECTID // I select the OBJECTID from rowData array.

                    if (!acc[uniqueIdentifier]) { // If I don't have the "uniqueIdentifier":
                      acc[uniqueIdentifier] = [] // I set is an empty array.
                    }

                    acc[uniqueIdentifier].push(rowData)
                    return acc
                  }, {})

                  return (
                    <>
                      {Object.keys(groupedRecords).map((identifier) => (
                        <div key={identifier}>
                          <div>
                            {groupedRecords[identifier].map((recordData, index) => {
                              const filteredData = Object.fromEntries(Object.entries(recordData).filter(([key, value]) => value !== null && value !== ''))
                              return (
                                <div key={index}>
                                  {Object.keys(filteredData).map((keyName, buttonIndex) => (
                                    <div className="button-row" key={buttonIndex}>
                                      <StyledButton variant="contained" color="success" size="small" onClick={() => console.log(filteredData[keyName])}>{keyName}</StyledButton>
                                    </div>
                                  ))}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </>
                  )

                })()
                : <div>Please select a PopUp</div> // If there're not records.
            )
            : null
        }
      </div>
    )
  }

  if (!isDsConfigured()) {
    return <DataSourceRenderer
      configured={false}
      useDataSource={undefined}
      query={undefined}
      widgetId={undefined}
      dataRender={undefined}
      useMapWidgetIds={undefined}
    />
  }

  return <DataSourceRenderer
    configured={true}
    useDataSource={props.useDataSources[0]}
    query={query} widgetId={props.id}
    dataRender={dataRender}
    useMapWidgetIds={props.useMapWidgetIds}
  />
}
