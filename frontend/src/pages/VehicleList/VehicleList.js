import React, {useState, useEffect} from "react";
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
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    TextField,
    InputAdornment,
    Fab
} from "@material-ui/core";
import {Skeleton, Pagination} from "@material-ui/lab";
import {AllCheckerCheckbox, Checkbox, CheckboxGroup} from '@createnl/grouped-checkboxes';

import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AppsIcon from "@material-ui/icons/Apps";
import ViewList from "@material-ui/icons/ViewList";
import InfoIcon from "@material-ui/icons/Info";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';

import {Link} from "react-router-dom";

import auth from "../../auth/auth";

import {toast, ToastContainer} from "react-toastify";
import vehicle_mapping from "../../vehicle_mapping";
import {cleanObj} from "../../utils/utils"

import "./VehicleList.css";

const VehicleList = () => {
    const [vehicles, setVehicles] = useState();
    const [make, setMake] = useState(1);
    const [model, setModel] = useState('');
    const [deleteDialog, setDeleteDailog] = useState({open: false, deleteId: ""});
    const [gridView, setGridView] = useState(false);
    const [openInfoDrawer, setOpenInfoDrawer] = useState({open: false, vehicle: {}});
    const [filters, setFilters] = useState({modelYear: '', vehicleType: ''})
    const [loading, setLoading] = useState(true);
    const [multipleDelete, setMultipleDelete] = useState(false);
    const [assetList, setAssetList] = useState();

    useEffect(() => {
        fetchData({
            metaData: {
                makeCD: make
            },
            model,
            primary: true
        }, 0);
    }, [make]);

    const makeMeta = [
        {
            name: "Chevrolet",
            code: 1,
            logo: process.env.PUBLIC_URL + "/Chevrolet.png"
        }, {
            name: "GMC",
            code: 10,
            logo: process.env.PUBLIC_URL + "/GMC.png"
        }, {
            name: "Cadillac",
            code: 6,
            logo: process.env.PUBLIC_URL + "/Cadillac.png"
        }, {
            name: "Buick",
            code: 4,
            logo: process.env.PUBLIC_URL + "/Buick.png"
        },
    ];

    const vehicleTypes = [...new Set(vehicle_mapping.map(vehicle => vehicle.modelTypeEN))];
    
    const fetchData = (query, page, sort) => {
        setLoading(true);

        console.log("Raw query:::",query);
        let data = {
            query,
            sort,
            config: {
                limit: 5,
                page: page ? page : 0
            }
        };
        //making sure make is always what is selected
        // data.query.metaData.makeCD = make;

        // By default call primary assets
        console.log("Primary before check::",data.query.primary)
        if (data.query.primary===undefined && (vehicles && vehicles.data && vehicles.data.length)){ 
            console.log("Changing primary as per data");
            data.query.primary = vehicles.data[0].primary;
        }
        else if(data.query.primary === true)
            data.query.primary = true
        else 
            data.query.primary = false
        

        //cleaning obj for any blank data
        data.query = cleanObj(data.query)

        console.log("Query::::::::::",data.query);

        axios.post("http://localhost:5000/api/v1/assets/all", data, {auth}).then((res) => {
            console.log(res.data)
            setVehicles(res.data);
            setLoading(false)
        }).catch((err) => {
            console.log(err);
        });
    };
    const deleteMultipleAssets = () => {
        
    let assetsList = assetList.filter((asset) => asset.checked);
    if(assetsList.length)
        toast("Deleting multiple assets")
    }

    const closeDialog = () => {
        setDeleteDailog({open: false, deleteId: ""});
    };

    // window.onscroll = function () {
    //     if(window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight){
    //             setPage(page+1)
    //             fetchData({
    //                 metaData: {
    //                   makeCD: make,
    //                 },
    //                 model,
    //             })
    //     }
    // }

    const changePage = (event, page) => {
        fetchData({
            metaData: {
                makeCD: make
            },
            model,
        }, page - 1)
    }

    const goBack = () => {
        setFilters({modelYear: '', vehicleType: ''});
        setModel('')
        fetchData({
            metaData: {
                makeCD: make
            },
            primary: true
        }, 0)
    }

    const handleMultipleChecks = checkboxes => {
        console.log(checkboxes)
        
        setAssetList(checkboxes)
    let assetsList = checkboxes.filter((asset) => asset.checked);
    if(assetsList.length){
        setMultipleDelete(true)
    }
    else{
        setMultipleDelete(false)
    }
    }

    const deleteAsset = () => {
        if (deleteDialog.deleteId !== "") 
            axios.delete("http://localhost:5000/api/v1/assets/vehicle/" + deleteDialog.deleteId, {auth}).then((result) => {
                if (result.data.success) 
                    toast.dark(result.data.message);
                 else 
                    toast.error(result.data.message);
                 closeDialog();
                setMake(make);
            }).catch((err) => {
                console.log(err);
                toast.error("Something went wrong!");
            });
         else 
            toast.error("Something went wrong!");
        

    };

    const applyFilter = event => {
        console.log(event.target.value)
        if (Number(event.target.value)) {
            setFilters({
                ...filters,
                modelYear: event.target.value
            })
            fetchData({
                model,
                metaData: {
                    makeCD: make,
                    modelYear: event.target.value,
                    modelTypeEN: filters.vehicleType
                }
            }, 0)
        } else {
            setFilters({
                ...filters,
                vehicleType: event.target.value
            })
            fetchData({
                model,
                metaData: {
                    makeCD: make,
                    modelYear: filters.modelYear,
                    modelTypeEN: event.target.value
                }
            }, 0)
        }
    }

    const sort = event => {
        console.log(event.target.value)
        console.log(model)
        let sort = {}
        switch (event.target.value) {
            case 'models-asc': sort = {
                    model: 'asc'
                }
                break;
            case 'models-desc': sort = {
                    model: 'desc'
                }
                break;
            case 'years-asc': sort = {
                    metaData: {
                        modelYear: 'asc'
                    }
                }
                break;
            case 'years-desc': sort = {
                    metaData: {
                        modelYear: 'desc'
                    }
                }
                break;
            default:
                return null;

        }
        fetchData({
            model,
            metaData: {
                makeCD: make
            },
        }, 0, sort)
    }

    const clearFilters = yearFilter => {
        
        if (yearFilter) {
            setFilters({
                ...filters,
                modelYear: '',
            })
            fetchData({
                model,
                metaData: {
                    modelYear: '',
                    modelTypeEN: filters.vehicleType,
                    makeCD: make
                }
            }, 0)
        } else {
            setFilters({
                ...filters,
                vehicleType: ''
            })
            fetchData({
                model,
                metaData: {
                    modelYear: filters.modelYear,
                    modelTypeEN: '',
                    makeCD: make
                }
            }, 0)
        }
    }

    const assetInfo = vehicle => {
        if (vehicle && Object.keys(vehicle).length !== 0) 
            return (<>
                <Box p={2}>
                    <IconButton onClick={
                            () => setOpenInfoDrawer({vehicle: {}, open: false})
                        }
                        style={
                            {float: 'right'}
                    }>
                        <CancelIcon/>
                    </IconButton>
                    <img src={
                            vehicle.imageURL
                        }
                        alt={
                            vehicle.model
                        }
                        className="info-img"/>
                    <List>
                        <ListItem>
                            <ListItemText primary={
                                    vehicle.metaData.modelYear + " " + vehicle.model
                                }
                                secondary={
                                    vehicle.assetName.assetNameEN
                                }/>

                            <ListItemSecondaryAction>
                                <Link to={
                                    "/vehicle/edit/" + vehicle._id
                                }>
                                    <IconButton>
                                        <EditIcon color="action"/>
                                    </IconButton>
                                </Link>
                                <IconButton onClick={
                                    () => {
                                        setDeleteDailog({open: true, deleteId: vehicle._id});
                                    }
                                }>
                                    <DeleteIcon color="secondary"/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        <Divider/>
                        <ListItem>
                            <Chip label={
                                    vehicle.metaData.modelTypeEN
                                }
                                variant="outlined"/>{" "}
                            {
                            vehicle.metaData.modelSubTypeEN ? (<Chip label={
                                    vehicle.metaData.modelSubTypeEN
                                }
                                variant="outlined"
                                style={
                                    {marginLeft: 10}
                                }/>) : null
                        }
                            {" "} </ListItem>
                        <Divider/>
                        <ListItem>
                            Color: {
                            vehicle.metaData.color && vehicle.metaData.color !== '' && vehicle.metaData.color !== 'null' ? <span style={
                                {
                                    width: 20,
                                    height: 20,
                                    marginLeft: 10,
                                    marginBottom: -3,
                                    backgroundColor: vehicle.metaData.color,
                                    display: "inline-block"
                                }
                            }></span> : 'N/A'
                        } </ListItem>
                        <Divider/>
                    </List>
                </Box>
            </>);
        
    };

    return (<>
        <ToastContainer/>
        <Link to='/'
            style={
                {
                    position: 'absolute',
                    bottom: 10,
                    right: 10
                }
        }>
            <Fab color="primary" aria-label="add">
                <AddIcon/>
            </Fab>
        </Link>
        {/* Filter year:: {filters.modelYear}
      Filter vehicle type: {filters.vehicleType} */}
        <Grid container
            spacing={3}
            alignContent="center"> {
            makeMeta.map((brand, index) => (<Grid item
                xs={6}
                md={3}
                key={index}>
                <Card onClick={
                        () => {
                            setModel('')
                            setMake(brand.code)
                        }
                    }
                    style={
                        {
                            backgroundColor: brand.code === make ? "#eee" : "#fff"
                        }
                }>
                    <img src={
                            brand.logo
                        }
                        alt={
                            brand.name
                        }/>
                </Card>
            </Grid>))
        }
            {" "} </Grid>
        <Box my={3}>
            <Grid container direction="row"
                spacing={2}
                alignItems="center"
                justify="space-between">
                <Grid item> {
                    vehicles ? vehicles.data.length && vehicles.data[0].primary ? null : <Button variant="outlined" color="secondary"
                        startIcon={<ArrowBackIcon/>}
                        onClick={goBack}>
                        Back
                    </Button> : null
                } </Grid>
                <Grid item
                    xs={12}
                    sm='auto'>
                    <Box style={
                        {minWidth: 300}
                    }>
                        <TextField label="Search Model" fullWidth variant="outlined"
                            InputProps={
                                {
                                    startAdornment: (<InputAdornment position="start">
                                        <SearchIcon/>
                                    </InputAdornment>)
                                }
                            }
                            onChange={
                                (event) => {
                                    fetchData({
                                        model: event.target.value,
                                        primary: vehicles && vehicles.data.length ? vehicles.data[0].primary : true,
                                        metaData: {
                                            makeCD: make
                                        }
                                    }, 0)
                                }
                            }/>
                    </Box>
            </Grid>
            <Grid item
                xs={12}
                sm='auto'>
                <FormControl style={
                    {
                        minWidth: 180,
                        width: '100%'
                    }
                }>
                    <InputLabel id="filter-year"
                        style={
                            {left: 10}
                    }>Filter by Year</InputLabel>
                    <Select labelId="filter-year" displayEmpty fullWidth variant="outlined"
                        onChange={applyFilter}>
                        <MenuItem value='2019'>2019</MenuItem>
                        <MenuItem value='2020'>2020</MenuItem>
                        <MenuItem value='2021'>2021</MenuItem>
                        <MenuItem value='2022'>2022</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item
                xs={12}
                sm='auto'>
                <FormControl style={
                    {
                        minWidth: 180,
                        width: '100%'
                    }
                }>
                    <InputLabel id="filter-vehicle"
                        style={
                            {left: 10}
                    }>Filter by Vehicle type</InputLabel>
                    <Select labelId="filter-vehicle" displayEmpty fullWidth variant="outlined"
                        onChange={applyFilter}>
                             {
                        vehicleTypes.map(type => <MenuItem value={type}> {type}</MenuItem>)
                    } 
                    </Select>
                </FormControl>
            </Grid>
            <Grid item
                xs={12}
                sm='auto'>
                <FormControl style={
                    {
                        minWidth: 120,
                        width: '100%'
                    }
                }>
                    <InputLabel id="sort-assets"
                        style={
                            {left: 10}
                    }>Sort</InputLabel>
                    <Select labelId="sort-assets" displayEmpty fullWidth variant="outlined"
                        onChange={sort}>
                        <MenuItem value='models-asc'>Models A-Z</MenuItem>
                        <MenuItem value='models-desc'>Models Z-A</MenuItem>
                        <MenuItem value='years-asc'>Years Old-New</MenuItem>
                        <MenuItem value='years-desc'>Years New-Old</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item>
                <IconButton onClick={
                    () => setGridView(!gridView)
                }> {
                    !gridView ? <AppsIcon/>: <ViewList/>
                } </IconButton>

            </Grid>
        </Grid>
    </Box>
    <Box my={2}>
    <Grid container justify="space-between"
        spacing={3}>
        <Grid item>
            {
                model !== "" ? <Chip label={model} style={{backgroundColor:'#dcb65a'}} /> : null
            }
             {
            filters.modelYear === "" && filters.vehicleType === "" ? null : <> {
                filters.modelYear !== "" && <Chip label={
                        filters.modelYear
                    }
                    color="primary"
                    onDelete={()=>clearFilters(true)}
                    deleteIcon={<CancelIcon />}
                    />}
                {
                filters.vehicleType !== "" && <Chip label={
                        filters.vehicleType
                    }
                    color="secondary"
                    onDelete={()=>clearFilters(false)}
                    deleteIcon={<CancelIcon />}
                    style={
                        {marginLeft: 5}
                    }/>
            } </>
        } </Grid>
        <Grid item>
            {multipleDelete && <Button variant="contained" color="secondary" onClick={deleteMultipleAssets}>Delete Assets</Button>}
            </Grid>
    </Grid>
    </Box>
    <Grid container
        spacing={4}
        justify="center"
        direction={
            gridView ? "row" : "column"
    }> {
        !loading && vehicles ? (<CheckboxGroup onChange={handleMultipleChecks}> {
            vehicles.data.map((vehicle, index) => {
                if (make === Number(vehicle.metaData.makeCD)) 
                    return (<><Grid item
                        key={index}
                        sm={
                            gridView ? "6" : "12"
                        }
                        md={
                            gridView ? "4" : "12"
                    }>
                        <Paper elevation={2}> {
                            !gridView ? (
                            <>
                            <ListItem>
                                <Checkbox value={
                                        vehicle._id
                                    }
                                    className="multiple-checkbox"/>
                                <ListItemAvatar>
                                    <Avatar src={
                                            vehicle.imageURL
                                        }
                                        alt={
                                            vehicle.assetName.assetNameEN
                                        }
                                        style={
                                            {
                                                width: 80,
                                                height: 80,
                                                border: "1px solid #eee",
                                                marginRight: 30
                                            }
                                        }
                                        variant="rounded"/>
                                </ListItemAvatar>
                                <ListItemText>
                                    <Grid container direction="row" alignItems="center" alignContent="center"
                                        spacing={4}>
                                        <Grid item>
                                            <Typography variant="h5"> {
                                                vehicle.assetName.assetNameEN
                                            }
                                                {" "} </Typography>
                                            <Typography variant="h6"> {
                                                vehicle.metaData.modelYear
                                            }{" "}{
                                                vehicle.model
                                            }
                                                {" "} </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Box>
                                                <Chip label={
                                                        vehicle.metaData.modelTypeEN
                                                    }
                                                    variant="outlined"/>{" "}
                                                {
                                                vehicle.metaData.modelSubTypeEN ? (<Chip label={
                                                        vehicle.metaData.modelSubTypeEN
                                                    }
                                                    variant="outlined"
                                                    style={
                                                        {marginLeft: 10}
                                                    }/>) : null
                                            }
                                                {" "} </Box>
                                        </Grid>
                                        <Grid item>
                                            <Box>
                                                Color: {
                                                vehicle.metaData.color && vehicle.metaData.color !== '' && vehicle.metaData.color !== 'null' ? <span style={
                                                    {
                                                        width: 20,
                                                        height: 20,
                                                        marginLeft: 10,
                                                        marginBottom: -3,
                                                        backgroundColor: vehicle.metaData.color,
                                                        display: "inline-block"
                                                    }
                                                }></span> : ' N/A'
                                            } </Box>
                                        </Grid>
                                    </Grid>
                                </ListItemText>
                                <ListItemSecondaryAction>
                                    
                                     {
                                    vehicle.primary ? (<IconButton onClick={
                                        () => {
                                            setModel(vehicle.model)
                                            fetchData({
                                                model: vehicle.model,
                                                primary: false
                                            }, 0)
                                        }
                                    }>
                                        <ArrowForwardIcon/>
                                    </IconButton>) : null
                                }
                                <IconButton onClick={
                                    () => setOpenInfoDrawer({open: true, vehicle})
                                }>
                                    <InfoIcon/>
                                </IconButton>

                                    <Link to={
                                        "/vehicle/edit/" + vehicle._id
                                    }>
                                        <IconButton>
                                            <EditIcon/>
                                        </IconButton>
                                    </Link>
                                    <IconButton onClick={
                                        () => {
                                            setDeleteDailog({open: true, deleteId: vehicle._id});
                                        }
                                    }>
                                        <DeleteIcon color="secondary"/>
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            </>) : (<Box className="grid-image">
                                <>
                                    <img src={
                                            vehicle.imageURL
                                        }
                                        alt={
                                            vehicle.assetName.assetNameEN
                                        }/>
                                    <Grid container justify="space-between" alignItems="center">
                                        <Grid item>
                                            <Checkbox value={
                                                    vehicle._id
                                                }
                                                className="multiple-checkbox"/> {
                                            vehicle.assetName.assetNameEN
                                        } </Grid>
                                        <Grid item> {
                                            vehicle.primary ? (<IconButton onClick={
                                                () => fetchData({
                                                    model: vehicle.model
                                                }, 0)
                                            }>
                                                <ArrowForwardIcon/>
                                            </IconButton>) : null
                                        }
                                            <IconButton onClick={
                                                () => setOpenInfoDrawer({open: true, vehicle})
                                            }>
                                                <InfoIcon/>
                                            </IconButton>

                                        </Grid>
                                        {/* <span style={
                                                                {float: "right"}
                                                            }>
                                                            </span> */} </Grid>
                                </>
                            </Box>)
                        } </Paper>
                    </Grid>
                    <Drawer anchor="bottom"
                        open={
                            openInfoDrawer.open
                        }
                        onClose={
                            () => setOpenInfoDrawer({vehicle: {}, open: false})
                    }> {
                        assetInfo(openInfoDrawer.vehicle)
                    } </Drawer>
                    </>
                    );
                
            })
        }
            <Grid item
                xs={12}>
                <Pagination count={
                        vehicles.pageData.pageCount
                    }
                    onChange={changePage}/>
            </Grid>
        </CheckboxGroup>) : (<Grid item>
            <Paper>
                <ListItem>
                    <ListItemAvatar>
                        <Skeleton variant="circle"
                            width={80}
                            height={80}
                            style={
                                {marginRight: 30}
                            }/>
                    </ListItemAvatar>
                    <ListItemText>
                        <Skeleton variant="rect"/>
                    </ListItemText>
                </ListItem>
            </Paper>
        </Grid>)
    }
        {" "} </Grid>

    <Dialog open={
            deleteDialog.open
        }
        onClose={closeDialog}>
        <DialogTitle>Delete this Asset?</DialogTitle>
        <DialogActions>
            <Button variant="outlined"
                onClick={closeDialog}>
                Cancel
            </Button>
            <Button color="secondary" variant="contained"
                onClick={deleteAsset}>
                Delete
            </Button>
        </DialogActions>
    </Dialog>
</>);
};

export default VehicleList;
