import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import MainPage from './module/MainPage';
import DashboardPage from './module/dashboard/DashboardPage';
import TablePage from './module/table/TablePage';
import TaskPage from './module/task/TaskPage';
import {PATH_MAP as paths} from './common/Constant';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <Router>
        {/* <Route path={paths.login} component={LoginPage}/> */}
        <Route path={paths.main} component={MainPage}>
        </Route>
      </Router>
    );
  }
}

export default App;
