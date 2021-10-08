import React from 'react';
import UserProfile from "./UserProfile";

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
            <div>
              <div className="container rounded bg-white mt-5 mb-5">
                <div className="row">
                <div className="col-md-3 border-right">
                  <div className="d-flex flex-column align-items-center text-center p-3 py-5">Navbar</div>
                </div>
                <div className="col-md-9 border-right"><UserProfile user={this.state.user}/></div>
                </div>
              </div>
              
          </div>
        );
        } 
      }
    }
  }

  export default Dashboard;