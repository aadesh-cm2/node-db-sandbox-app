import React, {useState} from 'react';
import axios from 'axios'
import * as Vibrant from 'node-vibrant'
import {
    Button,
    Grid,
    Typography,
    TextField,
    Select,
    InputLabel,
    FormControl,
    Tooltip,
    Checkbox,
    Chip
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import auth from '../../auth/auth'

import vehicleMap from '../../vehicle_mapping'

import './UploadVehicleAsset.css'

function UploadVehicleAsset() {
    const [file, setFile] = useState();
    const [fileBlob, setFileBlob] = useState();
    const [colors, setColors] = useState([]);
    const [modelList, setModelList] = useState(['', '']);
    const [modelType, setModelType] = useState();
    const [selectedColor, setSelectedColor] = useState();

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
        if (event.target.files[0]) {
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
    }
    const handleUpload = (event) => {
        event.preventDefault();
        console.log('Upload hit!')

        const form = event.currentTarget;

        if (!file) {
            alert("Upload a file!")
            return null;
        }

        if (! form.checkValidity && !modelType && !selectedColor) {
            alert('Fill out all the fields!')
            return null;
        }

        const data = new FormData()
        
        data.append("file", file)
        data.append("color", selectedColor)
        data.append("assetNameEN", form.elements.assetNameEN.value)
        data.append("assetNameFR", form.elements.assetNameFR.value)
        data.append("expiryDate", form.elements.expiryDate.value)
        data.append("primaryAsset", form.elements.primaryAsset.checked)

        for (var key in modelType) {
            data.append(key, modelType[key]);
        }

        console.log("Data", data);

        axios.post('http://localhost:5000/api/v1/assets', data, {auth}).then(res => {
            console.log(res.data)
            alert(res.data.message)
            // setNewAsset(res.data.result)
        }).catch(err => {
            console.log(err.response)
            alert(err.response.data.message)
        })
    }

    const changeModel = (event) => {
        switch (event.target.name) {
            case 'make':
                const model = vehicleMap.filter(vehicle => vehicle.make === event.target.value)
                setModelList(model);
                break;
            case 'model':
                const modelType = vehicleMap.filter(vehicle => vehicle.model === event.target.value)
                setModelType(modelType[0]);
                break;
        }
    }

    const clearImage = () => {
        setFileBlob(undefined)
        setFile(undefined)
        setColors([])
    }

    return (<>
        <Typography variant="h5"
            style={
                {margin: '30px 0'}
        }>
            Upload a vehicle Asset
        </Typography>
        <form onSubmit={handleUpload}>
            <Grid container
                spacing={4}>
                <Grid item
                    xs={2}>
                    <Button variant="contained" color="secondary" component="label">
                        <input type="file"
                            onChange={handleFile}
                            required
                            hidden/>
                        Upload Image
                    </Button>
                </Grid>
                <Grid item
                    xs={10}> {
                    fileBlob ? (<>
                        <img src={fileBlob}
                            style={
                                {
                                    maxWidth: "300px",
                                    padding: '10px',
                                    boxShadow: '0 .125rem .25rem rgba(0,0,0,.075)',
                                    display: 'block',
                                    margin: '0 auto'
                                }
                            }/>
                        <div style={
                            {
                                textAlign: "center",
                                margin: "20px 0"
                            }
                        }>
                            <Tooltip title="You need to re-upload the image" aria-label="re-upload">
                                <Button variant="outlined" color="secondary"
                                    onClick={clearImage}>Change Image</Button>
                            </Tooltip>
                            <p>Select the closest color for the car:</p>
                        </div>
                    </>) : null
                }
                    {
                    colors.length ? (<div style={
                        {
                            width: "490px",
                            margin: "15px auto"
                        }
                    }>
                        <ToggleButtonGroup exclusive
                            value={colors}
                            onChange={
                                (event, selectColor) => setSelectedColor(selectColor)
                        }> {
                            colors.map((color, key) => {
                                return (<ToggleButton key={key}
                                    style={
                                        {
                                            backgroundColor: color,
                                            margin: '0 10px',
                                            width: '50px',
                                            borderRadius: '5px',
                                            border: '2px solid',
                                            borderColor: selectedColor && selectedColor === color ? 'green' : 'transparent'
                                        }
                                    }
                                    value={color}>&nbsp;</ToggleButton>)
                            })
                        }
                            <ToggleButton style={
                                    {
                                        margin: '0 10px',
                                        width: '50px',
                                        borderRadius: '5px',
                                        borderRadius: '2px solid',
                                        borderColor: selectedColor && selectedColor === 'null' ? 'green' : 'grey'
                                    }
                                }
                                value="null">N/A</ToggleButton>
                        </ToggleButtonGroup>
                    </div>) : null
                } </Grid>
                <Grid item
                    xs={6}>
                    <TextField id="assetNameEN" label="Asset Name EN" name="assetNameEN" fullWidth/>
                </Grid>
                <Grid item
                    xs={6}>
                    <TextField id="assetNameFR" label="Asset Name FR" name="assetNameFR" required fullWidth/>
                </Grid>
                <Grid item
                    xs={6}>
                    <FormControl fullWidth>
                        <InputLabel id="make">Make</InputLabel>
                        <Select id="make"
                            onChange={changeModel}
                            required
                            defaultValue=''
                            name="make">
                            <option value="Buick">Buick</option>
                            <option value="Cadillac">Cadillac</option>
                            <option value="Chevrolet">Chevrolet</option>
                            <option value="GMC">GMC</option>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item
                    xs={6}>
                    <FormControl fullWidth>
                        <InputLabel id="model">Model</InputLabel>
                        <Select id="model"
                            onChange={changeModel}
                            required
                            defaultValue=''
                            name="model"> {
                            modelList ? modelList.map((model, key) => {
                                return <option value={
                                        model.model
                                    }
                                    key={key}> {
                                    model.model
                                }</option>
                        }) : null
                        } </Select>
                    </FormControl>
                </Grid>
                {
                modelType ? (<Grid item xs={12} container spacing={4}>
                    <Grid item>
                        <Typography variant="h6">
                            Model Type:
                            <span style={
                                {marginLeft: 10}
                            }>
                                <Chip label={
                                        modelType ? modelType.modelTypeEN : null
                                    }
                                    color="primary"/>
                            </span>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">
                            Sub Model Type:
                            <span style={
                                {marginLeft: 10}
                            }>
                                <Chip label={
                                        modelType ? modelType.modelTypeEN : null
                                    }
                                    color="secondary"/>
                            </span>
                        </Typography>
                    </Grid>
                </Grid>) : null
            } 
            <Grid item xs={6}>
            <Checkbox name="primaryAsset"
                        style={
                            {padding: 0, marginRight:10}
                        }
                        inputProps={
                            {'aria-label': 'primary checkbox'}
                        }/>
                    Primary asset for this vehicle
            </Grid>
            <Grid item xs={6}>
                <span style={{display:'block'}}>Expiry Date</span>
                <TextField type="date" id="expiryDate" name="expiryDate" style={{cursor:'pointer'}} />
            </Grid>
            </Grid>
            <div style={
                {margin: 20}
            }>
                <Button type="submit" color="primary" variant="contained" size="large">Upload</Button>
            </div>
        </form>
    </>)
}

export default UploadVehicleAsset;
