import { React, Immutable, IMFieldSchema, UseDataSource, AllDataSourceTypes } from 'jimu-core'
import { AllWidgetSettingProps } from 'jimu-for-builder'
import { DataSourceSelector, FieldSelector } from 'jimu-ui/advanced/data-source-selector'
import { MapWidgetSelector } from 'jimu-ui/advanced/setting-components';


export default function Setting(props: AllWidgetSettingProps<{}>) { // Function Component.
  const onFieldChange = (allSelectedFields: IMFieldSchema[]) => {
    props.onSettingChange({ // Function to update the widget settings.
      id: props.id,
      useDataSources: [{ ...props.useDataSources[0], ...{ fields: allSelectedFields.map(f => f.jimuName) } }] // I modify the first element of the array by using "...props.useDataSources[0]".
    })
  }

  const onToggleUseDataEnabled = (useDataSourcesEnabled: boolean) => { // Function to check if useDataSourcesEnabled is enabled or not.
    props.onSettingChange({
      id: props.id,
      useDataSourcesEnabled
    })
  }

  const onDataSourceChange = (useDataSources: UseDataSource[]) => { // Function to check when the user changes the selected data source.
    props.onSettingChange({
      id: props.id,
      useDataSources: useDataSources // Array of data sources obtained from useDataSources parameter.
    })
  }

  const onMapWidgetSelected = (useMapWidgetIds: string[]) => {
    props.onSettingChange({
      id: props.id,
      useMapWidgetIds: useMapWidgetIds
    });
  };

  return <div className="use-feature-layer-setting p-2">
    <DataSourceSelector // Create the user interface to select data sources.
      types={Immutable([AllDataSourceTypes.FeatureLayer])} // You can only select FeatureLayer data type.
      useDataSources={props.useDataSources}
      useDataSourcesEnabled={props.useDataSourcesEnabled} // Indicate if the data source is enabled or not.
      onToggleUseDataEnabled={onToggleUseDataEnabled}
      onChange={onDataSourceChange}
      widgetId={props.id}
    />
    {
      props.useDataSources && props.useDataSources.length > 0 && // If props.useDataSources exists and the lenght is greater than 0:
      <FieldSelector // To select the fields from the choosen data source.
        useDataSources={props.useDataSources}
        onChange={onFieldChange} // I change the field
        selectedFields={props.useDataSources[0].fields || Immutable([])}
      />
    }
    <MapWidgetSelector
      useMapWidgetIds={props.useMapWidgetIds}
      onSelect={onMapWidgetSelected}
    />
  </div>
}
