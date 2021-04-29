import React, { useState, useEffect } from 'react';
import axios from 'axios'

import auth from '../../auth/auth'

import { Tabs, Tab, AppBar, Grid, Paper, Typography, Divider, ButtonBase } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';


function AssetList(newAsset) {

    const [state, setState] = React.useState([])
    const [make, setMake] = useState('')


    useEffect(() => {
        fetchData();
    }, [newAsset], console.log(make));

    const fetchData = () => {
        axios.get('http://localhost:5000/api/v1/assets/all', { auth })
            .then(res => {
                setState(res.data.data)
            })

            .catch(err => {
                console.log(err);
            })
    }

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            margin: '2% auto',
            width: '100%'
        },
        image: {
            display: 'block',
            width: '20%',
            textAlign: 'center',
            minWidth: '20%',
            height: 'auto'
        },
        img: {
            width: '100%',
            height: 'auto',
            display: 'block'
        },
    }));

    const handleChange = (newValue) => {
        setMake(newValue)
    };

    const classes = useStyles();

    return (

        < div className={classes.root}>

            <AppBar position="static">
                <Tabs value={0}>
                    <Tab label="Chevrolet" onClick={() => handleChange('Chevrolet')} />
                    <Tab label="Buick" onClick={() => handleChange('Buick')} />
                    <Tab label="GMC" onClick={() => handleChange('GMC')} />
                    <Tab label="Cadillac" onClick={() => handleChange('Cadillac')} />
                </Tabs>
            </AppBar>

            {state.map((eachData) => {
                if (make === eachData.make) {
                    console.log(eachData);
                }
                return (

                    <ButtonBase key={eachData._id} className={classes.root}>
                        <Paper className={classes.paper} >
                            <Grid container spacing={1} >
                                <Grid item className={classes.image} >
                                    <img className="img-responsive" className={classes.img} alt="Vehicle Image" srcSet={`${eachData.imageURL}`} />
                                </Grid>
                                <Grid item xs={12} sm container>
                                    <Grid item xs container direction="column" spacing={2}>
                                        <Grid item xs style={{ padding: "0 5%" }}>
                                            <Typography color="primary" variant="h5">
                                                {eachData.metaData.modelYear} {eachData.make} {eachData.model}
                                            </Typography>
                                            <Typography color="textPrimary" variant="body1" align="left">
                                                Model Color :{eachData.metaData.color}  <span style={{ backgroundColor: `${eachData.metaData.color}`, height: '1rem', width: '4rem', display: 'inline-block' }}></span>
                                            </Typography>
                                            <Typography color="textPrimary" variant="body1" align="left">
                                                Expiry Data : {eachData.metaData.expiryDate}
                                            </Typography>
                                            <Typography color="textPrimary" variant="body1" align="left">
                                                Make Code : {eachData.metaData.makeCD}
                                            </Typography>
                                            <Typography color="textPrimary" variant="body1" align="left">
                                                Model Code : {eachData.metaData.modelCD}
                                            </Typography>
                                            <Typography color="textPrimary" variant="body1" align="left">
                                                Model Type : {eachData.metaData.modelTypeEN}
                                            </Typography>
                                            <Typography color="textPrimary" variant="body1" align="left">
                                                Model Subtype : {eachData.metaData.modelSubTypeEN}
                                            </Typography>
                                            <Typography color="textPrimary" variant="body1" align="left">
                                                Model Type French {eachData.metaData.modelTypeFR}
                                            </Typography>
                                            <Typography color="textPrimary" variant="body1" align="left">
                                                Model Year : {eachData.metaData.modelYear}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Divider />
                            </Grid>
                        </Paper>
                    </ButtonBase>
                )

            })}

        </div >
    )
}

export default AssetList;