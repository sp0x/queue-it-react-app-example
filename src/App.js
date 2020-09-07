import React, { useEffect, useState } from 'react';
import  { Redirect } from 'react-router-dom'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';

function App() {
  const [passedQueue, setPassedQueue] = useState(false);

  useEffect(()=>{
    window.addEventListener("queuePassed", ()=> {
      console.log("Got queue passed event.")
      setPassedQueue(true)
    });
    return ()=>{
      window.removeEventListener("queuePassed", ()=>{});
    };
  }, [])

  console.log("render app")
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/protected">Protected</Link>
            </li>
            <li>
              <Link to="/cancel">Cancel</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/protected">
            <Protected passedQueue={passedQueue} />
          </Route>
          <Route path="/cancel">
            <Cancel passedQueue={passedQueue} onCancel={()=>{
              console.log("set passedQueue to false")
              setPassedQueue(false)
            }} />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home(){
  return (<div>Home</div>)
}

function Protected(props){
  const passedQueue = props.passedQueue;
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    if(passedQueue){
      console.warn("making api calls!");
    }
  }, [passedQueue])

  console.log("Passed queue in protected: " , passedQueue);
  if(cancelled){
    console.log("redirecting to cancel");
    return (
      <Redirect to="/cancel"/>
    )
  }else{
    if(!passedQueue){
      return (<div>You'll be queued..</div>)
    }else{
      return (
        <div>
          This is my protected content<br/>
          <button onClick={()=>setCancelled(true)}>Cancel</button>
        </div>
      )
    }
  }
}

function Cancel(props){
  const passedQueue = props.passedQueue;

  useEffect(()=>{
    if(passedQueue){
      props.onCancel();
    }
  });

  return (<div>
    Sessions has been cancelled, you will start over from the end of the queue next time.
  </div>)
}

export default App;
