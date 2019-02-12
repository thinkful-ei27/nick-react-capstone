import React, {Component} from 'react';
import ImageMapper from 'react-image-mapper';
import {connect} from 'react-redux';
import './UserHome.css';
import { submitPain, requestPain, addPain } from '../actions/pain';
import {userLogout} from '../actions/user';
import moment from 'moment';
import {sevenDaysAgo, fourteenDaysAgo, oneMonthAgo, threeMonthsAgo, sixMonthsAgo, oneYearAgo } from '../time';
import ChangeDate from './UserHomeComponents/ChangeDate';
import RatePain from './UserHomeComponents/RatePain';
import Message from './UserHomeComponents/Message';
import {loadToken, clearToken} from '../local-storage';
import {LogOut} from './UserHomeComponents/LogOut';
import ViewButton from './UserHomeComponents/ViewButton';
class UserHome extends Component {
    constructor(props){
        super(props);
    this.state = {
        displayValue: sevenDaysAgo._d,
        displayError: '',
        isDisplayError: false,
        days: 7,
        front: true
    }
    this.onDisplayDateChange = this.onDisplayDateChange.bind(this);
}
    componentDidMount(){
        console.log(`componentDidMount`);
        this.props.dispatch(requestPain(loadToken()));
    };

    displayError(){
        if(this.state.displayError){
            return (
                <div className='errorMessage' role='container'>
                    <p>{this.state.displayError}</p>
                </div>
            )
        }
    };

    handleClick(e){
        let data = {};
        data.location = e._id;
        data.username = this.props.username;
        this.setState({
            displayError: '',
            isDisplayError: false
        })
        this.props.dispatch(addPain(data.location));
    }

    handleSubmit(e, num){
        let location = this.props.painLocation;
        let date = moment();
        let locationFiltered = this.filterPain(this.props.userData, location);
        console.log(locationFiltered);
        let isSame;
        if(locationFiltered){
            console.log('we will compare times!');
            let today = moment();
            locationFiltered.forEach(data => {
                let otherDay = moment(data.date);
                if(today.diff(otherDay, 'days') === 0){
                    console.log('the if is runnin!')
                    isSame = true;
                    console.log(isSame);
                }
                }
            )
        }
        if(isSame){
            return this.setState({
                isDisplayError: true,
                displayError: 'Please wait until tomorrow to rate that location again'
            });
        } else {
        let painLevel = num;
        let username = this.props.username;
        let data = {painLevel, location, username, date};
        this.props.dispatch(submitPain(data, loadToken()));
        
        this.props.dispatch(requestPain(loadToken()));
        }
    }
    //Check this (testing only)
    _onMouseClick(e) {
        console.log({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY});
    };

    onDisplayDateChange(e){
        console.log(this.state);
        let time;
        let days;
        if(e.target.value === 'One Week'){
          time = sevenDaysAgo._d;
          days = 7;
        } 
        if(e.target.value === 'Two Weeks'){
          time = fourteenDaysAgo._d;
          days = 14;
        }
        if(e.target.value === 'One Month'){
          time = oneMonthAgo._d;
          days = 30.42;    
        }
        if(e.target.value === 'Three Months'){
          time = threeMonthsAgo._d;
          days = 91.25;    
        }
        if(e.target.value === 'Six Months'){
          time = sixMonthsAgo;
          days = 182.5;    
        }
        if(e.target.value === 'One Year'){
          time = oneYearAgo;
          days = 365;    
        }
        this.setState({displayValue: time, days: days}, () => {
        console.log("SetState's Callback Function.", this.state)})
    }

    handleView(e){
        e.preventDefault();
        let view = !this.state.front;
        this.setState({
            front: view
        }, ()=> {})
    }

    //CUSTOMIZE THE COLORS! opaque is your length
    //filter (only the pains with the correct id)
    filterPain(data, location){
        if(!data){
            //if there is no data
            return undefined;
        }
        let filteredData = data.filter(piece => piece.location === String(location));
        if(filteredData.length === 0){
            return undefined;
        } else {
            return filteredData
           
    }}

    //filters the remaining pains from filterPain based on the selected display date
    filterDate(data, date){
        if(!data){
            return undefined;
        }
        let filteredData = data.filter(piece => {
            return (moment(piece.date).diff(this.state.displayValue, 'days') > 0)
        })
        if(filteredData.length === 0){
            return undefined;
        } else {
            return filteredData
        }
    }

    averageDate(data){
        if(!data){
          return undefined;
        }
        //We should have the days from filteredData
        let numberDays = this.state.days;
        let average = data.length/numberDays;
        return average;
    }

    averagePain(data){
        if(!data){
          return undefined;
        }
        let sum = 0;
        let i;
        for(i = 0; i < data.length; i++){
            sum = sum + data[i].painLevel;
        }
        return (sum / i)
    }

