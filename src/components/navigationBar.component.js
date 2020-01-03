import React, { Component } from 'react';

import { Navbar, Nav } from 'react-bootstrap';


import { authService} from '../services/authService';

class NavigationBar extends Component {

  constructor(props){
    super(props)

    this.state = {
      currentUser: null
    }
  }

  componentDidMount(){
    authService.currentUser.subscribe(userData => this.setState({currentUser: userData}))
  }

  render() {
    const {currentUser} = this.state;
    
if(!currentUser){

   const notLoggedInBar = <Navbar className="border" bg="nav" expand="lg">
    <Navbar.Brand href="/"><h2>Choosr</h2></Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link href="/random">Random question</Nav.Link>

        <Nav.Link href="/latest">Latest questions</Nav.Link>

      </Nav>
      <Nav>

        <Nav.Link href="/signup">Sign Up</Nav.Link>

        <Nav.Link href="/login">Log In</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>

  return (notLoggedInBar);
}

else{

const loggedInBar = <Navbar className="border" bg="nav" expand="lg">
<Navbar.Brand href="/"><h2>Choosr</h2></Navbar.Brand>
<Navbar.Toggle aria-controls="basic-navbar-nav" />
<Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
    <Nav.Link href="/random">Random question</Nav.Link>

    <Nav.Link href="/latest">Latest questions</Nav.Link>

  </Nav>
  <Nav>

    <Nav.Link href="/create">Create a new question</Nav.Link>

    <Nav.Link href="/" onSelect={authService.logout}>Log out</Nav.Link>
  </Nav>

</Navbar.Collapse>
</Navbar>


    return (loggedInBar);
}
  }
}

export default NavigationBar;