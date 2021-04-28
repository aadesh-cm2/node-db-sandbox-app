import React, {useState} from 'react';

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Container from '@material-ui/core/Container';

import TopNav from './components/TopNav/TopNav';
import UploadVehicleAsset from './pages/UploadVehicleAsset/UploadVehicleAsset';

function App() {


    return (<div className="App">
        <Router>
            <TopNav/>
            <Container>
                <Switch>
                    <Route exact path='/'
                        component={UploadVehicleAsset}/>
                </Switch>
            </Container>
        </Router>
    </div>);
}

export default App;
