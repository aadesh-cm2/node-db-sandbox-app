import React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import TopNav from './components/TopNav/TopNav';
import UploadVehicleAsset from './pages/UploadVehicleAsset/UploadVehicleAsset';
import VehicleList from './pages/VehicleList/VehicleList';
import EditVehicleAsset from './pages/EditVehicleAsset/EditVehicleAsset';
import './App.css'

function App() {


    const theme = createMuiTheme({
        palette: {
          primary: {
            main: '#000',
          },
          secondary: {
              main: '#be3633'
          }
        },
      });

    return (<div className="App">
    <ThemeProvider theme={theme}>
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
        </ThemeProvider>
    </div>);
}

export default App;
