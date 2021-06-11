import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Board from './board';
import './app.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
        <div>
          <Board id='abc'  />
        </div>
    );
  }
}

const AppRouter = () => (
  <Router>
    <Route path="/" exact component={App} />
  </Router>
);

export default AppRouter;
