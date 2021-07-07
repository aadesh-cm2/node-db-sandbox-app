import React, {useState} from 'react';
import * as Vibrant from 'node-vibrant'
import {
    Button,
    FormControl,
    Grid,
    InputLabel,
    Radio,
    Select,
    TextField,
    Typography
} from '@material-ui/core';

import MultipleUploadButton from '../MultipleUploadButton/MultipleUploadButton';
import {palletes, rgbToHex} from '../../utils/utils';
import vehicleMap from '../../vehicle_mapping'

function MultipleVehicleAsset() {
    const [files, setFiles] = useState([]);
    const [fileBlobs, setFileBlobs] = useState([]);

    //console.log("Colors state::",colors);
    const handleMultipleUpload = event => {
        event.preventDefault();

    }

    return (<>
        <Typography variant="h5"
            style={
                {margin: '30px 0'}
        }>
            Upload multiple vehicle Assets
        </Typography>
        <form onSubmit={handleMultipleUpload}>
            <Grid container alignItems="center"
                spacing={4}>
                <Grid item
                    xs={12}>
                        <MultipleUploadButton setFiles={setFiles} setFileBlobs={setFileBlobs} images={files} />

                </Grid>
                {
                files.map((file, key) => {
                    return (<>
                        <Grid item xs={6}
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
                            {/* <div style={
                                {
                                    textAlign: "center",
                                    margin: "10px 0"
                                }
                            }>  */}
                            {/* <Tooltip title="You need to re-upload the image" aria-label="re-upload">
                                <Button variant="outlined" color="secondary"
                                    >Change Image</Button>
                            </Tooltip> */}
                                {/* <p>Select the closest color for the car:</p>
                            </div> */}
                            {/* { colors.length ? (<div style={
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
                            } </div>):null} */}
                         </Grid>
                        <Grid item xs={6}
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