    painShade(painData){
        if(!painData){
            return undefined
        } else if (painData > .9){
            return ' .9)';
        } else if (painData > .75){
            return ' .75)';
        } else if (painData > .5){
            return ' .5)';
        } else if (painData > .25){
            return ' .25)';
        } else if (painData > .1){
            return ' .1)';
        } else return ' .01)';
    }

    loadingImg(){
        const AREAS_MAP = { name: 'FrontBody', areas: [{ _id:'0', coords: [121,12,104,21,102,32,121,32], shape:'poly', preFillColor: this.preFillFill(0, this.props.userData)},
        {_id:'1', coords: [122,12,122,32,140,32,136,18], shape:'poly', preFillColor: this.preFillFill(1, this.props.userData)},
        {_id:'2', coords: [101,33,122,51], shape:'rect', preFillColor: this.preFillFill(2, this.props.userData)},
        {_id:'3', coords: [122,32,144,51], shape:'rect', preFillColor: this.preFillFill(3, this.props.userData)},
        {_id:'4', coords: [105,52,115,65,122,68,122,51], shape:"poly", preFillColor: this.preFillFill(4, this.props.userData)},
        {_id:'5', coords: [122,51,137,51,130,64,122,66], shape:"poly", preFillColor: this.preFillFill(5, this.props.userData)},
        {_id:'6', coords: [106,56,122,69,122,81,106,71], shape:"poly", preFillColor: this.preFillFill(6, this.props.userData)},
        {_id:'7', coords: [137,56,122,69,122,81,138,70], shape:"poly", preFillColor: this.preFillFill(7, this.props.userData)},
        {_id:'8', coords: [90,83,105,72,122,82,122,84], shape:"poly", preFillColor: this.preFillFill(8, this.props.userData)},
        {_id:'9', coords: [138,72,122,80,122,84,157,83], shape:"poly", preFillColor: this.preFillFill(9, this.props.userData)},
        {_id:'10', coords: [65,83,122,117], shape:"rect", preFillColor: this.preFillFill(10, this.props.userData)},
        {_id:'11', coords: [122,85,177,117], shape:"rect", preFillColor: this.preFillFill(11, this.props.userData)},
        {_id:'12', coords: [66,117,58,153,80,155,86,118], shape:"poly", preFillColor: this.preFillFill(12, this.props.userData)},
        {_id:'13', coords: [156,118,164,154,185,154,178,118], shape:"poly", preFillColor: this.preFillFill(13, this.props.userData)},
        {_id:'14', coords: [59,154,52,174,76,178,80,154], shape:"poly", preFillColor: this.preFillFill(14, this.props.userData)},
        {_id:'15', coords: [51,174,46,213,60,215,77,178], shape:"poly", preFillColor: this.preFillFill(15, this.props.userData)},
        {_id:'16', coords: [44,213,41,224,58,228,61,216], shape:"poly", preFillColor: this.preFillFill(16, this.props.userData)},
        {_id:'17', coords: [40,225,22,244,42,276,60,228], shape:"poly", preFillColor: this.preFillFill(17, this.props.userData)},
        {_id:'18', coords: [163,153,168,175,192,173,186,154], shape:"poly", preFillColor: this.preFillFill(18, this.props.userData)},
        {_id:'19', coords: [168,176,185,216,198,213,193,173], shape:"poly", preFillColor: this.preFillFill(19, this.props.userData)},
        {_id:'20', coords: [184,217,187,227,205,224,200,213], shape:"poly", preFillColor: this.preFillFill(20, this.props.userData)},
        {_id:'21', coords: [184,227,195,260,207,272,222,241,205,224], shape:"poly", preFillColor: this.preFillFill(21, this.props.userData)},
        {_id:'22', coords: [85,118,122,164], shape:"rect", preFillColor: this.preFillFill(22, this.props.userData)},
        {_id:'23', coords: [122,164,159,118], shape:"rect", preFillColor: this.preFillFill(23, this.props.userData)},
        {_id:'24', coords: [86,165,122,206], shape:"rect", preFillColor: this.preFillFill(24, this.props.userData)},
        {_id:'25', coords: [122,165,160,206], shape:"rect", preFillColor: this.preFillFill(25, this.props.userData)},
        {_id:'26', coords: [122,237,84,207], shape:"rect", preFillColor: this.preFillFill(26, this.props.userData)},
        {_id:'27', coords: [160,237,122,205], shape:"rect", preFillColor: this.preFillFill(27, this.props.userData)},
        {_id:'28', coords: [84,238,122,293], shape:"rect", preFillColor: this.preFillFill(28, this.props.userData)},
        {_id:'29', coords: [122,238,160,293], shape:"rect", preFillColor: this.preFillFill(29, this.props.userData)},
        {_id:'30', coords: [85,294,122,326], shape:"rect", preFillColor: this.preFillFill(30, this.props.userData)},
        {_id:'31', coords: [123,294,161,326], shape:"rect", preFillColor: this.preFillFill(31, this.props.userData)},
        {_id:'32', coords: [85,327,122,392], shape:"rect", preFillColor: this.preFillFill(32, this.props.userData)},
        {_id:'33', coords: [123,327,161,392], shape:"rect", preFillColor: this.preFillFill(33, this.props.userData)},
        {_id:'34', coords: [87,392,122,416], shape:"rect", preFillColor: this.preFillFill(34, this.props.userData)},
        {_id:'35', coords: [123,392,161,416], shape:"rect", preFillColor: this.preFillFill(35, this.props.userData)},
        {_id:'36', coords: [88,417,80,430,103,438,112,417], shape:"poly", preFillColor: this.preFillFill(36, this.props.userData)},
        {_id:'37', coords: [134,417,141,436,161,433,161,417], shape:"poly", preFillColor: this.preFillFill(37, this.props.userData)}]};
        
        const styles = {  position: 'relative',
            backgroundColor: 'black',
            display: 'block',
            marginRight: 'auto',
            marginLeft: 'auto',
            width: '100%',
            padding: '10px',
            margin: '10px'}
        //const AREAS_MAP_BACK = ~~~~
        const imageFront = require('../images/Body-Diagram-Front.jpg');
        const imageBack = require('../images/Body-Diagram-Back.jpg');
        if(this.props.loading){
        return (
            <img alt='Loading Placeholder' src='https://3wga6448744j404mpt11pbx4-wpengine.netdna-ssl.com/wp-content/uploads/2015/05/InternetSlowdown_Day.gif'/>
        )
        } else if(this.state.front){
            return (
              <div className='frontImageWrapper'>
                <ImageMapper imgWidth={248} style={styles} className='frontImage' fillColor={'rgba(255, 0, 0, 0.25)'} onClick={e => {this.handleClick(e)}} className='ImageWrapper' active={true} src={imageFront} map={AREAS_MAP} />
              </div>
            )
        } else { return (
            <div role='container' className='backImageWrapper'>
              <ImageMapper className='backImage' fillColor={'rgba(255, 0, 0, 0.25)'} onClick={e => {this.handleClick(e)}} className='ImageWrapper' active={true} src={imageBack} />
            </div>
        )
        }
    }
   
