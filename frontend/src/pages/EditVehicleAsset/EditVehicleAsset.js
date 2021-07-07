import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Box, Button, Divider, Grid, TextField, Typography } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import auth from "../../auth/auth";
import { toast, ToastContainer } from "react-toastify";
import Loading from "../../components/Loading/Loading";

const EditVehicleAsset = () => {

    const [vehicleData, setVehicleData] = useState();

  let { id } = useParams();
  
  useEffect(() => {
    fetchData(id);
  }, []);

  const fetchData = (id) => {
    axios
      .get("http://localhost:5000/api/v1/assets/vehicle/" + id, { auth })
      .then((result) => {
        console.log(result.data.data);
        setVehicleData(result.data.data)
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.data)
      });
  };

  return (
    <>
      <ToastContainer />
      <Box py={2}>
          <Link to="/vehicles">
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>

          </Link>
      </Box>
      <Divider />
      <Box py={2}>
        <Typography variant="h5">Edit an Asset</Typography>
      </Box>
      <Box p={2}>
          <form>
              {vehicleData ? (
              <Grid container spacing={5}>
              <Grid item
                    xs={12} sm={6}>
                    <TextField id="assetNameEN" label="Asset Name EN" name="assetNameEN" required fullWidth defaultValue={vehicleData.assetName.assetNameEN} />
                </Grid>
                <Grid item
                    xs={12} sm={6}>
                    <TextField id="assetNameFR" label="Asset Name FR" name="assetNameFR" required fullWidth defaultValue={vehicleData.assetName.assetNameFR}/>
                </Grid>
              </Grid>

              ) : <Loading />}
          </form>
      </Box>
    </>
  );
};

export default EditVehicleAsset;
