import React, {useState} from 'react';
import axios from 'axios'
import {
    Button,
    FormControl,
    Grid,
    InputLabel,
    Select,
    TextField,
    Typography,
    Box
} from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';

import auth from '../../auth/auth'
import vehicleMap from '../../vehicle_mapping'
import MultipleUploadButton from '../MultipleUploadButton/MultipleUploadButton';

export default function BulkVehicleAsset() {
    const [files, setFiles] = useState([]);
    const [fileBlobs, setFileBlobs] = useState([]);

    const handleUpload = event => {
        event.preventDefault();

        if(!files.length){
            toast.error("Images not uploaded!")
            return null;
        }

        if(files.length>10){
            toast.error("Only 10 images allowed at a time!")
            return null;
        }

        const form = event.currentTarget;
        
        if(!form.checkValidity){
            toast.error("Images not uploaded!")
            return null;
        }

        let assetNameEN = form.elements.assetNameEN.value,
            assetNameFR = form.elements.assetNameFR.value,
            make = form.elements.make.value,
            model = form.elements.model.value,
            modelYear = form.elements.year.value;

        let filteredVehicle = vehicleMap.filter(vehicle => vehicle.make===make && vehicle.model === model)

        if(!filteredVehicle.length){
            toast.error("Vehicle Make and Model don't match")
            return null;
        }

        // Configuring Bulk Asset Config
        filteredVehicle = filteredVehicle[0];
        filteredVehicle.modelYear = Number(modelYear)

        console.log(filteredVehicle)
        console.log(files)

        const data = new FormData()
        files.map(file => {
            data.append("files", file)
        })
        data.append("assetNameEN", assetNameEN)
        data.append("assetNameFR", assetNameFR)

        for (var key in filteredVehicle) {
            data.append(key, filteredVehicle[key]);
        }

        axios.post('http://localhost:5000/api/v1/assets/bulk', data, {auth}).then(res => {
            console.log(res.data)
            toast.dark(res.data.message)
            // setNewAsset(res.data.result)
        }).catch(err => {
            console.log(err.response)
            toast.error(err.response.data ? err.response.data.message : "Something went wrong, try again!")
        })
    }

    return (
        <>
        <ToastContainer />
            <Typography variant="h5"
                style={
                    {margin: '30px 0'}
            }>
                Bulk Upload Assets for single Vehicle
            </Typography>
            <form onSubmit={handleUpload}>
                <Grid container alignItems="center"
                    spacing={4}>
                    <Grid item
                        xs={12}>
                        <MultipleUploadButton setFileBlobs={setFileBlobs}
                            setFiles={setFiles}
                            images={files}/>
                    </Grid>
                    {
                    files && files.length ? (
                        <>
                            <Grid item xs ={12} container>
                                {
                                files.map((file, key) => {
                                    return (
                                        <Grid item
                                            xs={6}
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
                                        </Grid>
                                    )
                                })
                            } </Grid>
                            <Grid item
                                xs={10}>
                                <Box my={1}>
                                    <TextField label="Asset Name EN" name="assetNameEN" fullWidth required/>
                                </Box>
                                <Box my={1}>
                                    <TextField label="Asset Name FR" name="assetNameFR" fullWidth required/>
                                </Box>
                                <Box my={1}>
                                    <FormControl fullWidth>
                                        <InputLabel>Make</InputLabel>
                                        <Select 
                                            required
                                            defaultValue=''
                                            name="make"
                                        >
                                            <option value="Buick">Buick</option>
                                            <option value="Cadillac">Cadillac</option>
                                            <option value="Chevrolet">Chevrolet</option>
                                            <option value="GMC">GMC</option>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box my={1}>
                                    <FormControl fullWidth>
                                        <InputLabel>Model</InputLabel>
                                        <Select // onChange={changeModel}
                                            required
                                            defaultValue=''
                                            name="model"
                                        >
                                            {
                                            vehicleMap.map(model => <option value={
                                                model.model
                                            }>
                                                {
                                                model.model
                                            }</option>)
                                        } </Select>
                                    </FormControl>
                                </Box>
                                <Box my={1}>
                                    <FormControl fullWidth>
                                        <InputLabel>Year</InputLabel>
                                        <Select 
                                            required
                                            defaultValue=''
                                            name="year"
                                        >
                                            <option value="2019">2019</option>
                                            <option value="2020">2020</option>
                                            <option value="2021">2021</option>
                                            <option value="2022">2022</option>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid xs={12}>
                                <Button variant="contained" type="submit">
                                    Bulk Upload
                                </Button>
                            </Grid>
                        </>
                    ) : null
                } </Grid>
            </form>
        </>
    )
}
