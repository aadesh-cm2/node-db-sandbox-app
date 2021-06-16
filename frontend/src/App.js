import React, { useState } from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Container from '@material-ui/core/Container';

import TopNav from './components/TopNav/TopNav';
import UploadVehicleAsset from './pages/UploadVehicleAsset/UploadVehicleAsset';
import VehicleList from './pages/VehicleList/VehicleList';

function App() {


    return (<div className="App">
        <Router>
            <TopNav />
            <Container style={{margin:'30px auto'}}>
                <Switch>
                    <Route exact path='/'
                        component={UploadVehicleAsset} />
                    <Route path='/vehicle'
                        component={VehicleList} />
                </Switch>
            </Container>
        </Router>
    </div>);
}

export default App;
