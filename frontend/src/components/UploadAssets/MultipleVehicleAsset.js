import React, {useState} from 'react';
import axios from 'axios'
import * as Vibrant from 'node-vibrant'
import {
    Button,
    FormControl,
    Grid,
    InputLabel,
    Radio,
    Select,
    TextField,
    Tooltip,
    Typography
} from '@material-ui/core';

import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';

import {palletes, rgbToHex} from '../../utils/utils';
import vehicleMap from '../../vehicle_mapping'

function MultipleVehicleAsset() {
    const [files, setFiles] = useState([]);
    const [fileBlobs, setFileBlobs] = useState([]);
    const [colors, setColors] = useState([]);

    console.log("Colors state::",colors);
    const handleMultipleUpload = event => {
        event.preventDefault();

    }

    const handleFiles = event => {

        const files = event.target.files
        const images = []
        console.log(files.length);
        for (let i = 0; i < files.length; i++) 
            images.push(files[i])

        

        console.log(images);
        setFiles(images);

        const imageBlobs = [];
        const hexCodes = [];

        images.map(image => {
            imageBlobs.push(URL.createObjectURL(image))

            Vibrant.from(URL.createObjectURL(image)).getPalette((err, palette) => {
                if (err) 
                    console.log(err)

                

                palletes.map(pallete => {

                    const red = Math.round(palette[pallete]._rgb[0])
                    const green = Math.round(palette[pallete]._rgb[1])
                    const blue = Math.round(palette[pallete]._rgb[2])
                    const hex = rgbToHex(red, green, blue);

                    hexCodes.push({name: image.name, hex});
                })
            })
        })


        console.log("Hex codes::", hexCodes)
        setFileBlobs(imageBlobs)
        setColors(hexCodes)

        // for(let j=0; j<hexCodes.length; j++){
        //     for(let k=j; )
        // }



    }

    return (<>
        <Typography variant="h5"
            style={
                {margin: '30px 0'}
        }>
            Upload multiple vehicle Assets
        </Typography>
        <form onSubmit={handleMultipleUpload}>
            <Grid container align="center" justify="center"
                spacing={4}>
                <Grid item
                    xs={12}>
                    <Button variant="contained" color="secondary" component="label">
                        <input type="file"
                            onChange={handleFiles}
                            required
                            multiple
                            hidden/>
                        Upload Images
                    </Button>

                </Grid>
                {
                files.map((file, key) => {
                    return (<>
                        <Grid item
                            sm={4}>
                            <img src={
                                    fileBlobs[key]
                                }
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
                                    margin: "10px 0"
                                }
                            }> {/* <Tooltip title="You need to re-upload the image" aria-label="re-upload">
                                <Button variant="outlined" color="secondary"
                                    >Change Image</Button>
                            </Tooltip> */}
                                <p>Select the closest color for the car:</p>
                            </div>
                            {colors.length}
                            { colors.length ? (<div style={
                                {margin: "5px auto"}
                            }> {
                                colors.map((color, index) => {
                                    // if (color.name == file.name) 
                                        return (<>
                                            <Radio value={
                                                    color.hex
                                                }
                                                name={
                                                    "color" + key
                                                }
                                                key={index}
                                                size="small"/>
                                            <span style={
                                                {
                                                    display: 'inline-block',
                                                    backgroundColor: color.hex,
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '5px',
                                                    marginBottom: -5
                                                }
                                            }></span>
                                        </>)
                                    
                                })
                            } </div>):null}
                         </Grid>
                        <Grid item
                            sm={8}
                            >
                            <div>
                                <TextField label="Asset Name EN"
                                    name={
                                        "assetNameEN" + key
                                    }
                                    fullWidth/>
                            </div>
                            <div>
                                <TextField label="Asset Name FR"
                                    name={
                                        "assetNameFR" + key
                                    }
                                    fullWidth/>
                            </div>
                            <div>
                            <FormControl fullWidth>
                                <InputLabel >Make</InputLabel>
                                <Select 
                                    // onChange={changeModel}
                                    required
                                    defaultValue=''
                                    name={"make"+key}>
                                    <option value="Buick">Buick</option>
                                    <option value="Cadillac">Cadillac</option>
                                    <option value="Chevrolet">Chevrolet</option>
                                    <option value="GMC">GMC</option>
                                </Select>
                            </FormControl>
                            </div>
                            <div>
                            <FormControl fullWidth>
                                <InputLabel >Model</InputLabel>
                                <Select 
                                    // onChange={changeModel}
                                    required
                                    defaultValue=''
                                    name={"model"+key}>
                                    {vehicleMap.map(model => 
                                            <option value={model.model}>{model.model}</option>
                                    )}
                                    {/* <option value="Buick">Buick</option>
                                    <option value="Cadillac">Cadillac</option>
                                    <option value="Chevrolet">Chevrolet</option>
                                    <option value="GMC">GMC</option> */}
                                </Select>
                            </FormControl>
                            </div>

                        </Grid>
                    </>)
                })
            } </Grid>
        </form>
    </>)
}

export default MultipleVehicleAsset;
