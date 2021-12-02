import { useCallback, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import useTimer from './Timer';

function App() {
  const [counter, setCounter] = useState(0)

  const callback = useCallback(() => {
    setCounter(old => old + 1)
  }, [])
  const timerHandler = useTimer("ws://192.168.0.150:3001", callback)

  const onStartHandler = () => {
    if (timerHandler === null) {
      alert("Timer is not connected!")
      return
    }
    timerHandler.start(500)
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p><button onClick={ onStartHandler }>Start / Sync</button></p>
        <p>{ counter }</p>
      </header>
    </div>
  );
}

export default App;
