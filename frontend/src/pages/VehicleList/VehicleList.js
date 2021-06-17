import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Grid,
  ListItem,
  ListItemAvatar,
  Avatar,
  Paper,
  ListItemText,
  Typography,
  Chip,
  Box,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle, 
  Button
} from "@material-ui/core";

import { Skeleton } from "@material-ui/lab";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from '@material-ui/icons/Delete';

import {Link} from 'react-router-dom';

import auth from "../../auth/auth";

import "./VehicleList.css";
import { toast, ToastContainer } from "react-toastify";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState();
  const [make, setMake] = useState(1);
  const [confirm, setConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState('');

  useEffect(() => {
    fetchData({
      metaData: {
        makeCD: make,
      },
    });
  }, [make]);

  const makeMeta = [
    {
      name: "Chevrolet",
      code: 1,
      logo: process.env.PUBLIC_URL + "/Chevrolet.png",
    },
    {
      name: "GMC",
      code: 10,
      logo: process.env.PUBLIC_URL + "/GMC.png",
    },
    {
      name: "Cadillac",
      code: 6,
      logo: process.env.PUBLIC_URL + "/Cadillac.png",
    },
    {
      name: "Buick",
      code: 4,
      logo: process.env.PUBLIC_URL + "/Buick.png",
    },
  ];

  const fetchData = (data) => {
    console.log(make);
    axios
      .post("http://localhost:5000/api/v1/assets/all", data, {
        auth,
      })
      .then((res) => {
        console.log(res.data.data);
        setVehicles(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const closeDialog = () => {
      setConfirm(false);
      setDeleteId('');
  }

  const deleteAsset = () => {
      if(deleteId!='')
        axios.delete("http://localhost:5000/api/v1/assets/vehicle/"+deleteId, {auth})
        .then(result => {
            if(result.data.success)
                toast.dark(result.data.message)
            else
                toast.error(result.data.message)
            closeDialog();
            setMake(make);
        })
        .catch(err => {
            console.log(err)
            toast.error("Something went wrong!");

        })
      else
        toast.error("Something went wrong!");
  }

  return (
    <>
        <ToastContainer />
      <Grid container spacing={3} alignContent="center">
        {makeMeta.map((brand, index) => (
          <Grid item xs={6} md={3} key={index}>
            <Card
              onClick={() => setMake(brand.code)}
              style={{
                backgroundColor: brand.code === make ? "#eee" : "#fff",
              }}
            >
              <img src={brand.logo} alt={brand.name} />
            </Card>
          </Grid>
        ))}{" "}
      </Grid>
      <Grid container spacing={4} direction="column">
        {vehicles ? (
          vehicles.map((vehicle, index) => {
            if (make === Number(vehicle.metaData.makeCD))
              return (
                <Grid item key={index}>
                  <Paper elevation={2}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          src={vehicle.imageURL}
                          alt={vehicle.assetName.assetNameEN}
                          style={{
                            width: 80,
                            height: 80,
                            border: "1px solid #eee",
                            marginRight: 30,
                          }}
                        />
                      </ListItemAvatar>
                      <ListItemText>
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          alignContent="center"
                          spacing={4}
                        >
                          <Grid item>
                            <Typography variant="h5">
                              {vehicle.assetName.assetNameEN}{" "}
                            </Typography>
                            <Typography variant="h6">
                              {vehicle.metaData.modelYear} {vehicle.model}{" "}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Box>
                              <Chip
                                label={vehicle.metaData.modelTypeEN}
                                variant="outlined"
                              />{" "}
                              {vehicle.metaData.modelSubTypeEN ? (
                                <Chip
                                  label={vehicle.metaData.modelSubTypeEN}
                                  variant="outlined"
                                  style={{ marginLeft: 10 }}
                                />
                              ) : null}{" "}
                            </Box>
                          </Grid>
                          <Grid item>
                            <Box>
                              Color:
                              <span
                                style={{
                                  width: 20,
                                  height: 20,
                                  marginLeft: 10,
                                  marginBottom: -3,
                                  backgroundColor: vehicle.metaData.color,
                                  display: "inline-block",
                                }}
                              ></span>
                            </Box>
                          </Grid>
                        </Grid>
                      </ListItemText>
                      <ListItemSecondaryAction>
                          <Link to={"/vehicle/edit/"+vehicle._id}>
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                        </Link>
                        <IconButton onClick={() => { setConfirm(true); setDeleteId(vehicle._id) }}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Paper>
                </Grid>
              );
          })
        ) : (
          <Grid item>
            <Paper>
              <ListItem>
                <ListItemAvatar>
                  <Skeleton
                    variant="circle"
                    width={80}
                    height={80}
                    style={{ marginRight: 30 }}
                  />
                </ListItemAvatar>
                <ListItemText>
                  <Skeleton variant="rect" />
                </ListItemText>
              </ListItem>
            </Paper>
          </Grid>
        )}{" "}
      </Grid>
      
      <Dialog
        open={confirm}
        onClose={closeDialog}
        >
            <DialogTitle>Delete this Asset?</DialogTitle>
        <DialogActions>
            <Button variant="outlined" onClick={closeDialog}>Cancel</Button>
            <Button color="secondary" variant="contained" onClick={deleteAsset}>Delete</Button>
            </DialogActions>
        </Dialog>
    </>
  );
};

export default VehicleList;
