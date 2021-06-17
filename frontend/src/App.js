import React, { useState } from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Container from '@material-ui/core/Container';

import TopNav from './components/TopNav/TopNav';
import UploadVehicleAsset from './pages/UploadVehicleAsset/UploadVehicleAsset';
import VehicleList from './pages/VehicleList/VehicleList';
import EditVehicleAsset from './pages/EditVehicleAsset/EditVehicleAsset';

function App() {


    return (<div className="App">
        <Router>
            <TopNav />
            <Container style={{margin:'30px auto'}}>
                <Switch>
                    <Route exact path='/'
                        component={UploadVehicleAsset} />
                    <Route path='/vehicles'
                        component={VehicleList} />
                    <Route path='/vehicle/edit/:id'
                        component={EditVehicleAsset} />
                </Switch>
            </Container>
        </Router>
    </div>);
}

export default App;
