import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfil.css';
import poubelle from '../../components/assets/images/poubelle.png';

const EditProfil = () => {
    const navigate = useNavigate();
    
    //État initial avec les valeurs du localStorage
    const [formData, setFormData] = useState({
        userName : localStorage.getItem('userName') || '',
        email : localStorage.getItem('email') || '',
        password : '', // Le mot de passe n'est pas récupéré du localStorage pour des raisons de sécurité
        photo_profil : null
    })

    const [fileName, setFileName] = useState(
    localStorage.getItem('photo_profil') && localStorage.getItem('photo_profil') !== 'avatar.jpg' 
        ? localStorage.getItem('photo_profil').split('/').pop() 
        : 'Aucune photo choisie'
    );    
    const [deletePhoto, setDeletePhoto] = useState(false);;
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData( prev => ({
            ...prev, //conserver toutes les valeurs existantes
            [name]: value //met à jour uniquement le champ modifié
        }));
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                photo_profil: file
            }));
            setFileName(file.name);
            setDeletePhoto(false);
        }
    };
    const handleDeletePhoto = () => {
        setFormData(prev => ({ 
            ...prev,
            photo_profil: null
        }));
        setFileName('Aucune photo choisie');
        setDeletePhoto(true);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Non authentifié');

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.userName);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('deletePhoto', deletePhoto ? 'true' : 'false');
        
        if (formData.password) {
            formDataToSend.append('password', formData.password);
        }
        
        if (formData.photo_profil && !deletePhoto) {
            formDataToSend.append('photo', formData.photo_profil);
        }

        const response = await fetch('http://localhost:4000/api/auth/editprofil', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formDataToSend
        });

        // Vérification du Content-Type
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            throw new Error(`Le serveur a renvoyé une réponse non-JSON: ${text.substring(0, 100)}`);
        }

        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error(data.error || 'Erreur inconnue');
        }

        // Mise à jour du localStorage
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('email', data.user.email);
        localStorage.setItem('photo_profil', data.user.photo_profil);

        setSuccess('Profil mis à jour avec succès');
        setTimeout(() => navigate('/profil'), 1500);

        } catch (err) {
            setError(err.message);
            console.error('Erreur lors de la mise à jour:', err);
        }
    };
    return (
        <div className="edit-container">
            <div className="form-card">
                <h2>Modifier votre profil</h2>
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-container">
                        <div className="form-content">
                            <label htmlFor="userName">Username :</label>
                            <input type="text" name="userName" id="userName" value={formData.userName} onChange={handleChange} />
                        </div>
                        <div className="form-content">
                            <label htmlFor="email">Email :</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-container">
                        <div className="form-content">
                            <label htmlFor="password">Mot de passe :</label>
                            <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} className="password-input"  />
                        </div>
                        <div className="form-content">
                            <label>Photo de profil :</label>
                            <div className="input-wrapper">
                                <div className="input-file-container">
                                    <input type="file" name="photo_profil" id="photo_profil" className="photo-profil-input" onChange={handleFileChange} style={{ display: 'none' }} accept="image/*"/>
                                    <button type="button" id="custom_file_button" className="btn-file" onClick={() => document.getElementById('photo_profil').click()}>Choisir une photo</button>
                                    <span id="file_name">{fileName}</span>
                                </div>
                                <input type="hidden" name="delete_photo" value={deletePhoto ? '1' : '0'} />
                                <button type="button" id="delete_button" className="btn-delete" onClick={handleDeletePhoto} style={{ background: `url(${poubelle}) no-repeat center center`, backgroundSize: 'contain', width: '20px', height: '20px', border: 'none', cursor: 'pointer', padding: 0, marginLeft: '10px'}} aria-label="Supprimer"/>                           
                            </div>
                        </div>
                    </div>
                    <button type="submit" name="update_profile" className="btn">
                        Mettre à jour le profil
                    </button>
                </form>
                <p><a href="/profil" className='retour-profile'>Retour à mon profil</a></p>
            </div>
        </div>
    );
};
export default EditProfil;