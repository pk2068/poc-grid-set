import { useEffect, useState, useRef } from 'react'
import axios from 'axios';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//import { ColumnDirective, ColumnsDirective, GridComponent, Inject, RowSelectEventArgs } from '@syncfusion/ej2-react-grids'
import {
  GridComponent,
  ColumnDirective,
  ColumnsDirective,
  Inject,
  Filter,
  FilterSettingsModel,
  SelectionSettingsModel,
  Sort,
  Resize,
  VirtualScroll,
  InfiniteScroll,
  Search,
  Toolbar,
  RowSelectEventArgs,
  RowDeselectEventArgs,
} from '@syncfusion/ej2-react-grids';
import _data from "./photos.json";
import { registerLicense } from '@syncfusion/ej2-base';
//import _ from 'lodash';
import _ from 'lodash';
import { Spinner } from '@fluentui/react';
import { Label } from '@fluentui/react/lib/Label'
import { DefaultButton } from '@fluentui/react/lib/Button'

registerLicense('Mgo+DSMBaFt+QHFqVkNrXVNbdV5dVGpAd0N3RGlcdlR1fUUmHVdTRHRcQlliQX5Wd0ZnWn5fcXE=;Mgo+DSMBPh8sVXJ1S0d+X1RPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXpSfkVmWHxac3VWRWU=;ORg4AjUWIQA/Gnt2VFhhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5Xd01jXH5ddHdUQmhZ;MTc1OTYyOEAzMjMxMmUzMTJlMzMzNUx4RHlZU21hNEw5K3V4eXpDaWlKUEV6a2lHTzcxUVpFYXFVNEdpYXd5eGs9;MTc1OTYyOUAzMjMxMmUzMTJlMzMzNUlvTDg5VE8vSE11SlhuNVN1dkJwd3VBUzZyRDJxbWZnY3ZOcTVZR3ZOWDg9;NRAiBiAaIQQuGjN/V0d+XU9Hc1RDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS31TckRrWXpfc3BWRGJaVA==;MTc1OTYzMUAzMjMxMmUzMTJlMzMzNWFxTFBPc3NPb3dLNjdnVXRQcWU3L3gzN0lacFVXNEszY2tQUHdKK3lLSlk9;MTc1OTYzMkAzMjMxMmUzMTJlMzMzNVdFNGMyY2tCVVVWRVlHaVVrMTFGdFc2RDlaUVNOY0ZMRFZSNlk3YitCMW89;Mgo+DSMBMAY9C3t2VFhhQlJBfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5Xd01jXH5ddHdXT2hZ;MTc1OTYzNEAzMjMxMmUzMTJlMzMzNU11cmozVGZNbTRXL3pVSEt3M2p0RHY3dzBQeFJSRllvQTNWSnNkaHVxVUk9;MTc1OTYzNUAzMjMxMmUzMTJlMzMzNWczc2lCSGxBeks5NVlDK2tMZmRpNXliVEErSEtCYVlBNHRpWk1nZitNNk09;MTc1OTYzNkAzMjMxMmUzMTJlMzMzNWFxTFBPc3NPb3dLNjdnVXRQcWU3L3gzN0lacFVXNEszY2tQUHdKK3lLSlk9');

interface IData {
  id: number,
  albumId: number,
  title: string,
  url: string,
  thumbnailUrl: string
}

