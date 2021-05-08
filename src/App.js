import './App.css';
import JokeList from './JokeList';
import React, { Component } from 'react'

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <JokeList />
      </div>
    )
  }
}
