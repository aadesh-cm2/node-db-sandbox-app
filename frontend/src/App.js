import React, { useState } from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Container from '@material-ui/core/Container';

import TopNav from './components/TopNav/TopNav';
import UploadVehicleAsset from './pages/UploadVehicleAsset/UploadVehicleAsset';
import AssetList from './components/AssetList/AssetList';

function App() {


    return (<div className="App">
        <Router>
            <TopNav />
            <Container>
                <Switch>
                    <Route exact path='/'
                        component={UploadVehicleAsset} />
                    <Route path='/vehicle'
                        component={AssetList} />
                </Switch>
            </Container>
        </Router>
    </div>);
}

export default App;
