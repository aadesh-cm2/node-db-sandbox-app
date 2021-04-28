import React, { useState, useEffect } from 'react';
import axios from 'axios'

import auth from '../../auth/auth'

import { Tabs, Tab, AppBar } from '@material-ui/core'

function AssetList(newAsset) {

    useEffect(() => {
        fetchData();
    }, [newAsset]);

    const fetchData = () => {
        axios.get('http://localhost:5000/api/v1/assets/all', { auth })
            .then(res => {
                const vehicleData = res.data.data
                console.log(vehicleData);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const handleTabs = (e, val) => {
        console.log(val);
    }

    return (
        <div>
            <AppBar position="static">
                <Tabs onChange={handleTabs}>
                    <Tab label="Chevrolet" />
                    <Tab label="Buick" />
                    <Tab label="GMC" />
                    <Tab label="Cadillac" />
                </Tabs>
            </AppBar>
        </div>
    )
}

export default AssetList;