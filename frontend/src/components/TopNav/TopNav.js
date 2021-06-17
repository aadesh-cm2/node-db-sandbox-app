import React, {useState, useEffect} from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import {
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemText
} from '@material-ui/core';

import {Link} from 'react-router-dom';


function TopNav() {

    const [sidenav, setSidenav] = useState(false)

    const ListItemLink = (props) => {
        return (
            <ListItem button
                onClick={
                    () => setSidenav(false)
            }
                divider
            >

                <Link to={
                    props.to
                }>
                    {
                    props.text
                } </Link>
            </ListItem>
        );
    }


    return (
        <>
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
                        <Divider/>
                        <ListItemLink to="/" text="Upload Vehicle Assets"/>
                        <ListItemLink to="/vehicles" text="Vehicle List"/>
                    </List>
                </Drawer>
            </AppBar>
        </>
    )
}
export default TopNav;
