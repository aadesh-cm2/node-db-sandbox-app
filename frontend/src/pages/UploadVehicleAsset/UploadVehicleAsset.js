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
    Chip,
    Tabs,
    Tab
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import auth from '../../auth/auth'

import vehicleMap from '../../vehicle_mapping'
import SingleVehicleAsset from '../../components/UploadAssets/SingleVehicleAsset';
import MultipleVehicleAsset from '../../components/UploadAssets/MultipleVehicleAsset';

function UploadVehicleAsset() {
    const [file, setFile] = useState();
    const [fileBlob, setFileBlob] = useState();
    const [colors, setColors] = useState([]);
    const [modelList, setModelList] = useState(['', '']);
    const [modelType, setModelType] = useState();
    const [selectedColor, setSelectedColor] = useState();
    const [switchTab, setSwitchTab] = useState(0);

    

    return (<>
        <Tabs value={switchTab} onChange={(event, newValue) => setSwitchTab(newValue)}>
            <Tab label="Single" />
            <Tab label="Multiple" />
        </Tabs>
        {switchTab === 0 ?
            (
                <div>
                    <SingleVehicleAsset />
                </div>
            )
            : (
                <div>
                    <MultipleVehicleAsset />
                </div>

            )
        }
    </>)
}

export default UploadVehicleAsset;
