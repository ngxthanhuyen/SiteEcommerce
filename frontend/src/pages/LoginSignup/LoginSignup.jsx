import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css';

export const LoginSignup = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [photo, setPhoto] = useState(null); 
    const [password, setPassword] = useState('');
    const [agree, setAgree] = useState(false);
    const [flashMessage, setFlashMessage] = useState(null);
    const [flashType, setFlashType] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation de base
        if (!email.trim() || !password.trim() || (!isLogin && (!name.trim() || !agree))) {
            setFlashType('error');
            setFlashMessage(
                !email.trim() || !password.trim()
                    ? 'Veuillez remplir tous les champs obligatoires !'
                    : !name.trim()
                    ? 'Veuillez saisir votre nom !'
                    : 'Vous devez accepter les conditions pour vous inscrire !'
            );
            return;
        }

        try {
            let res;
            if (isLogin) {
                // Connexion (JSON)
                res = await fetch('http://localhost:4000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const data = await res.json();

                if (res.ok) {
                    setFlashType('success');
                    setFlashMessage('Connexion réussie !');
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userName', data.name);
                    localStorage.setItem('email', data.email);
                    localStorage.setItem('photo_profil', data.photo_profil);
                    localStorage.setItem('creation_date', data.creation_date);
                    localStorage.setItem('userId', data._id); 

                    window.dispatchEvent(new CustomEvent('stateChange'));
                    navigate('/profil');
                } else {
                    throw new Error(data.message || 'Une erreur est survenue.');
                }
            } else {
                // Inscription (FormData) => permet de construire un ensemble de paires clé-valeur pour envoyer des données
                const formData = new FormData();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('password', password);
                if (photo) formData.append('photo', photo);

                res = await fetch('http://localhost:4000/api/auth/register', {
                    method: 'POST',
                    body: formData,
                });
                const data = await res.json();
                console.log('Réponse login:', data);

                if (res.ok) {
                    setFlashType('success');
                    setFlashMessage("Inscription réussie ! Connectez-vous.");
                    setTimeout(() => {
                        setIsLogin(true);
                        navigate('/login');
                    }, 1500);
                } else {
                    throw new Error(data.message || 'Une erreur est survenue.');
                }
            }
        } catch (err) {
            console.error('Erreur :', err);
            setFlashType('error');
            setFlashMessage(err.message || 'Erreur réseau. Vérifie ta connexion.');
        }
    };

    return (
        <>
            <div className='loginsignup'>
                <div className="loginsignup-container">
                    <h1>{isLogin ? 'Se connecter' : "S'inscrire"}</h1>
                    {/* Message flash */}
                    {flashMessage && (
                        <div
                            style={{
                                marginBottom: '15px',
                                padding: '10px',
                                borderRadius: '5px',
                                color: flashType === 'success' ? 'green' : 'red',
                                border: `1px solid ${flashType === 'success' ? 'green' : 'red'}`,
                                fontWeight: 'bold',
                            }}
                        >
                            {flashMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="loginsignup-fields">
                        {!isLogin && (
                            <input
                                type='text'
                                placeholder='Votre nom...'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        )}
                        <input
                            type="text"
                            placeholder='Votre adresse mail...'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder='Votre mot de passe...'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {!isLogin && (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setPhoto(e.target.files[0])}
                                className='photo-upload-input'
                            />
                        )}
                        <button type="submit">{isLogin ? "Se connecter" : "S'inscrire"}</button>
                    </form>
                    {isLogin ? (
                        <p className='loginsignup-login'>
                            Pas encore de compte ? <span onClick={() => { setIsLogin(false); setFlashMessage(null); }}>Inscrivez-vous !</span>
                        </p>
                    ) : (
                        <p className="loginsignup-login">
                            Vous avez déjà un compte ? <span onClick={() => { setIsLogin(true); setFlashMessage(null); }}>Connectez-vous !</span>
                        </p>
                    )}
                    <div className="loginsignup-agree">
                        {!isLogin && (
                            <>
                                <input
                                    className='checkbox'
                                    type="checkbox"
                                    id="agree"
                                    checked={agree}
                                    onChange={(e) => setAgree(e.target.checked)}
                                />
                                <p>
                                    En continuant, j'accepte d'utiliser les conditions
                                    d'utilisation et la politique de confidentialité
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};