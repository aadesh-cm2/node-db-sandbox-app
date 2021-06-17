import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {
    Card,
    Grid,
    ListItem,
    ListItemAvatar,
    Avatar,
    Paper,
    ListItemText,
    Typography,
    Chip,
    Box,
    ListItemSecondaryAction,
    IconButton 
} from '@material-ui/core';
import {Skeleton} from '@material-ui/lab';
import EditIcon from '@material-ui/icons/Edit';

import auth from '../../auth/auth';

import './VehicleList.css';

const VehicleList = () => {

    const [vehicles, setVehicles] = useState();
    const [make, setMake] = useState(1);

    useEffect(() => {
        fetchData({
            metaData: {
                makeCD: make
            }
        });
    }, [make]);

    const makeMeta = [
        {
            name: 'Chevrolet',
            code: 1,
            logo: process.env.PUBLIC_URL + '/Chevrolet.png'
        }, {
            name: 'GMC',
            code: 10,
            logo: process.env.PUBLIC_URL + '/GMC.png'
        }, {
            name: 'Cadillac',
            code: 6,
            logo: process.env.PUBLIC_URL + '/Cadillac.png'
        }, {
            name: 'Buick',
            code: 4,
            logo: process.env.PUBLIC_URL + '/Buick.png'
        },
    ]

    const fetchData = (data) => {
        console.log(data)
        axios.post('http://localhost:5000/api/v1/assets/all', data, {
            auth
        },).then(res => {
            console.log(res.data.data)
            setVehicles(res.data.data)

        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <>
            <Grid container
                spacing={3}
                alignContent="center">
                {
                makeMeta.map((brand, index) => (
                    <Grid item
                        xs={6}
                        md={3}
                        key={index}>
                        <Card onClick={
                                () => setMake(brand.code)
                            }
                            style={
                                {
                                    backgroundColor: brand.code === make ? '#eee' : '#fff'
                                }
                        }>
                            <img src={
                                    brand.logo
                                }
                                alt={
                                    brand.name
                                }/>
                        </Card>
                    </Grid>
                ))
            } </Grid>
            <Grid container
                spacing={4}
                direction="column">
                {
                vehicles ? vehicles.map((vehicle, index) => {
                    if (make === Number(vehicle.metaData.makeCD)) 
                        return (
                            <Grid item
                                key={index}>
                                <Paper elevation={2}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar src={
                                                    vehicle.imageURL
                                                }
                                                alt={
                                                    vehicle.assetName.assetNameEN
                                                }
                                                style={
                                                    {
                                                        width: 80,
                                                        height: 80,
                                                        border: "1px solid #eee",
                                                        marginRight: 30
                                                    }
                                                }/>
                                        </ListItemAvatar>
                                        <ListItemText>
                                            <Grid container >
                                                <Grid item>
                                                    <Typography variant="h5">
                                                        {
                                                        vehicle.assetName.assetNameEN
                                                    } </Typography>
                                                    <Typography variant="h6">
                                                        {
                                                        vehicle.metaData.modelYear
                                                    } {
                                                        vehicle.model
                                                    } </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Box>
                                                        <Chip label={
                                                                vehicle.metaData.modelTypeEN
                                                            }
                                                            variant="outlined"/> {
                                                        vehicle.metaData.modelSubTypeEN ? <Chip label={
                                                                vehicle.metaData.modelSubTypeEN
                                                            }
                                                            variant="outlined"
                                                            style={
                                                                {marginLeft: 10}
                                                            }/> : null
                                                    } </Box>

                                                </Grid>
                                                <Grid item>
                                                    <Box style={
                                                        {marginTop: 20}
                                                    }>
                                                        Color:
                                                        <span style={
                                                            {
                                                                width: 20,
                                                                height: 20,
                                                                marginLeft: 10,
                                                                marginBottom: -3,
                                                                backgroundColor: vehicle.metaData.color,
                                                                display: 'inline-block'
                                                            }
                                                        }></span>
                                                    </Box>

                                                </Grid>
                                            </Grid>

                                        </ListItemText>
                                        <ListItemSecondaryAction>
                                            <IconButton >
                                                <EditIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </Paper>
                            </Grid>
                        )

                    

                }) : (
                    <Grid item>
                        <Paper>
                            <ListItem>
                                <ListItemAvatar>
                                    <Skeleton variant="circle"
                                        width={80}
                                        height={80}
                                        style={
                                            {marginRight: 30}
                                        }/>
                                </ListItemAvatar>
                                <ListItemText>
                                    <Skeleton variant="rect"/>
                                </ListItemText>
                            </ListItem>
                        </Paper>
                    </Grid>
                )
            } </Grid>
        </>
    )
}

export default VehicleList;