    newMethod() {
        return this;
    }

    painColor(painLevel) {
        if(!painLevel){
            return undefined
        } else if(painLevel > 4){
            return 'rgba(255,0,0,'
        } else if (painLevel > 2.01){
            return 'rgba(0,255,0,'
        } else return 'rgba(0, 0, 255,'
    }

    preFillFill(location, userData){
    let rgbaValue; //returned value for color/shade
    let locationFilteredData; //will be filtered on location
    let filteredData; //will be filtered based on date
    let averagePain;
    let averageLength;
    locationFilteredData = this.filterPain(userData, location);
    filteredData = this.filterDate(locationFilteredData, this.state.displayValue); //filtered based on display date
    averagePain = this.averagePain(filteredData);
    averageLength = this.averageDate(filteredData);
    rgbaValue = this.painColor(averagePain) + this.painShade(averageLength);
    console.log(rgbaValue);
    return rgbaValue;
    }

    handleLogout(e){
        e.preventDefault();
        clearToken();
        this.props.dispatch(userLogout())
        //dispatch action to change loggedIn to false. Reset to initial state.
    }
    
    render(){

        
       
        return (
            <div onClick={e => {this._onMouseClick(e)}} role='container' className='UserHome'>
                <h3>{this.props.username}'s Pain Journal</h3>
                <div className='dateViewContainer' role='container'>
                    <ChangeDate onDisplayChange={e => this.onDisplayDateChange(e)}/>
                    <ViewButton handleClick={e => this.handleView(e)} />
                    {this.displayError()}
                </div>
                <div role='image-container' className='ImageWrapperContainer'>
                    {this.loadingImg()}
                    <div role='container' className='ratePainWrapper'>
                      <p>Click on the Image to Select Pain Location</p>
                      <RatePain handleSubmit={(e, num) => {this.handleSubmit(e, num)}}/>
                      <p>Afterwards, Click on a Button Above to Rate the Pain</p>
                      <p>The Scale is from 1 (weakest) to 5 (strongest)</p>
                    </div>
                    <LogOut handleClick={e => this.handleLogout(e)} />
                </div>
                
            </div>
        )
    }
}

export const mapStateToProps = (state) => {
    return {loggedIn: state.reducer.loggedIn,
    username: state.reducer.username,
    userData: state.reducer.userData,
    addPain: state.reducer.addPain,
    painLocation: state.reducer.painLocation,
    displayDate: state.reducer.displayDate,
    loading: state.reducer.loading
};
}
  
  
export default connect(mapStateToProps)(UserHome);