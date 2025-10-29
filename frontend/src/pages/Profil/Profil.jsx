import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Profil.css';

export const Profil = () => {
    //Récupération des infos depuis localStorage
    const userName = localStorage.getItem('userName') || 'Non défini';
    const email = localStorage.getItem('email') || 'Non défini';
    const creationDate = localStorage.getItem('creation_date') || 'Non définie';
    const photoProfil = localStorage.getItem('photo_profil') || 'avatar.jpg';

    const navigate = useNavigate();

    const handleEdit = () => {
        navigate('/editprofil');
    };

    const logout = () => {
        localStorage.clear();
        window.dispatchEvent(new CustomEvent('stateChange'));
        navigate('/login');
    };
    return (
        <>
            <h1 className='profile-title'> Bienvenue sur notre site !</h1><br/>
            <div className='under-title'>Bonjour, <span>{userName} 👋</span></div> 
            <div className="profile-container ">
                <div className="profile-card ">
                    <img src={`http://localhost:4000/uploads/${photoProfil}`} alt="Photo de profil" style={{ width: '250px', borderRadius: '50%' }}/>
                    <p><span>Username :</span> {userName}</p>
                    <p><span>Email :</span> {email}</p>
                    <p><span>Date de création :</span> {creationDate ? new Date(creationDate).toLocaleDateString() : 'Non définie'}</p> 
                    <div className="profile-button">
                        <button className="btn btn-primary" onClick={handleEdit}>Modifier</button>
                        <button onClick={logout} className="btn btn-secondary">Se déconnecter</button>
                    </div>           
                </div>
            </div>
        </>
    );
};