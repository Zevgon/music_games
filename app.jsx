import React, { Component } from 'react';
import { MEDALS } from './medals';

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
      medal: localStorage.getItem('medal'),
    }

    this.numImages = images.length;

    this.handleChange = this.handleChange.bind(this);
    this.handleGuess = this.handleGuess.bind(this);
    this.start = this.start.bind(this);
    this.tick = this.tick.bind(this);
    this.won = this.won.bind(this);
    this.reset = this.reset.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.skip = this.skip.bind(this);
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
    return this.state.images.length === 0;
  }

  removeImage() {
    this.state.images = this.state.images.slice(0, this.state.current)
      .concat(this.state.images.slice(this.state.current + 1));
  }

  handleGuess(e) {
    if (e) e.preventDefault();
    const curNote = this.state.images[this.state.current][0];
    if (this.state.guess.trim().toUpperCase() === curNote) {
      this.removeImage();
      if (this.won()) {
        clearInterval(this.interval);
        const bestTime = localStorage.getItem('bestTime');
        let newBest;
        if (bestTime) {
          if (this.state.time < parseInt(bestTime)) {
            localStorage.setItem('bestTime', this.state.time);
            newBest = localStorage.getItem('bestTime');
          }
        } else {
          localStorage.setItem('bestTime', this.state.time);
          newBest = localStorage.getItem('bestTime');
        }
        const medal = this.getMedal(newBest);
        this.setState({
          guess: '',
          congratulation: true,
          medal
        });
      } else {
        this.setState({
          guess: '',
          current: this.state.current % this.state.images.length,
        });
      }
    }
  }

  getMedal(time) {
    if (!time) return this.state.medal;
    let ret;
    const ratio = this.state.time / this.numImages;
    Object.entries(MEDALS).forEach(([medalName, medal]) => {
      if (ratio < medal.secondsPerAnswer) {
        ret = medalName;
      }
    });
    return ret;
  }

  skip(e) {
    e.preventDefault();
    const newIdx = (this.state.current + 1) % this.state.images.length
    this.setState({
      current: newIdx,
    });
  }

  reset() {
    this.setState({
      congratulation: false,
      current: 0,
      ongoing: false,
      time: 0,
      images: shuffle(this.props.images.slice(0)),
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
    const input = this.state.congratulation ? null : (
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
    const bestTime = localStorage.getItem('bestTime')
    const bestTimeComp = bestTime ? (
      <div>Best time: {bestTime}</div>
    ) : null;
    window.MEDALS = MEDALS;
    const medal = this.state.medal ? (
      <img
        className="medal"
        src={MEDALS[this.state.medal].img}
        width="200px"
        height="200px"
      />
    ) : null;
    return(
      <div className="game-container">
        <div className="play-area">
          {
            this.state.congratulation ? congratulation : (
              <img
                src={this.state.images[this.state.current][1]}
                className="note-img"
                height="425px"
                width="475"
              />
            )
          }
          {this.state.ongoing ? input : start}
          <form className="button-container">
            <button
              onClick={this.skip}
              className="game-btn skip"
            >Skip
            </button>
            <div className="time-container">
              {this.state.ongoing ? (
                <div className="time">Current time: {this.state.time}</div>
              ) : null}
              {bestTimeComp}
            </div>
            <button
              onClick={this.handleGuess}
              className="game-btn check"
            >Check
            </button>
          </form>
        </div>
        {medal}
      </div>
    );
  }
}
