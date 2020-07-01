import React from 'react';
import './App.css';
import 'typeface-roboto';
import { Button, Input, FormControl, Select, MenuItem } from '@material-ui/core';
import { withStyles, lighten } from "@material-ui/core/styles";
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Amplify, { API } from "aws-amplify";
import '@aws-amplify/ui/dist/style.css';
import Config from './config';


Amplify.configure({
  API: {
      endpoints: [
          {
              name: "NluSearch",
              endpoint: Config.apiEndpoint
            }
      ]
  }
});

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    height: "100%",
    color: theme.palette.text.secondary
  },
});

const BorderLinearProgress = withStyles({
  root: {
    height: 10,
    backgroundColor: lighten('#ff6c5c', 0.5),
  },
  bar: {
    borderRadius: 20,
    backgroundColor: '#ff6c5c',
  },
})(LinearProgress);

// const classes = useStyles();

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      pictures: [],
      completed:0,
      k:3
    };
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleKChange = this.handleKChange.bind(this);
  }

  handleSearchSubmit(event) {
    // function for when a use submits a URL
    // if the URL bar is empty, it will remove similar photos from state
    console.log(this.state.searchText);
    if (this.state.searchText === undefined || this.state.searchText === "") {
      console.log("Empty Text field");
      this.setState({pictures: [], completed:0});
    } else {
      const myInit = {
        body: {"searchString": this.state.searchText, "k": this.state.k}
      };
      this.setState({completed:66});
      API.post('NluSearch', '/postText', myInit)
      .then(response => {
        this.setState({pictures: response.images.map(function(elem) {
          let picture = {};
          picture.img = elem;
          picture.cols = 1;
          return picture;
        })
      }); 
      this.setState({completed:100});
      console.log(this.state.pictures);
      })
      .catch(error => {
        console.log(error);
      });
    };
    event.preventDefault();
  }

  handleFormChange(event) {
    this.setState({searchText: event.target.value});
  }

  handleKChange(event) {
    this.setState({k: event.target.value});
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>

        <Grid container justify='center' alignItems="stretch" spacing={8}>
          <Grid item xs={10}>
            <img src={require('./images/header.jpg')} alt="Header" style={{height:"100%", width: "100%"}}/>
          </Grid>
          <Grid item xs={10}>
            <Typography variant="h2" style={{textAlign: "center"}}>
              AWS Natural Language Search
            </Typography>
          </Grid>
          <Grid item xs={10}>
            <Paper className={classes.paper}>
              Step 1: Select the number of similar images (K neighbors):
              <p/>
              <FormControl className={classes.formControl}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={this.state.k}
                  onChange={this.handleKChange}
                >
                  <MenuItem value={3}>Three</MenuItem>
                  <MenuItem value={4}>Four</MenuItem>
                  <MenuItem value={5}>Five</MenuItem>
                  <MenuItem value={6}>Six</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>

          <Grid item xs={10}>
            <Paper className={classes.paper}>
              Step 2:<p/>
              Enter a natural language search query about dresses. Try entering "summery yellow dress": <p/>
              <form noValidate autoComplete="off" onSubmit={this.handleSearchSubmit}>
                <Input
                  style={{width:'80%'}}
                  placeholder="Search"
                  onChange={this.handleFormChange}
                  value={this.state.searchText}
                  id="standard-basic"
                  margin="dense"
                  width={1200}
                  // fullWidth
                  endAdornment={
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  }
                />
                <Button
                type='submit'
                style={{background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'}}
                >
                  Submit
                </Button>
              </form>
            </Paper>
          </Grid>

          
          <Grid item xs={10}>
              <Paper className={classes.paper}>
                Step 3: Results!<p/>
                <BorderLinearProgress
                    variant="determinate"
                    color="secondary"
                    value={this.state.completed}
                />
                <p/>
                <GridList cellHeight={200} className={classes.gridList} cols={3}>
                  {this.state.pictures.map((tile) => (
                    <GridListTile key={tile.img} cols={tile.cols || 1}>
                      <img src={tile.img} alt="Similar photos..." style={{height:"100%", width: "auto"}} />
                    </GridListTile>
                  ))}
                </GridList>
              </Paper>
            </Grid>
        </Grid>

        <Grid container justify="center">
          
        </Grid>

      </div>
  );}
}

export default withStyles(styles, { withTheme: true })(App);

