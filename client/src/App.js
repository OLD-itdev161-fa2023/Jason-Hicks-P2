import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import EntryList from './components/EntryList/EntryList';
import Entry from './components/Entry/Entry';
import CreateEntry from './components/Entry/CreateEntry';
import EditEntry from './components/Entry/EditEntry';

class App extends React.Component {
  state = {
    entrys: [],
    entry: null,
    token: null,
    user: null
  };

  componentDidMount() {
      this.authenticateUser();
  }

  authenticateUser = () => {
    const token = localStorage.getItem('token');

    if(!token) {
      localStorage.removeItem('user')
      this.setState({ user: null });
    }

    if (token) {
      const config = {
        headers: {
          'x-auth-token': token
        }
      }
      axios.get('http://localhost:5000/api/auth', config)
        .then((response) => {
          localStorage.setItem('user', response.data.name)
          this.setState(
            {
              user: response.data.name,
              token: token
            },
            () => {
              this.loadData();
            }
          );
        })
        .catch((error) => {
          localStorage.removeItem('user');
          this.setState({ user: null });
          console.error(`Error logging in: ${error}`);
        })
    }
  }

  loadData = () => {
    const { token } = this.state;

    if (token) {
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      axios
        .get('http://localhost:5000/api/entrys', config)
        .then(response => {
          this.setState({
            entrys: response.data
          });
        })
        .catch(error => {
          console.error(`Error fetching data: ${error}`)
        });
    }
  };

  logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.setState({ user: null, token: null });
  }

  viewEntry = entry => {
    console.log(`view ${entry.title}`);
    this.setState({
      entry: entry
    });
  };

  deleteEntry = entry => {
    const { token } = this.state;

    if (token) {
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      axios
        .delete(`http://localhost:5000/api/entrys/${entry._id}`, config)
        .then(response => {
          const newEntrys = this.state.entrys.filter(p => p._id !== entry._id);
          this.setState({
            entrys: [...newEntrys]
          });
        })
        .catch(error => {
          console.error(`Error deleting entry: ${error}`);
        });
    }
  };

  editEntry = entry => {
    this.setState({
      entry: entry
    });
  };

  onEntryCreated = entry => {
    const newEntrys = [...this.state.entrys, entry];

    this.setState({
      entrys: newEntrys
    });
  };

  onEntryUpdated = entry => {
    console.log('update entry: ', entry);
    const newEntrys = [...this.state.entrys];
    const index = newEntrys.findIndex(p => p._id === entry._id);

    newEntrys[index] = entry;

    this.setState({
      entrys: newEntrys
    });
  };

  render() {
    let { user, entrys, entry, token } = this.state;
    const authProps = {
      authenticateUser: this.authenticateUser
    };

    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <h1>GoodThings</h1>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                {user ? (
                  <Link to="/new-entry">New Entry</Link>
                ) : (
                  <Link to="/register">Register</Link>
                )}
              </li>
              <li>
                {user ? ( 
                  <Link to="" onClick={this.logOut}>
                    logOut
                  </Link> 
                ) : (
                  <Link to="/login">Log in</Link> 
                )}
              </li>
            </ul>
          </header>
          <main>
            <Switch>
              <Route exact path="/">
                {user ? (
                  <React.Fragment>
                    <div>Hello {user}!</div>
                    <EntryList 
                      entrys={entrys} 
                      clickEntry={this.viewEntry} 
                      deleteEntry={this.deleteEntry}
                      editEntry={this.editEntry}
                    />
                  </React.Fragment>
                ) : (
                  <React.Fragment>Please Register or Login</React.Fragment>
                )}
              </Route>
              <Route path="/entrys/:entryId">
                <Entry entry={entry} />
              </Route>
              <Route path="/new-entry">
                <CreateEntry token={token} onEntryCreated={this.onEntryCreated} />
              </Route>
              <Route path="/edit-entry/:entryId">
                <EditEntry
                  token={token}
                  entry={entry}
                  onEntryUpdated={this.onEntryUpdated}
                />
              </Route>
              <Route
                exact
                path="/register" 
                render={() => <Register {...authProps} />}
              />
              <Route
                exact
                path="/login"
                render={() => <Login {...authProps} />}
              />
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;