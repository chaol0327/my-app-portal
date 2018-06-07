import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MainPage from './module/MainPage';
import {PATH_MAP as paths} from './common/Constant';
import DashboardPage from './module/dashboard/DashboardPage';
import TableSCPage from './module/table/TableSCPage';
import TableRKPage from './module/table/TableRKPage';
import TaskPage from './module/task/TaskPage';


const FadingRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} component={props => (
        <MainPage {...props}>
            <Component {...props}/>
        </MainPage>
    )}/>
)

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <Router>
            <Switch>
                <FadingRoute path={paths.tableSC} component={TableSCPage} />
                <FadingRoute path={paths.tableRK} component={TableRKPage}/>
                <FadingRoute path={paths.task} component={TaskPage}/>
                <FadingRoute component={TaskPage}/>
            </Switch>
      </Router>
    );
  }
}

export default App;
