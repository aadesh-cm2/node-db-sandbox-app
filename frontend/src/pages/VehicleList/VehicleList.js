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
  Button,
  List,
  Drawer,
  Divider,
} from "@material-ui/core";

import { Skeleton } from "@material-ui/lab";

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AppsIcon from "@material-ui/icons/Apps";
import ViewList from "@material-ui/icons/ViewList";
import InfoIcon from "@material-ui/icons/Info";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import { Link } from "react-router-dom";

import auth from "../../auth/auth";

import "./VehicleList.css";
import { toast, ToastContainer } from "react-toastify";

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [make, setMake] = useState(1);
  const [model, setModel] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [gridView, setGridView] = useState(false);
  const [openInfoDrawer, setOpenInfoDrawer] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchData(
      {
        metaData: {
          makeCD: make,
        },
        model,
        primary: true,
      }
    );
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

  const fetchData = (query) => {
    let data = {
      query,
      config: {
        limit:6,
        page,
      },
    };
    if(data.query.model == '')
      delete data.query.model
    axios
      .post("http://localhost:5000/api/v1/assets/all", data, {
        auth,
      })
      .then((res) => {
        setVehicles([...vehicles, ...res.data.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const closeDialog = () => {
    setConfirm(false);
    setDeleteId("");
  };

  window.onscroll = function () {
    if(window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight){
            setPage(page+1)
            fetchData({
                metaData: {
                  makeCD: make,
                },
                model,
            })
    }
  }

  const callNext = event => {
    let element = event.target;
    console.log(element);
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      // do something at end of scroll
      console.log("End of Grid")
    }
  }

  const deleteAsset = () => {
    if (deleteId != "")
      axios
        .delete("http://localhost:5000/api/v1/assets/vehicle/" + deleteId, {
          auth,
        })
        .then((result) => {
          if (result.data.success) toast.dark(result.data.message);
          else toast.error(result.data.message);
          closeDialog();
          setMake(make);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong!");
        });
    else toast.error("Something went wrong!");
  };

  const assetInfo = (vehicle) => {
    return (
      <>
        <Box p={2}>
          <List>
            <ListItem>
              <ListItemText
                primary={vehicle.metaData.modelYear + " " + vehicle.model}
                secondary={vehicle.assetName.assetNameEN}
              />

              <ListItemSecondaryAction>
                <Link to={"/vehicle/edit/" + vehicle._id}>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </Link>
                <IconButton
                  onClick={() => {
                    setConfirm(true);
                    setDeleteId(vehicle._id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <Chip label={vehicle.metaData.modelTypeEN} variant="outlined" />{" "}
              {vehicle.metaData.modelSubTypeEN ? (
                <Chip
                  label={vehicle.metaData.modelSubTypeEN}
                  variant="outlined"
                  style={{ marginLeft: 10 }}
                />
              ) : null}{" "}
            </ListItem>
            <Divider />
            <ListItem>
              Color:
              {vehicle.metaData.color && vehicle.metaData.color!='' ? <span
                style={{
                  width: 20,
                  height: 20,
                  marginLeft: 10,
                  marginBottom: -3,
                  backgroundColor: vehicle.metaData.color,
                  display: "inline-block",
                }}
              ></span> : 'N/A'}
              
            </ListItem>
            <Divider />
          </List>
        </Box>
      </>
    );
  };

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
      <Box my={5}>
        <Grid container direction="row-reverse" spacing={2}>
          <IconButton onClick={() => setGridView(!gridView)}>
            {!gridView ? <AppsIcon /> : <ViewList />}
          </IconButton>
        </Grid>
        <Box my={1}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ArrowBackIcon />}
            onClick={() =>
              fetchData(
                {
                  metaData: {
                    makeCD: make,
                  },
                  primary: true,
                },
                0
              )
            }
          >
            Back
          </Button>
        </Box>
      </Box>
      <Grid container spacing={4} direction={gridView ? "row" : "column"} >
        {vehicles ? (
          vehicles.map((vehicle, index) => {
            if (make === Number(vehicle.metaData.makeCD))
              return (
                <Grid item key={index} sm={gridView ? "4" : "12"}>
                  <Paper elevation={2}>
                    {!gridView ? (
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
                          {vehicle.primary ? (
                            <IconButton
                              onClick={() => {
                                setModel(vehicle.model)
                                fetchData(
                                  {
                                    primary: false,
                                    model: vehicle.model,
                                  },
                                  0
                                )}
                              }
                            >
                              <ArrowForwardIcon />
                            </IconButton>
                          ) : null}

                          <Link to={"/vehicle/edit/" + vehicle._id}>
                            <IconButton>
                              <EditIcon />
                            </IconButton>
                          </Link>
                          <IconButton
                            onClick={() => {
                              setConfirm(true);
                              setDeleteId(vehicle._id);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ) : (
                      <Box className="grid-image">
                        <>
                          <img
                            src={vehicle.imageURL}
                            alt={vehicle.assetName.assetNameEN}
                          />
                          <Box style={{ overflow: "hidden" }}>
                            {vehicle.assetName.assetNameEN}
                            <span style={{ float: "right" }}>
                              {vehicle.primary ? (
                                <IconButton
                                  onClick={() =>
                                    fetchData(
                                      {
                                        primary: false,
                                        model: vehicle.model,
                                      },
                                      0
                                    )
                                  }
                                >
                                  <ArrowForwardIcon />
                                </IconButton>
                              ) : null}
                              <IconButton
                                onClick={() => setOpenInfoDrawer(true)}
                              >
                                <InfoIcon />
                              </IconButton>
                            </span>
                          </Box>
                        </>
                        <Drawer
                          anchor="bottom"
                          open={openInfoDrawer}
                          onClose={() => setOpenInfoDrawer(false)}
                        >
                          {assetInfo(vehicle)}
                        </Drawer>
                      </Box>
                    )}
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

      <Dialog open={confirm} onClose={closeDialog}>
        <DialogTitle>Delete this Asset?</DialogTitle>
        <DialogActions>
          <Button variant="outlined" onClick={closeDialog}>
            Cancel
          </Button>
          <Button color="secondary" variant="contained" onClick={deleteAsset}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VehicleList;
