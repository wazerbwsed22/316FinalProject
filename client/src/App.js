
import './stylesheets/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FakeStackOverflow from './components/fakestackoverflow.js';
import LoginPage from './components/screens/loginpageScreen.js';
import AccountCreationPage from './components/screens/registerScreen.js';
import React, { useState } from 'react';
import WelcomePage from './components/screens/welcome-page.js';
import { UserProvider } from './components/user-context.js';
import PostCommentPage from './components/screens/postCommentScreen.js';

function App() {
  return (
    <UserProvider>
      <Router>
        <section className="fakeso">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/mainstackoverflow" element={<FakeStackOverflow />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<AccountCreationPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/comment" element={<PostCommentPage />} />
          </Routes>
        </section>
      </Router>
    </UserProvider>
  );
}


const UserProfile = () => {
  return (
      <div>
      <h1>User Profile Page</h1>
      <p>Username: {}</p>
      <p>Email: {}</p> </div>
  );
}

export default App;




