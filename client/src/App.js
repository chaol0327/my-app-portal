import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MainPage from './module/MainPage';
import {PATH_MAP as paths} from './common/Constant';
import DashboardPage from './module/dashboard/DashboardPage';
import TablePage from './module/table/TablePage';
import Table2Page from './module/table/Table2Page';
import TaskPage from './module/task/TaskPage';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <Router>
        <MainPage>
            <Switch>
                <Route path={paths.table1} component={TablePage}/>
                <Route path={paths.table2} component={Table2Page}/>
                <Route path={paths.task} component={TaskPage}/>
                <Route component={DashboardPage}/>
            </Switch>
        </MainPage>
      </Router>
    );
  }
}

export default App;
