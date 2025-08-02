// app.js
import React, { useEffect } from "react";
import Header from "./Header";
import Home from "./Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Watch_Video from "./Watch_Video";
import AvailableRooms from "./Availablerooms";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={[<Header></Header>, <Home></Home>]}></Route>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/signup' element={<Signup></Signup>}></Route>
          <Route path='/watch' element={[<Header></Header>, <Watch_Video></Watch_Video>]}></Route>
          <Route path='/rooms' element={[<Header></Header>, <AvailableRooms></AvailableRooms>]}></Route>

        </Routes>
      </div>
    </Router>
  );
}
export default App;
