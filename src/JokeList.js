import React, { Component } from "react";
import axios from "axios";
import "./JokeList.css";
import Joke from "./Joke";

export default class JokeList extends Component {
  static defaultProps = {
    numJokesToGet: 10,
  };
  constructor(props) {
    super(props);
    this.state = {
      jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
      isLoading:false
    };
    this.seenJokes = new Set(this.state.jokes.map(j=> j.text));
    this.handleClick = this.handleClick.bind(this);
  }

componentDidMount() {
      if(this.state.jokes.length === 0){
          this.getJokes()
      }
  }
 async getJokes(){
     try{
    let jokes = [];
    while (jokes.length < this.props.numJokesToGet) {
      let res = await axios.get("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" },
      });
      if(!this.seenJokes.has(res.data.joke)){
          jokes.push({ text: res.data.joke, vote: 0, id: res.data.id });
      } else{
          console.log("we have an issue")
      }
    }
    this.setState(st=>({
        isLoading:false,
        jokes:[...st.jokes, ...jokes]
    }),
    () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
    }catch(e){
        alert(e);
        this.setState({isLoading:false})
    }
  }

  handleVote(id, delta) {
    this.setState((st) => ({
      jokes: st.jokes.map((joke) =>
        joke.id === id ? { ...joke, vote: joke.vote + delta } : joke
      ),
    }),
    () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
  }

  handleClick(){
      this.setState({isLoading:true}, this.getJokes);

  }

  render() {
      if(this.state.isLoading){
          return (
              <div className="JokeList-spinner">
                  <i className="far fa-8x fa-laugh fa-spin" />
                  <h1 className="JokeList-title">Loading...</h1>
              </div>
          )
      }
      let jokes = this.state.jokes.sort((a,b)=> b.vote-a.vote)
    return (
      <div className="JokeList">
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title">
            <span>Dad</span> Jokes
          </h1>
          <img alt="laughing emoji" src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg" />
          <button className="JokeList-getmore" onClick={this.handleClick}>New Jokes</button>
        </div>
        <div className="JokeList-jokes">
          {jokes.map((joke) => (
            <Joke
              text={joke.text}
              votes={joke.vote}
              key={joke.id}
              id={joke.id}
              upvote={() => this.handleVote(joke.id, 1)}
              downvote={() => this.handleVote(joke.id, -1)}
            />
          ))}
        </div>
      </div>
    );
  }
}
