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
            <Protected />
          </Route>
          <Route path="/cancel">
            <Comprobante />
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
  return (<div>Home.</div>)
}

function Protected(){
  const [passedQueue, setPassedQueue] = useState(false);  
  const [cancelled, setCancelled] = useState(false);

  const handleQueueEventListener = (e)=>{
    console.log("queue passed event")
    setPassedQueue(true);
  }

  useEffect(()=>{
    window.addEventListener("queuePassed", handleQueueEventListener);
    return ()=>{
      window.removeEventListener("queuePassed", handleQueueEventListener);
    };
  }, [])


  useEffect(() => {
    if(passedQueue){
      console.warn("making api calls!");
    }else{
      //If the user hasn't gone through the queue when running this component, send him to the queue
      console.log("validating user")      
      window.QueueIt.validateUser();
    }
  }, [passedQueue])

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

function Comprobante(){
  const [passedQueue, setPassedQueue] = useState(false);

  const handleQueueEventListener = (e)=>{
    console.log("cancel queue passed event");
    setPassedQueue(true);
  }

  useEffect(()=>{
    window.addEventListener("queuePassed", handleQueueEventListener);
    return ()=>{
      window.removeEventListener("queuePassed", handleQueueEventListener);
    };
  }, [])

  useEffect(()=>{
    console.log("cancel - validating user.")
    window.QueueIt.validateUser();
  }, [passedQueue]);

  return (<div>
    Sessions has been cancelled, you will start over from the end of the queue next time.
  </div>)
}

export default App;