function App() {
  //const [count, setCount] = useState(0)
  const [dataState, setDataState] = useState<IData[]>([]);
  const [selectedRow, setSelectedRow] = useState<IData>();
  const [refreshRequested, setRefreshRequested] = useState(false);
  const [StageState, setStageState] = useState(0); // 0 - First Render,  1 - Initial State with static data , 2 - Loading additional Data, 3 Completed Data

  //const [data,setData] = useState<IData[]>([]);
  const myGridRef = useRef<GridComponent | null>(null);
  let data: IData[] = []

  useEffect(() => {
    initiateData();
    setStageState(1)

    return (() => {
      //const bck = _.pullAll(data, [...data]);
      data = [];
      //debugger;
    })
  }, [])

  useEffect(() => {
    if (refreshRequested) {
      setStageState(1)

      for (const property in dataState) {
        console.log(dataState.pop());
      }

      console.log("is dataState now empy?", dataState);

      initiateData();
      setRefreshRequested(false);
    }

  }, [refreshRequested])

  useEffect(() => {
    console.log("%c useEffect by dataState", 'background:lightGreen;color:yellow', dataState);
  }, [dataState])

  const initiateData = (): void => {

    console.count("initiateData");
    if (_.isArray(_data)) {
      console.log("_data ", _data);
      _data.forEach((_d: any) => {
        const record: IData = { id: _d.id, albumId: _d.albumId, title: _d.title, url: "", thumbnailUrl: "" };
        data.push(record);
        console.log("record pushed", data);
      })

      console.log("call setDataState", data);
      setDataState(data);
      if (myGridRef.current) {
        myGridRef.current.refresh();
        //myGridRef.current.refreshColumns();
      }

    }
  }

  const updateDataWithSetState = (existingArray: IData[]): void => {
    const newState: IData[] = []
    let iteration = 0;
    setStageState(2);


    existingArray.forEach(async (request: IData, index: number) => {

      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/photos', {
          params: {
            id: request.id,
            albumId: request.albumId
          }
        });

        //debugger;
        console.log(response.data);
        newState.push(response.data[0] as IData);
        iteration++;

        if (newState.length === existingArray.length || iteration === existingArray.length) // we have all the data
        {
          //debugger;
          setStageState(3);
          console.log("will set state with", newState);
          setDataState(newState)
        }
      }
      catch (error) {
        console.error(error);
      }

      //}


    }) // end of forEach
  }

  const updateDataWithSetCellValue = (existingArray: IData[]): void => {
    const newState: IData[] = []
    let iteration = 0;
    setStageState(2);


    existingArray.forEach(async (request: IData, index: number) => {

      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/photos', {
          params: {
            id: request.id,
            albumId: request.albumId
          }
        });

        const randomNum = _.random(50, 5000);
      console.log(randomNum);

      setTimeout(() => {
        //debugger;
        console.log(response.data);
        const newObject = (response.data[0] as IData);
        iteration++;

        if (myGridRef.current) {
          myGridRef.current.setCellValue(newObject.id, "thumbnailUrl", newObject.thumbnailUrl)
          //myGridRef.current.setCellValue(newObject.id, "url", newObject.url) // MUST COMMENT OUT OR NODE EXCEPTION
        }

        if (newState.length === existingArray.length || iteration === existingArray.length) // we have all the data
        {
          //debugger;
          setStageState(3);
          console.log("what is now dataState", dataState);
          if (myGridRef.current) {
            myGridRef.current.refresh();
            const ds = myGridRef.current.dataSource as IData[];
            console.log("ds", ds);
          }

        }
      }, randomNum);
      }
      catch (error) {
        console.error(error);
      }

      //}


    }) // end of forEach
  }

  const updateDataWithUpdateRecord = (existingArray: IData[]): void => {
    const newState: IData[] = []
    let iteration = 0;
    setStageState(2);


    existingArray.forEach(async (request: IData, index: number) => {

      const randomNum = _.random(50, 5000);
      console.log(randomNum);

      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/photos', {
          params: {
            id: request.id,
            albumId: request.albumId
          }
        });

        setTimeout(() => {

          console.log(response.data);
          const newObject = (response.data[0] as IData);
          iteration++;

          if (myGridRef.current) {
            const index = myGridRef.current.getRowIndexByPrimaryKey(newObject.id);
            console.log(`updating row[${index}] with newObject`, newObject);
            //myGridRef.current.updateRow(index, newObject);
            myGridRef.current.updateRowValue(newObject.id, newObject)
            //myGridRef.current.refresh();
          }

          if (newState.length === existingArray.length || iteration === existingArray.length) // we have all the data
          {
            //debugger;
            setStageState(3);
            console.log("lets see what the state is", dataState, myGridRef.current?.currentViewData);

          }

        }, randomNum);
        //debugger;



      }
      catch (error) {
        console.error(error);
      }

      //}


    }) // end of forEach
  }

  const listData = () => {
    //return <Label>List of dataState:</Label>
    console.log("listData", dataState)

    return (
      <ul>
        {dataState.map((item: IData, index: number) =>
          (<li key={index}>{item.id} {item.albumId}  {item.title} # {item.url} # {item.thumbnailUrl}</li>)
        )
        }
      </ul>
    )

  }

  const rowSelectedHandler = (event: RowSelectEventArgs) => {
    console.log('************* rowSelectedHandler Event *************', event);
    if (event.data && _.isEmpty(event.data) === false) {

      const selectedRecord = event.data as IData;
      setSelectedRow(selectedRecord);
    }
  }

  const spinnerTemplate = (args: IData) => {
    if (args.url === "")
      return <Spinner labelPosition='right' label='Loading ...' />
    else return <Label>{args.url}</Label>
  }

  const filterOptions: FilterSettingsModel = {
    mode: 'Immediate',
    ignoreAccent: true,
    showFilterBarOperator: true,
    type: 'Menu',
  };

  const toolbarOptions = ['Search'];
  const settings: SelectionSettingsModel = { type: 'Single', mode: 'Row' };

  console.log("%c RENDER", 'background:green;color:yellow', dataState)
  return (
    <div className="App" style={{ background: 'yellow' }}>

      <div className='CommandRow'>
        <DefaultButton onClick={(e) => { setRefreshRequested(true) }}>Refresh</DefaultButton>

        <DefaultButton onClick={(e) => { updateDataWithSetState(dataState) }}>Update with SetState[newData]</DefaultButton>

        <DefaultButton onClick={(e) => { updateDataWithSetCellValue(dataState) }}>Update with CellValues</DefaultButton>

        <DefaultButton onClick={(e) => { updateDataWithUpdateRecord(dataState) }}>Update with updateRecord</DefaultButton>

        <Label>Stage : {StageState}</Label>
      </div>



      <GridComponent
        name='gridComponent'
        ref={myGridRef}
        dataSource={dataState}
        // enableInfiniteScrolling={false}
        // delayUpdate={false}
        rowHeight={32}
        enableVirtualization={false}
        enableHeaderFocus={false}
        allowSelection={true}
        allowFiltering={true}
        allowPaging={false}
        height={700}
        width={1200}
        allowResizing={true}
        allowReordering={false}
        allowSorting={true}
        allowGrouping={false}
        filterSettings={filterOptions}
        selectionSettings={settings}
        toolbar={toolbarOptions}
        rowSelected={rowSelectedHandler}
      >
        <ColumnsDirective>
          <ColumnDirective field='id' headerText='Id' width='120' textAlign='Center' isPrimaryKey={true}></ColumnDirective>
          <ColumnDirective field='albumId' headerText='Album Id' width='120' textAlign='Center'></ColumnDirective>
          <ColumnDirective field='title' headerText='Title' width='320'></ColumnDirective>
          <ColumnDirective field='url' headerText='Url' width='320' template={spinnerTemplate} ></ColumnDirective>
          <ColumnDirective field='thumbnailUrl' headerText='Thumb' width='320'></ColumnDirective>
        </ColumnsDirective>
        <Inject services={[Filter, Sort, VirtualScroll, Resize, InfiniteScroll, Search, Toolbar]} />
      </GridComponent>

      <Label>DataSource records: {dataState.length}</Label>

      {listData()}

    </div>
  )
}

export default App
