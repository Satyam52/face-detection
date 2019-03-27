import React, { Component } from 'react';
import Particles from 'react-particles-js';
import './App.css';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Navigation from './components/navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

 

const particle ={
    particles: {
      number:{
        value:200,
        density:{
              enable: true,
              // value_area:1000,
              shadow: {
                enable: true,
                color: "#3CA9D1",
                blur: 5
              }

        }
      }
       
        }
      }  
      
      const initialstate = {
        input:'',
        imageUrl:'',
        box: {},
        route :'signin',
        isSignedIn:false,
        user:{
        
          id:'',
          name:'',
          email:'',
          entry:0,
          joined:''
        }
      }
class App extends Component {
  constructor(){
    super();
    this.state = {
      input:'',
      imageUrl:'',
      box: {},
      route :'signin',
      isSignedIn:false,
      user:{
      
        id:'',
        name:'',
        email:'',
        entry:0,
        joined:''
      }
    }
  }
  loadUser = (data) =>{
    this.setState(
      {user : {
        id:data.id,
        name:data.name,
        email:data.email,
        entry:data.entry,
        joined:data.joined
      }
    }
    )
      

  }

  calculateFaceLocation = (data)=>{
    const clarifaiFace =data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
   return{
     leftCol: clarifaiFace.left_col * width,
     topRow: clarifaiFace.top_row * height,
     rightCol:width -(clarifaiFace.right_col * width),
     bottomRow: height -(clarifaiFace.bottom_row*height)
   }
  }
   displayFaceBox = (box) => {
     this.setState({box: box});
     console.log(box);
   }
  
  onInputChange =(event) =>{
    this.setState({input :event.target.value});
  }
  onSubmit = () =>{
    this.setState({ imageUrl:this.state.input })
    fetch('https://fierce-ravine-97896.herokuapp.com/imageurl',{
        method:'post',
       headers:{'Content-Type':'application/json'},
       body: JSON.stringify({
         input:this.state.input
    })
   })
   .then(response =>response.json())
    .then(response =>{
      if(response){
        fetch('https://fierce-ravine-97896.herokuapp.com/image',{
            method:'put',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
                id:this.state.user.id
             })
      })
        .then(response => response.json())
        .then(count =>{
          this.setState(Object.assign(this.state.user,{entry:count}))
        })
        .catch(console.log)
  }  
     this.displayFaceBox(this.calculateFaceLocation(response))
})
    .catch(err => console.log(err));
      // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
      // do something with response
  
}
  onRouteChange = (route) => {
    if(route ==='signout'){
      this.setState(initialstate)

    }else if(route ==='home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route});
  }
  render() {
    return (
      <div className="App">
      <Particles className="particle"
                 params={particle}/>
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        
        {this.state.route === 'home' 
        ?<div> 
        <Logo />
        <Rank name={this.state.user.name} entry={this.state.user.entry} />
        <ImageLinkForm 
        onInputChange={this.onInputChange}
          onButtonSubmit={this.onSubmit}
        />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
        </div>
        
        :(this.state.route ==='signin'
        ?<SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange } />
        :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )
        }
        </div>
        
    );
  }
}

export default App;
