import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { Video, User, Globe, Phone, Calendar, Clock, ArrowLeft, Heart, Stethoscope } from 'lucide-react';

const HomePage = () => {
    const [patientName, setPatientName] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("english");
    const [selectedProvider, setSelectedProvider] = useState("");
    const [isEmergency, setIsEmergency] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get pre-filled data from URL params (from main app)
    const urlParams = new URLSearchParams(location.search);
    const preFilledName = urlParams.get('name') || '';
    const preFilledLanguage = urlParams.get('language') || 'english';
    const preFilledProvider = urlParams.get('provider') || '';
    const emergency = urlParams.get('emergency') === 'true';
    
    // Set initial values from URL params
    React.useEffect(() => {
        if (preFilledName) setPatientName(preFilledName);
        if (preFilledLanguage) setSelectedLanguage(preFilledLanguage);
        if (preFilledProvider) setSelectedProvider(preFilledProvider);
        if (emergency) setIsEmergency(true);
    }, [preFilledName, preFilledLanguage, preFilledProvider, emergency]);

    const languages = [
        { code: 'english', name: 'English', native: 'English', flag: '🇺🇸' },
        { code: 'hindi', name: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
        { code: 'punjabi', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
    ];

    const healthcareProviders = [
        { id: 'dr-singh', name: 'Dr. Rajesh Singh', specialty: 'General Medicine', languages: ['hindi', 'english'], available: true, avatar: '👨‍⚕️' },
        { id: 'dr-kaur', name: 'Dr. Priya Kaur', specialty: 'Pediatrics', languages: ['punjabi', 'hindi', 'english'], available: true, avatar: '👩‍⚕️' },
        { id: 'dr-sharma', name: 'Dr. Amit Sharma', specialty: 'Cardiology', languages: ['hindi', 'english'], available: false, avatar: '👨‍⚕️' },
        { id: 'dr-gill', name: 'Dr. Simran Gill', specialty: 'Gynecology', languages: ['punjabi', 'english'], available: true, avatar: '👩‍⚕️' },
        { id: 'dr-kumar', name: 'Dr. Vikram Kumar', specialty: 'Emergency Medicine', languages: ['hindi', 'punjabi', 'english'], available: true, avatar: '👨‍⚕️' }
    ];

    const getLanguageText = (key) => {
        const translations = {
            english: {
                title: 'Multilingual Telemedicine Consultation',
                subtitle: 'Connect with healthcare providers through video consultations',
                patientName: 'Patient Name',
                selectLanguage: 'Select Language',
                selectProvider: 'Select Healthcare Provider',
                emergency: 'Emergency Consultation',
                joinCall: 'Start Video Consultation',
                backToApp: 'Back to Main App',
                available: 'Available',
                busy: 'Currently Busy',
                specialty: 'Specialty',
                languages: 'Languages',
                poweredBy: 'Powered by TeleHealth'
            },
            hindi: {
                title: 'बहुभाषी टेलीमेडिसिन परामर्श',
                subtitle: 'वीडियो परामर्श के माध्यम से स्वास्थ्य सेवा प्रदाताओं से जुड़ें',
                patientName: 'रोगी का नाम',
                selectLanguage: 'भाषा चुनें',
                selectProvider: 'स्वास्थ्य सेवा प्रदाता चुनें',
                emergency: 'आपातकालीन परामर्श',
                joinCall: 'वीडियो परामर्श शुरू करें',
                backToApp: 'मुख्य ऐप पर वापस जाएं',
                available: 'उपलब्ध',
                busy: 'वर्तमान में व्यस्त',
                specialty: 'विशेषज्ञता',
                languages: 'भाषाएं',
                poweredBy: 'टेलीहेल्थ द्वारा संचालित'
            },
            punjabi: {
                title: 'ਬਹੁਭਾਸ਼ੀ ਟੈਲੀਮੈਡੀਸਨ ਸਲਾਹ',
                subtitle: 'ਵੀਡੀਓ ਸਲਾਹ ਦੇ ਰਾਹੀਂ ਸਿਹਤ ਸੇਵਾ ਪ੍ਰਦਾਤਾਵਾਂ ਨਾਲ ਜੁੜੋ',
                patientName: 'ਮਰੀਜ਼ ਦਾ ਨਾਮ',
                selectLanguage: 'ਭਾਸ਼ਾ ਚੁਣੋ',
                selectProvider: 'ਸਿਹਤ ਸੇਵਾ ਪ੍ਰਦਾਤਾ ਚੁਣੋ',
                emergency: 'ਜ਼ਰੂਰੀ ਸਲਾਹ',
                joinCall: 'ਵੀਡੀਓ ਸਲਾਹ ਸ਼ੁਰੂ ਕਰੋ',
                backToApp: 'ਮੁੱਖ ਐਪ ਤੇ ਵਾਪਸ ਜਾਓ',
                available: 'ਉਪਲਬਧ',
                busy: 'ਵਰਤਮਾਨ ਵਿੱਚ ਵਿਅਸਤ',
                specialty: 'ਮੁਹਾਰਤ',
                languages: 'ਭਾਸ਼ਾਵਾਂ',
                poweredBy: 'ਟੈਲੀਹੈਲਥ ਦੁਆਰਾ ਸੰਚਾਲਿਤ'
            }
        };
        return translations[selectedLanguage]?.[key] || translations.english[key];
    };

    const submitHandler = () => {
        if (patientName.trim() && selectedProvider) {
            const provider = healthcareProviders.find(p => p.id === selectedProvider);
            const roomId = `${selectedProvider}-${Date.now()}`;
            const languageParam = selectedLanguage;
            const emergencyParam = isEmergency ? 'true' : 'false';
            
            navigate(`/room/${roomId}?username=${encodeURIComponent(patientName)}&language=${languageParam}&provider=${selectedProvider}&emergency=${emergencyParam}`);
        }
    };

    const availableProviders = healthcareProviders.filter(p => p.available);
    const emergencyProviders = healthcareProviders.filter(p => p.available && p.specialty === 'Emergency Medicine');

    return (
        <div className="healthcare-container">
            {/* Header */}
            <div className="healthcare-header">
                <div style={{maxWidth: '1024px', margin: '0 auto', padding: '16px'}}>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <button 
                            onClick={() => window.history.back()}
                            className="back-button"
                        >
                            <ArrowLeft style={{width: '16px', height: '16px'}} />
                            {getLanguageText('backToApp')}
                        </button>
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                            <div style={{width: '32px', height: '32px', background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <Video style={{width: '16px', height: '16px', color: 'white'}} />
                            </div>
                            <h1 style={{fontSize: '18px', fontWeight: '600', color: '#111827'}}>Telemedicine</h1>
                        </div>
                        <div style={{width: '96px'}}></div>
                    </div>
                </div>
            </div>

            <div style={{maxWidth: '1024px', margin: '0 auto', padding: '32px 16px'}}>
                {/* Hero Section */}
                <div style={{textAlign: 'center', marginBottom: '32px'}}>
                    <h2 style={{fontSize: '30px', fontWeight: 'bold', color: '#111827', marginBottom: '16px'}}>
                        {getLanguageText('title')}
                    </h2>
                    <p style={{fontSize: '18px', color: '#6b7280', marginBottom: '24px'}}>
                        {getLanguageText('subtitle')}
                    </p>
                    
                    {/* Emergency Badge */}
                    {isEmergency && (
                        <div style={{display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fef2f2', color: '#991b1b', padding: '8px 16px', borderRadius: '9999px', fontSize: '14px', fontWeight: '500', marginBottom: '24px'}}>
                            <Heart style={{width: '16px', height: '16px'}} />
                            Emergency Consultation
                        </div>
                    )}
                </div>

                {/* Main Form */}
                <div className="healthcare-card">
                    <div style={{display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box'}}>
                        {/* Patient Name */}
                        <div>
                            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
                                {getLanguageText('patientName')}
                            </label>
                            <div className="healthcare-input-container">
                                <User className="healthcare-input-icon" />
                                <input
                                    type="text"
                                    value={patientName}
                                    onChange={(e) => setPatientName(e.target.value)}
                                    placeholder="Enter Your Name"
                                    className="healthcare-input"
                                />
                            </div>
                        </div>

                        {/* Language Selection */}
                        <div>
                            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '12px'}}>
                                {getLanguageText('selectLanguage')}
                            </label>
                            <div className="language-grid">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => setSelectedLanguage(lang.code)}
                                        className={`language-button ${selectedLanguage === lang.code ? 'selected' : ''}`}
                                    >
                                        <div style={{fontSize: '24px', marginBottom: '8px'}}>{lang.flag}</div>
                                        <div style={{fontWeight: '500'}}>{lang.native}</div>
                                        <div style={{fontSize: '12px', color: '#6b7280'}}>{lang.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Provider Selection */}
                        <div>
                            <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '12px'}}>
                                {getLanguageText('selectProvider')}
                            </label>
                            <div className="provider-list">
                                {(isEmergency ? emergencyProviders : availableProviders).map((provider) => (
                                    <button
                                        key={provider.id}
                                        onClick={() => setSelectedProvider(provider.id)}
                                        className={`provider-item ${selectedProvider === provider.id ? 'selected' : ''}`}
                                    >
                                        <div className="provider-info">
                                            <div className="provider-avatar">{provider.avatar}</div>
                                            <div className="provider-details">
                                                <div className="provider-name">{provider.name}</div>
                                                <div className="provider-specialty">{provider.specialty}</div>
                                                <div className="provider-languages">
                                                    <span style={{fontSize: '12px', color: '#6b7280'}}>{getLanguageText('languages')}:</span>
                                                    {provider.languages.map((lang) => {
                                                        const langObj = languages.find(l => l.code === lang);
                                                        return (
                                                            <span key={lang} className="language-tag">
                                                                {langObj?.native}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <div className="provider-status">
                                                <div className={`status-dot ${provider.available ? 'available' : 'busy'}`}></div>
                                                <span className="status-text">
                                                    {provider.available ? getLanguageText('available') : getLanguageText('busy')}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Emergency Toggle */}
                        <div className="emergency-toggle">
                            <input
                                type="checkbox"
                                id="emergency"
                                checked={isEmergency}
                                onChange={(e) => setIsEmergency(e.target.checked)}
                                className="emergency-checkbox"
                            />
                            <label htmlFor="emergency" className="emergency-label">
                                {getLanguageText('emergency')}
                            </label>
                        </div>

                        {/* Join Button */}
                        <button
                            onClick={submitHandler}
                            disabled={!patientName.trim() || !selectedProvider}
                            className="healthcare-button"
                        >
                            <Video style={{width: '20px', height: '20px'}} />
                            {getLanguageText('joinCall')}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div style={{textAlign: 'center', fontSize: '14px', color: '#6b7280'}}>
                    {getLanguageText('poweredBy')}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
