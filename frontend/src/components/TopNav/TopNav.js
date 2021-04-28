import React, {useState, useEffect} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {Divider, Drawer, List, ListItem, ListItemText} from '@material-ui/core';

function TopNav() {

    const [sidenav, setSidenav] = useState(false)

    return (<>
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu"
                    onClick={
                        () => setSidenav(true)
                }>
                    <MenuIcon/>
                </IconButton>
                <Typography variant="h6">
                    CM2 Asset Manager
                </Typography>
            </Toolbar>
            <Drawer open={sidenav}
                onClose={
                    () => setSidenav(false)
            }>
                <List>
                    <ListItem>
                        Vehicles
                    </ListItem>
                    <Divider />
                    <ListItem>
                        Upload Vehicle Assets
                    </ListItem>
                </List>
            </Drawer>
        </AppBar>
    </>)
}
export default TopNav;
