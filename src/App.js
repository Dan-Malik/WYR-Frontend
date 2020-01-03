import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import {Container} from 'react-bootstrap';

import Navbar from './components/navigationBar.component';
import QuestionBox from './components/questionBox.component';
import LoginPage from './components/loginPage.component';
import SignUpPage from './components/signUpPage.component';

function App() {
  return (
    <div>

<Navbar/>
<br/>

<Container>
  
<Router>
<Switch>
  <Route exact path="/question/id/:id" component={QuestionBox}/>
  <Route exact path="/login" component={LoginPage}/>
  <Route exact path="/signup" component={SignUpPage}/>
</Switch>
</Router>


</Container>
    </div>
  );
}

export default App;
