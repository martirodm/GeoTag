/* eslint-disable react-hooks/exhaustive-deps */
import { React, DataSource, DataSourceStatus, FeatureLayerQueryParams, AllWidgetProps } from 'jimu-core'
import DataSourceRenderer from './widgetUI'
import { Select, MenuItem, SelectChangeEvent, FormControl, InputLabel } from '@mui/material'
import '../assets/stylesheets/css.css'
import '../assets/stylesheets/dropdown.css'

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

  const dataRender = (ds: DataSource, onButtonClick) => {
    if (!ds || ds.getStatus() !== DataSourceStatus.Loaded || ds.getRecords().length === 0) {
      return (
          <div className="no-popup">Please select a PopUp.</div>
      );
    }

    const groupedRecords = ds.getRecords().reduce((acc, record) => {
      const rowData = record.getData();  // Get all fields from the popup.
      const uniqueIdentifier = rowData.OBJECTID;

      if (!acc[uniqueIdentifier]) {
        acc[uniqueIdentifier] = [];
      }

      acc[uniqueIdentifier].push(rowData);
      return acc;
    }, {});

    const handleDropdownChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
      const selectedData = event.target.value;
      onButtonClick(selectedData);
    }

    return (
      <div className="record-list">
        <FormControl className="dropdownMenu">
          <InputLabel id="field-selector-label" className="dropdownInput">Choose Field</InputLabel>
          <Select
            labelId="field-selector-label"
            id="field-selector"
            defaultValue=""
            displayEmpty
            onChange={handleDropdownChange}
            label="Choose Field"
            className="dropdownSelect"
          >
            {Object.keys(groupedRecords).map((identifier) => (
              groupedRecords[identifier].map((recordData, index) => {
                const filteredData = Object.fromEntries(Object.entries(recordData).filter(([key, value]) => value !== null && value !== ''));

                return Object.keys(filteredData).map((keyName) => (
                  <MenuItem key={keyName} value={String(filteredData[keyName])}>
                    {keyName}
                  </MenuItem>
                ));
              })
            ))}
          </Select>
        </FormControl>
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
