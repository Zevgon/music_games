import React, { Component } from 'react';

const shuffle = a => {
  let j, x, i;
  for (i = a.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
  return a;
}

export default class App extends Component {
  constructor(props) {
    super(props);
    const randIdx = parseInt(Math.random() * this.props.images.length);
    const images = shuffle(this.props.images.slice(0));
    if (!images.length) {
      throw 'Must give at least one image';
    }
    this.state = {
      guess: '',
      current: 0,
      images,
      ongoing: false,
      time: 0,
      congratulation: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleGuess = this.handleGuess.bind(this);
    this.start = this.start.bind(this);
    this.tick = this.tick.bind(this);
    this.won = this.won.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    const that = this;
    document.addEventListener('keydown', e => {
      if (e.which === 13) {
        that.handleGuess();
      }
    });
  }

  handleChange(e) {
    this.setState({
      guess: e.target.value,
    });
  }

  won() {
    return this.state.current === this.state.images.length - 1;
  }

  handleGuess(e) {
    if (e) e.preventDefault();
    const curNote = this.state.images[this.state.current][0];
    if (this.state.guess.trim().toUpperCase() === curNote) {
      if (this.won()) {
        clearInterval(this.interval);
        this.setState({
          guess: '',
          congratulation: true,
        });
      } else {
        this.setState({
          guess: '',
          current: this.state.current + 1,
        });
      }
    }
  }

  handleSkip(e) {
    e.preventDefault();
  }

  reset() {
    this.setState({
      congratulation: false,
      current: 0,
      ongoing: false,
      time: 0,
    });
  }

  start() {
    this.setState({
      ongoing: true,
      congratulation: false,
    });
    this.startTimer();
  }

  startTimer() {
    this.interval = setInterval(this.tick, 1000);
  }

  tick() {
    this.setState({
      time: this.state.time + 1,
    });
  }

  render() {
    const input = (
      <input className="guess"
        placeholder="Enter a guess"
        onChange={this.handleChange}
        value={this.state.guess}
      />
    );
    const start = (
      <button
        className="game-btn start"
        onClick={this.start}
      >Start
      </button>
    );
    const congratulation = (
      <div className="congratulation">
        <div>
          Congratulations! You finished in {this.state.time} seconds.
        </div>
        <button
          className="game-btn try-again"
          onClick={this.reset}
        >Try again</button>
      </div>
    );
    return(
      <div>
        <div className="game-container">
          {this.state.congratulation ? congratulation : null}
          <img
            src={this.state.images[this.state.current][1]}
            className="note-img"
            height="425px"
            width="475"
          />
          {this.state.ongoing ? input : start}
          <form className="button-container">
            <button
              onClick={this.handleSkip}
              className="game-btn skip"
            >Skip
            </button>
            {this.state.ongoing ? (
              <div className="time">Time: {this.state.time}</div>
            ) : null}
            <button
              onClick={this.handleGuess}
              className="game-btn check"
            >Check
            </button>
          </form>
        </div>
      </div>
    );
  }
}
