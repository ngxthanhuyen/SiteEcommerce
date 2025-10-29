import React from 'react';
import './App.css';
import { Header } from './components/Header/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Accueil from './pages/Accueil/Accueil';
import AboutUs from './pages/AboutUs/AboutUs';
import Produits from './pages/Produits/Produits';
import Panier from './pages/Panier/Panier';
import { Profil } from './pages/Profil/Profil';
import { LoginSignup } from './pages/LoginSignup/LoginSignup';
import EditProfil from './pages/Edit/EditProfil';
import ListeEnvie from './pages/ListeEnvie/ListeEnvie';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/produits" element={<Produits />} />
          <Route path="/login" element={<LoginSignup/>} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/liste-envie" element={<ListeEnvie />} />
          <Route path="/panier" element={<Panier/>} />
          <Route path="/editprofil" element={<EditProfil />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
