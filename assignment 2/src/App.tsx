import React from 'react';
import './resources/css/styles.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Users from "./components/Users";
import User from "./components/User";
import NotFound from "./components/NotFound";

function App() {
  return (
    <div className="App">
      <Router>

      <div>
        <Routes>  
          ee https://v5.reactrouter.com/web/guides/quick-start
          NG365 - Structuring Client-side Applications in React 3 / 10
          <Route path="/users" element={<Users/>}/>
          <Route path="/users/:id" element={<User/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </div>

      </Router>
    </div>
    );
}

export default App;
