import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link, useParams} from "react-router-dom";
import {
    Box,
    Button,
    Divider,
    Grid,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    Checkbox
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {SketchPicker, BlockPicker, ChromePicker} from 'react-color';

import {toast, ToastContainer} from "react-toastify";

import auth from "../../auth/auth";
import Loading from "../../components/Loading/Loading";
import vehicleMap from '../../vehicle_mapping'

import './EditVehicleAsset.css'

const EditVehicleAsset = () => {

    const [vehicleData, setVehicleData] = useState();
    const [newImage, setNewImage] = useState();
    const [newImageBlob, setNewImageBlob] = useState();
    const [colorPicker, setColorPicker] = useState({open: false, color: "#9f1e1e"})

    let {id} = useParams();

    useEffect(() => {
        fetchData(id);
    }, []);

    const fetchData = (id) => {
        axios.get("http://localhost:5000/api/v1/assets/vehicle/" + id, {auth}).then((result) => {
            console.log(result.data.data);
            setVehicleData(result.data.data)

            if(typeof result.data.data.metaData.color=="string")
            //console.log(typeof result.data.data.metaData.color)
                setColorPicker({open:false,color:result.data.data.metaData.color})
        }).catch((err) => {
            console.log(err);
            toast.error(err.data)
        });
    };

    const updateAsset = event => {
        event.preventDefault();

        const form = event.currentTarget;

        const data = new FormData()

            let assetNameEN = form.elements.assetNameEN.value,
                assetNameFR = form.elements.assetNameFR.value,
                make = form.elements.make.value,
                model = form.elements.model.value,
                modelYear = form.elements.year.value,
                primary = form.elements.primaryAsset.checked;

            let asset = {
                assetName: {
                    assetNameEN,
                    assetNameFR
                },
                make,
                model,
                primary,
                metaData: {
                    modelYear
                }
            }
            console.log("Asset:::", asset)
            asset = JSON.stringify(asset);

            if (newImage && newImageBlob) 
                data.append('file', newImage)

            

            data.append("asset", asset)
            axios.put('http://localhost:5000/api/v1/assets/vehicle/' + id, data, {auth}).then(response => {
                console.log("Response:::", response)
                toast(response.data.message)
            }).catch(err => {
                console.log("API ERROR::", err)
                toast.error(err.response.data.message)
            })
        }

        const handleFile = event => {
            if (event.target.files[0]) {
                console.log(event.target.files[0]);
                setNewImage(event.target.files[0])
                setNewImageBlob(URL.createObjectURL(event.target.files[0]))
            }
        }

        return (
            <>
                <ToastContainer/>
                <Box py={2}>
                    <Link to="/vehicles">
                        <Button variant="outlined" color="secondary"
                            startIcon={<ArrowBackIcon/>}>
                            Back
                        </Button>
                    </Link>
                </Box>
                <Divider/>
                <Box py={2}>
                    <Typography variant="h5">Edit an Asset</Typography>
                </Box>
                <Box p={2}>
                    <form onSubmit={updateAsset}>
                        {
                        vehicleData ? (
                            <Grid container
                                spacing={5}>
                                <Grid item
                                    xs={12}
                                    sm={6}>
                                    <Box className="exiting-image">
                                        <img src={
                                                vehicleData.imageURL
                                            }
                                            alt={
                                                vehicleData.assetName.assetNameEN
                                            }/>
                                        <Box className={
                                            newImageBlob && "img-overlay"
                                        }/>
                                    </Box>
                                </Grid>
                                <Grid item
                                    xs={12}
                                    sm={6}>
                                    {
                                    newImageBlob ? <img src={newImageBlob}
                                        alt="New image"/> : null
                                } </Grid>
                                <Grid item
                                    xs={12}
                                    sm={6}>
                                    <Button variant="contained" color="primary" component="label">
                                        <input type="file"
                                            onChange={handleFile}
                                            hidden/>
                                        Change Image
                                    </Button>

                                </Grid>
                                <Grid item
                                    xs={12}
                                    sm={6}>
                                    {
                                    newImageBlob ? <Button variant="contained" color="secondary"
                                        onClick={
                                            () => {
                                                setNewImage(undefined);
                                                setNewImageBlob(undefined)
                                            }
                                    }>
                                        Cancel
                                    </Button> : null
                                } </Grid>
                                <Grid item
                                    xs={12}
                                    sm={6}>
                                    <TextField id="assetNameEN" label="Asset Name EN" name="assetNameEN" required fullWidth
                                        defaultValue={
                                            vehicleData.assetName.assetNameEN
                                        }/>
                                </Grid>
                                <Grid item
                                    xs={12}
                                    sm={6}>
                                    <TextField id="assetNameFR" label="Asset Name FR" name="assetNameFR" required fullWidth
                                        defaultValue={
                                            vehicleData.assetName.assetNameFR
                                        }/>
                                </Grid>
                                <Grid item
                                    xs={12}
                                    sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="make">Make</InputLabel>
                                        <Select id="make" required
                                            defaultValue={
                                                vehicleData.make
                                            }
                                            name="make">
                                            <option value="Buick">Buick</option>
                                            <option value="Cadillac">Cadillac</option>
                                            <option value="Chevrolet">Chevrolet</option>
                                            <option value="GMC">GMC</option>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item
                                    xs={12}
                                    sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="model">Model</InputLabel>
                                        <Select id="model" required
                                            defaultValue={
                                                vehicleData.model
                                            }
                                            name="model">
                                            {
                                            vehicleMap.map((model, key) => {
                                                return <option value={
                                                        model.model
                                                    }
                                                    key={key}>
                                                    {
                                                    model.model
                                                }</option>
                                        })
                                        } </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item
                                    xs={12}
                                    sm={6}>

                                    <FormControl fullWidth>
                                        <InputLabel>Year</InputLabel>
                                        <Select required
                                            defaultValue={
                                                vehicleData.metaData.modelYear
                                            }
                                            name="year">
                                            <option value="2019">2019</option>
                                            <option value="2020">2020</option>
                                            <option value="2021">2021</option>
                                            <option value="2022">2022</option>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid container item
                                    xs={12}
                                    sm={6}
                                    alignItems="center"
                                    spacing={3}>
                                    <Grid item>
                                        <Checkbox defaultChecked={
                                                vehicleData.primary
                                            }
                                            name="primaryAsset"/>
                                        Primary Asset
                                    </Grid>
                                    <Grid item>
                                        Color:
                                        <span style={
                                                {
                                                    width: 40,
                                                    height: 20,
                                                    border: '1px solid',
                                                    display: 'inline-block',
                                                    marginLeft: 20,
                                                    cursor: 'pointer',
                                                    backgroundColor: colorPicker.color
                                                }
                                            }
                                            onClick={
                                                () => setColorPicker({
                                                    ...colorPicker,
                                                    open: !colorPicker.open
                                                })
                                        }></span>
                                        {
                                        colorPicker.open && <Box style={
                                            {position: 'absolute'}
                                        }><ChromePicker onChange={
                                                    (color) => console.log(color)
                                                }
                                                color={
                                                    colorPicker.color
                                                }/></Box>
                                    } </Grid>
                                </Grid>
                                <Grid item
                                    xs={12}>
                                    <Button variant="contained" color="primary" type="submit" size="large">Update</Button>
                                </Grid>
                            </Grid>

                        ) : <Loading/>
                    } </form>
                </Box>
            </>
        );
    };

    export default EditVehicleAsset;
