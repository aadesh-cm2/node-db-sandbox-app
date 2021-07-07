import React, {useState} from 'react';
import {
    Tabs,
    Tab
} from '@material-ui/core';

import SingleVehicleAsset from '../../components/UploadAssets/SingleVehicleAsset';
import MultipleVehicleAsset from '../../components/UploadAssets/MultipleVehicleAsset';
import BulkVehicleAsset from '../../components/UploadAssets/BulkVehicleAsset';

function UploadVehicleAsset() {
    const [switchTab, setSwitchTab] = useState(0);

    

    return (<>
        <Tabs value={switchTab} onChange={(event, newValue) => setSwitchTab(newValue)}>
            <Tab label="Single" />
            <Tab label="Multiple" />
            <Tab label="Bulk" />
        </Tabs>
        {switchTab === 0 &&
            (
                <div>
                    <SingleVehicleAsset />
                </div>
            )}
            {switchTab === 1 && (
                <div>
                    <MultipleVehicleAsset />
                </div>

            )}
            {switchTab === 2 && (
                <div>
                    <BulkVehicleAsset />
                </div>

            )}
    </>)
}

export default UploadVehicleAsset;
