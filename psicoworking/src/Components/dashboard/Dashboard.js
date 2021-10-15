import React from 'react';
import Sidebar from './sidebar/Sidebar';
import UserProfile from "./UserProfile";
import './Dashboard.css';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user:{}, loading: true};
}

  componentDidMount(){
    //console.log(`id: ${this.props.id}`);
    fetch(`http://localhost:8080/users/test/${this.props.id}`)
        .then(response => {
        if (response.status >= 200 && response.status <= 299) {
            return response.json();
        } else {
            console.log("error");
            throw Error(response.statusText);
        }
        })
        .then(data => {
            if(data._id){
            this.setState({user: data, loading:false});
            }
        })
        .catch(error => {
        // Handle the error
        console.log(error);
        this.setState({user: "", loading:false});
        });
    }

    render() {
      if (this.state.loading){
        return <h4>Loading</h4>; // NOTE: This can be changed to render a <Loading /> Component for a better user experience
      }else{
        if (this.state.user._id){
          //console.log(this.state.user);
          return (
            <>
              <div className="sidebar">
                <Sidebar id={this.state.user._id} isAdmin={this.state.user.isAdmin}/>
              </div>
              <div className="content">
                <UserProfile user={this.state.user}/>
              </div>
          </>
        );
        } 
      }
    }
  }

  export default Dashboard;