import React from 'react';
import { render } from 'react-dom';


const App = function() {
  return (
    <div>Hi!</div>
  );
}


document.addEventListener('DOMContentLoaded', () => {
  const appEl = document.getElementById('app');
  render(<App />, appEl);
});
