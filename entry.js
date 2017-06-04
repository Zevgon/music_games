import React from 'react';
import { render } from 'react-dom';
import App from './app';
import { TREBLE_CLEF } from './note_names';

let allTrebleImages = [];

Object.keys(TREBLE_CLEF).forEach(note => {
  if (TREBLE_CLEF.hasOwnProperty(note)) {
    TREBLE_CLEF[note].forEach(octave => {
      allTrebleImages.push([note, octave]);
    })
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const appEl = document.getElementById('app');
  render(<App images={allTrebleImages} />, appEl);
});
