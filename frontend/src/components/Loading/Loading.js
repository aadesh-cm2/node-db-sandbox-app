const { Grid, CircularProgress } = require("@material-ui/core")

const Loading = () => {
    return(
        <Grid container alignContent="center" alignItems="center" justify="center">
            <Grid item xs={2}>
                <CircularProgress style={{margin: "0 auto", display:"block"}} size={60}/>
            </Grid>
        </Grid>
    )
}
export default Loading;