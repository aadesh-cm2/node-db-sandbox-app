import React, {useState, useEffect} from 'react';
import axios from 'axios'

import auth from '../../auth/auth'

function AssetList(newAsset) {

    useEffect(() => {
        fetchData();
      }, [newAsset]);

    const fetchData = () => {
        axios.get('http://localhost:5000/api/v1/assets/all', { auth })
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        })
    }

    return(
        <>
        </>
    )
}

export default AssetList;