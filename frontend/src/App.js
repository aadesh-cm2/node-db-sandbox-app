import './App.css';
import React, { useState } from 'react';
import axios from 'axios'
import * as Vibrant from 'node-vibrant'
import vehicleMap from './vehicle_mapping'


function App() {

  const [file, setFile] = useState();
  const [fileBlob, setFileBlob] = useState();
  const [colors, setColors] = useState([]);
  const [modelList, setModelList] = useState();
  const [modelType, setModelType] = useState();

  const palletes = [
    "Vibrant",
    "Muted",
    "LightVibrant",
    "LightMuted",
    "DarkVibrant",
    "DarkMuted"
  ]

  const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')

  const handleFile = event => {
    console.log(event.target.files[0]);
    const hexCodes = [];

    setFile(event.target.files[0])
    setFileBlob(URL.createObjectURL(event.target.files[0]))

    Vibrant.from(URL.createObjectURL(event.target.files[0])).getPalette((err, palette) => {
      if (err)
        console.log(err)
      palletes.map(pallete => {

        const red = Math.round(palette[pallete]._rgb[0])
        const green = Math.round(palette[pallete]._rgb[1])
        const blue = Math.round(palette[pallete]._rgb[2])
        const hex = rgbToHex(red, green, blue);

        hexCodes.push(hex);
      })
      setColors(hexCodes);
      console.log(palette)
    })

  }
  const handleUpload = (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (!file) {
      alert("Upload a file!")
      return null;
    }

    if (!form.checkValidity && !modelType) {
      alert('Fill out all the fields!')
      return null;
    }

    const data = new FormData()

    data.append("file", file)
    data.append("data", modelType)

    console.log("Data", data);
    axios.post('http://localhost:5000/api/v1/assets', data, {
      auth: {
        username: 'admin',
        password: 'password'
      }
    })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const changeModel = (event) => {

    console.log(event.target.value);
    switch (event.target.name) {
      case 'make':
        const model = vehicleMap.filter(vehicle => vehicle.MAKE === event.target.value)
        setModelList(model);
        break;
      case 'model':
        const modelType = vehicleMap.filter(vehicle => vehicle.MODEL === event.target.value)
        console.log(modelType)
        setModelType(modelType[0]);
        break;
    }
  }

  return (<div className="App">
    <form onSubmit={handleUpload}>
      <input type="file"
        onChange={handleFile} required />
      {
        fileBlob ?
          (
            <>
              <img src={fileBlob} style={{ maxWidth: "200px", padding: '10px', boxShadow: '0 .125rem .25rem rgba(0,0,0,.075)', display: 'block', margin: '0 auto' }} />
              <div style={{ textAlign: "center" }}>
                Select the closest color for the car:
                </div>
            </>
          )
          : null
      }
      {
        colors.length ?
          (
            <div style={{ width: "275px", margin: "15px auto" }}>
              {colors.map(color => {
                return (
                  <div style={{ display: 'inline-block' }}>
                    <input type="radio" value={color} style={{ display: "inline-block" }} name="color" required />
                    <span style={{ display: "inline-block", width: "25px", height: "25px", background: color }}></span>
                  </div>
                )
              })
              }
            </div>
          )
          : null
      }
      <input type="text" placeholder="Asset Name..." />
      <label htmlFor="make">Select make:</label>
      <select name="make" id="make" onChange={changeModel} required>
        <option value=""></option>
        <option value="Buick">Buick</option>
        <option value="Cadillac">Cadillac</option>
        <option value="Chevrolet">Chevrolet</option>
        <option value="GMC">GMC</option>
      </select>
      <label htmlFor="make">Select Model:</label>
      <select name="model" id="model" onChange={changeModel} required>
        <option value=""></option>
        {
          modelList ?
            modelList.map(model => {
              return (
                <>
                  <option value={model.MODEL}>{model.MODEL}</option>
                </>
              )
            })
            :
            (
              <>
                <option value=""></option>
              </>
            )
        }
      </select>
            Model Type: {modelType ? modelType.MODEL_TYPE_EN : null}
      <br />
            Model Sub Type: {modelType ? modelType.MODEL_SUBTYPE_EN : null}
      <div>
        <button type="submit">Upload</button>
      </div>
    </form>
  </div>);
}

export default App;
