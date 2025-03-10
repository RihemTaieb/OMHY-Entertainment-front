import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';
import customLogodark from '../../assets/img/custom-logo-dark.png'
import customLogo from '../../assets/img/custom-logo.png';
import { StyleSheetManager ,styled } from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube, faSpotify } from "@fortawesome/free-brands-svg-icons";
import Slider from 'react-slick'; // Assuming you're using react-slick for the carousel

// Flèche précédente
const PrevArrow = ({ onClick }) => (
  <button 
    className="slick-prev"
    onClick={onClick}
    style={{
      position: "absolute",
      left: "-50px",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 10,
      background: "rgba(0, 0, 0, 0.5)",
      border: "none",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      color: "white",
      fontSize: "20px",
      cursor: "pointer",
    }}
  >
  </button>
);

// Flèche suivante
const NextArrow = ({ onClick }) => (
  <button 
    className="slick-next"
    onClick={onClick}
    style={{
      position: "absolute",
      right: "-50px",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 10,
      background: "rgba(0, 0, 0, 0.5)",
      border: "none",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      color: "white",
      fontSize: "20px",
      cursor: "pointer",
    }}
  >
  </button>
);
const GoBackButton = styled.button`
  position: fixed;
  bottom: 20px;
  left: 20px; /* Positioned on the left side */
  width: 50px;
  height: 50px;
  background: #111;
  color: ${(props) => (props.isDark ? "#000" : "#fff")};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1000;
  display: block; /* Always visible */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  transition: background 0.3s ease, transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
    background-color: #616161;
  }
`;

const SocialIconsContainer = styled.div`
position: fixed;
top: 50%;
right: 0;
transform: translateY(-50%);
display: flex;
flex-direction: column;
gap: 15px;
z-index: 1000;
  margin-right: 20px;
`;

// Individual social icon
const SocialIcon = styled.a`
width: 40px;
height: 40px;
background-color: #111;
color: white;
display: flex;
justify-content: center;
align-items: center;
border-radius: 50%;
text-decoration: none;
font-size: 20px;
transition: background-color 0.3s;


`;
const ScrollToTopButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: #111;
  color: ${(props) => (props.isDark ? "#000" : "#fff")};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1000;
  display: ${(props) => (props.$visible ? "block" : "none")};  // Changed to $visible
`;


const highlightName = (text, prenom, nom) => {
  if (!text || !prenom || !nom) return text;

  // Crée un regex pour détecter le prénom et le nom (insensible à la casse)
  const regex = new RegExp(`\\b(${prenom}|${nom})\\b`, 'gi');

  // Remplace les occurrences trouvées par une version avec balise <span>
  return text.replace(regex, (match) => `<span style="font-weight: bold;">${match}</span>`);
};

const formatDate = (date) => {
    if (!date) return "N/A"; // Retourne "N/A" si aucune date n'est fournie
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };
const styles = {
  container: {
    textAlign: 'center',
    marginTop: '20px',
    position: 'relative',
  },
  profileContainer: {
    textAlign: 'center',
    marginTop: '20px',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '350px',
    objectFit: 'cover',
  },
  profileImageContainer: {
    position: 'absolute',
    top: '100px',
    left: '50%',
    transform: 'translateX(-50%)',
    borderRadius: '50%',
    border: '5px solid white',
    overflow: 'hidden',
    width: '400px',
    height: '400px',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  groupDescription: {
    marginTop: '200px',
    marginBottom: '50px',
    fontSize: '18px',
    color: '#000000',
    padding: '0 20px',
    marginLeft: '200px', // Ajout pour centrer le texte horizontalement
    marginRight: '200px', // Ajout pour centrer le texte horizontalement

  },
  socialLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '20px',
  },
  socialIcon: {
    width: '30px',
    height: '30px',
    cursor: 'pointer',
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    
  },
  tabButton: {
    padding: '10px 20px',
    fontSize: '20px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    border: 'none',
    margin: '0 10px',
    outline: 'none',
    position: 'relative',
    transition: 'color 0.3s ease',
    fontWeight: 'bold', // Rend le texte en gras
    color:'#9d9d9d',

    
  },
  activeTab: {
    color: '#111111',
    textDecoration: 'underline',
  },
};

const Groupe = () => {
 
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const [showButton] = useState(false);
  const { id } = useParams(); // Récupérer l'ID depuis l'URL
  const [group, setGroup] = useState(null); // État pour stocker l'groupe
  
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState(null); // État pour les erreurs
  const [activeSection, setActiveSection] = useState('main'); // État pour gérer la section active
  const [selectedAlbum, setSelectedAlbum] = useState(null); // Initial state
  const [selectedChanson, setSelectedChanson] = useState(null); // Stocker la chanson sélectionnée
    const [email, setEmail] = useState('');
    const formatText = (text) => {
        return text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
      };
    
     const [status1, setStatus1] = useState(''); // État pour afficher le statut (succès/échec)
    
      const handleSubmit1 = async (e) => {
        e.preventDefault();
    
        if (!email) {
          setStatus1('Please enter a valid email address.');
          return;
        }
    
        try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/newsletter`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });
    
          const data = await response.json();
    
          if (response.ok) {
            setStatus1('You have successfully subscribed to our newsletter!');
            setEmail('');
          } else {
            setStatus1(data.error || 'Something went wrong. Please try again.');
          }
        } catch (error) {
          console.error('Error subscribing to newsletter:', error);
          setStatus1('Failed to subscribe. Please try again later.');
        }
      };
  const settings2 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    focusOnSelect: true, // Pour que cliquer sur une carte la sélectionne
    beforeChange: (oldIndex, newIndex) => {
      // Synchroniser la chanson sélectionnée avec l'index actif
      setSelectedChanson(group.chansons[newIndex]);
    },
  // Pas de padding pour centrer les éléments
  
  prevArrow: <PrevArrow />,  // Flèche gauche personnalisée
  nextArrow: <NextArrow />,  // Flèche droite personnalisée
  };
  const handleAlbumClick = (album) => {
    setSelectedAlbum(album); // Définit l'album sélectionné
  };
  
  const handleCloseAlbumDetails = () => {
    setSelectedAlbum(null); // Réinitialise l'album sélectionné
  };
  
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/groupes/${id}`);
        setGroup(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors de la récupération des données de l\'groupe.');
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id]);
  useEffect(() => {
    const fetchGroupes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/groupes/${id}`);
        setGroup(response.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors de la récupération des données de l\'groupe.');
        setLoading(false);
      }
    };

    fetchGroupes();
  }, [id]);
  const handleGoBack = () => {
    window.history.back(); // Revenir à la page précédente
  };
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/home#contact-us");
    setTimeout(() => {
      const section = document.getElementById("contact-us");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 500); // Petit délai pour s'assurer que la navigation est terminée
  };

  if (loading) return <p>Chargement en cours...</p>;
  if (error) return <p>{error}</p>;
  if (!group) return <p>Aucun groupe trouvé.</p>;
  


  return (
    <div className="max-w-[1920px] mx-auto scroll-smooth bg-[#FFFFFF]">
      {/* Bouton Go Back */}
      
          <StyleSheetManager shouldForwardProp={(prop) => prop !== 'visible'}>
          <SocialIconsContainer>
          <SocialIcon  href={group.instag}  target="_blank"className="hover:bg-gradient-to-r hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] transition-all duration-300 ">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="17" cy="7" r="1.5" fill="#fff" fill-opacity="0"><animate fill="freeze" attributeName="fill-opacity" begin="1.3s" dur="0.15s" values="0;1"/></circle><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2"><path stroke-dasharray="72" stroke-dashoffset="72" d="M16 3c2.76 0 5 2.24 5 5v8c0 2.76 -2.24 5 -5 5h-8c-2.76 0 -5 -2.24 -5 -5v-8c0 -2.76 2.24 -5 5 -5h4Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="72;0"/></path><path stroke-dasharray="28" stroke-dashoffset="28" d="M12 8c2.21 0 4 1.79 4 4c0 2.21 -1.79 4 -4 4c-2.21 0 -4 -1.79 -4 -4c0 -2.21 1.79 -4 4 -4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.6s" values="28;0"/></path></g></svg>
        </SocialIcon>
        <SocialIcon href={group.Facebook} target="_blank"   className="hover:bg-[#3b5998] transition-colors duration-300">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
    <path
  strokeDasharray="24"
  strokeDashoffset="24"
  d="M17 4l-2 0c-2.5 0 -4 1.5 -4 4v12"
>
  <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0" />
</path>
<path
  strokeDasharray="8"
  strokeDashoffset="8"
  d="M8 12h7"
>
  <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="8;0" />
</path>

    </g>
  </svg>
</SocialIcon>
<SocialIcon href="https://www.facebook.com/profile.php?id=61563814656941" target="_blank"   className="hover:bg-[#3b5998] transition-colors duration-300">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
    <path
  strokeDasharray="24"
  strokeDashoffset="24"
  d="M17 4l-2 0c-2.5 0 -4 1.5 -4 4v12"
>
  <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="24;0" />
</path>
<path
  strokeDasharray="8"
  strokeDashoffset="8"
  d="M8 12h7"
>
  <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.5s" dur="0.2s" values="8;0" />
</path>

    </g>
  </svg>
</SocialIcon>
        <SocialIcon href="https://www.instagram.com/omhy__entertainment?igsh=Y3JzdDk1cmk3ejNl" target="_blank"className="hover:bg-gradient-to-r hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] transition-all duration-300 ">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="17" cy="7" r="1.5" fill="#fff" fill-opacity="0"><animate fill="freeze" attributeName="fill-opacity" begin="1.3s" dur="0.15s" values="0;1"/></circle><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2"><path stroke-dasharray="72" stroke-dashoffset="72" d="M16 3c2.76 0 5 2.24 5 5v8c0 2.76 -2.24 5 -5 5h-8c-2.76 0 -5 -2.24 -5 -5v-8c0 -2.76 2.24 -5 5 -5h4Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="72;0"/></path><path stroke-dasharray="28" stroke-dashoffset="28" d="M12 8c2.21 0 4 1.79 4 4c0 2.21 -1.79 4 -4 4c-2.21 0 -4 -1.79 -4 -4c0 -2.21 1.79 -4 4 -4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.6s" values="28;0"/></path></g></svg>
        </SocialIcon>
        <SocialIcon
  href="https://www.tiktok.com/@omhy.entertainment"
  target="_blank"
  className="hover:bg-gradient-to-r hover:from-[#69C9D0] hover:via-[#EE1D52] hover:to-[#000000] transition-all duration-300"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="#fff"
  >
    <path d="M12 2a1 1 0 0 0-1 1v14.003a2.5 2.5 0 1 1-3-2.45V10a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v3c0 4.5 5 5 5 5a5.5 5.5 0 0 0 5.5-5.5V5a1 1 0 0 1 1-1h3.042a6.002 6.002 0 0 1-2.019-2H12z"></path>
  </svg>
</SocialIcon>

        <SocialIcon href="https://www.youtube.com/@OMHYEntertainmentOfficial" target="_blank"className="hover:bg-[#FF0000] transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" fill-opacity="0" d="M12 11L12 12L12 13z" ><animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" values="M12 11L12 12L12 13z;M10 8.5L16 12L10 15.5z"/><set fill="freeze" attributeName="fill-opacity" begin="0.6s" to="1"/></path><path fill="none" stroke="#fff" stroke-dasharray="64" stroke-dashoffset="64" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M12 5c9 0 9 0 9 7c0 7 0 7 -9 7c-9 0 -9 0 -9 -7c0 -7 0 -7 9 -7Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"/></path></svg>
        </SocialIcon>
        <SocialIcon href="https://spotify.com" target="_blank"className="hover:bg-[#1ED760] transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" strokeWidth="1.5"><path stroke-dasharray="64" stroke-dashoffset="64" d="M2 12c0 -5.52 4.48 -10 10 -10c5.52 0 10 4.48 10 10c0 5.52 -4.48 10 -10 10c-5.52 0 -10 -4.48 -10 -10Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M8.63 15.31c2.18 -0.58 4.49 -0.34 6.5 0.69"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0"/></path><path stroke-dasharray="12" stroke-dashoffset="12" d="M7.5 12.07c1.1 -0.37 2.28 -0.57 3.5 -0.57c2.02 0 3.92 0.55 5.55 1.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="12;0"/></path><path stroke-dasharray="14" stroke-dashoffset="14" d="M7 8.91c1.38 -0.59 2.9 -0.91 4.5 -0.91c2.41 0 4.65 0.74 6.5 2"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.2s" values="14;0"/></path></g></svg>
        </SocialIcon>
      </SocialIconsContainer>
      <ScrollToTopButton onClick={scrollToTop} {...(showButton ? { visible: "true" } : {})}>
        ↑ UP
      </ScrollToTopButton>
          <GoBackButton onClick={handleGoBack} visible={showButton} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ display: 'block' }}>
          <path fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 18h3.75a5.25 5.25 0 1 0 0-10.5H5M7.5 4L4 7.5L7.5 11"/>
        </svg>
      </GoBackButton>
      </StyleSheetManager>

      {/* Header */}
      <header className="py-4 px-4 sm:px-10 z-50 min-h-[70px] relative">
      <div className="lg:flex items-center justify-between w-full gap-6 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
  {/* Logo Section */}
  <div className="flex items-center shrink-0 mb-4 lg:mb-0">
    <a href="/home">
      <img src={customLogodark} alt="logo" className="w-40" />
    </a>
  </div>

  {/* Navigation Menu */}
  <ul className="lg:flex items-center justify-center gap-x-6 max-lg:space-y-3 bg-white text-black">
    <li className="max-lg:border-b max-lg:py-3 px-3">
      <a
        href="/Aboutomhy"
        className="ml-4 hover:underline block transition-all"
      >
        About Us
      </a>
    </li>
    <li className="max-lg:border-b max-lg:py-3 px-3">
      <a
        href="/artistdetails"
        className="ml-4 hover:underline block transition-all"
      >
        Artists
      </a>
    </li>
    <li className="max-lg:border-b max-lg:py-3 px-3">
      <a
        href="/albums"
        className="ml-4 hover:underline block transition-all"
      >
        Album
      </a>
    </li>
    <li className="max-lg:border-b max-lg:py-3 px-3">
      <a
        href="/news"
        className="ml-4 hover:underline block transition-all"
      >
        News
      </a>
    </li>
    <li onClick={handleRedirect} className="max-lg:border-b max-lg:py-3 px-3">
      <span className="ml-4 hover:underline block transition-all">
        Contact Us
      </span>
    </li>
  </ul>

  {/* Call-to-Action Button */}
  <div className="flex items-center justify-center bg-transparent px-6 py-2.5 rounded-full border border-black shadow-xl lg:ml-auto max-lg:mt-10">
    <a href="/casting" className="text-black hover:underline">
      Casting
    </a>
  </div>
</div>

      </header>
      <p style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
  <span 
    style={{ 
      fontWeight: 'bold', 
      fontSize: '5rem', // Taille de la police (très grande)
      textAlign: 'center', 
      color: '#000' // Couleur du texte
    }}
  >
    {`${group.name} `.toUpperCase()}
  </span>
</p>      {/* Navigation Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveSection('main')}
          style={{
            ...styles.tabButton,
            ...(activeSection === 'main'? { color: 'red',   textDecoration: 'underline' }  : {}),
          }}
        >
          Main
        </button>
        <button
          onClick={() => setActiveSection('profile')}
          style={{
            ...styles.tabButton,
            ...(activeSection === 'profile' ? { color: 'red',   textDecoration: 'underline' }  : {}),
          }}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveSection('discography')}
          style={{
            ...styles.tabButton,
            ...(activeSection === 'discography' ?  { color: 'red',   textDecoration: 'underline' }  : {}),
          }}
        >
          Discography
        </button>
      </div>

      {/* Section Main */}
      {activeSection === 'main' && (
        <div style={styles.profileContainer}>
          <img
            src={
              group.photoCouverture && group.photoCouverture.length > 0
                ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}${group.photoCouverture[0]}`
                : '/default-avatar.png'
            }
            alt="Cover"
            style={styles.coverImage}
          />
         <p style={styles.groupDescription}>
          <div style={styles.profileImageContainer}>
        <img
          src={
            group.photo && group.photo.length > 0
              ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}${group.photo[0]}`
              : '/default-avatar.png'
          }
          alt="Profile"
          style={styles.profileImage}
        />
      </div>
      
  



           
          </p>
          <span style={{ color: '#afacac' }}>{`${group.decriptionsousimage} `}</span>

          
          <div 
  style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: '20px',
    margin: '20px 0',
  }}
>
  <ReactPlayer 
    url={`${group.lienvideo} `}
    controls 
    width="90%" // Réduction de la largeur
    height="500px" // Réduction de la hauteur
  />
  
</div>

        </div>
        
      )}


{activeSection === 'profile' && (
  <div style={styles.profileContainer}>
    {/* Affichage de la couverture principale du groupe */}
    <img
      src={
        group.photoCouverture && group.photoCouverture.length > 0
          ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}${group.photoCouverture[0]}`
          : '/default-avatar.png'
      }
      alt="Profile"
      style={styles.coverImage}
    />
    <p style={styles.groupDescription}>
      <div style={styles.profileImageContainer}>
        <img
          src={
            group.photo && group.photo.length > 0
              ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}${group.photo[0]}`
              : '/default-avatar.png'
          }
          alt="Profile"
          style={styles.profileImage}
        />
      </div>
      <span style={{ color: '#afacac' }}>{`${formatDate(group.dateDeJoindre)} `}</span>

      <div style={{ whiteSpace: "pre-line" }} dangerouslySetInnerHTML={{ 
    __html: highlightName(
      `${group.profile}`,
      group.name,
      
    ) , __html: formatText(`${group.profile}`) 
  }} />

    </p>

    {/* Section des membres */}
    <div style={{ marginTop: '30px' }}>
      <h3 style={{ textAlign: 'center', color: '#333', fontWeight: 'bold' }}>Members</h3>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px', // Espace entre les membres
          marginTop: '20px',
          marginbottom: "30px",
        }}
      >
        {group.artistes && group.artistes.length > 0 ? (
          group.artistes.map((artistes) => (
            <div
              key={artistes._id}
              style={{
                textAlign: 'center',
                maxWidth: '120px',
              }}
            >
              {/* Photo de l'artiste */}
              <img
                src={
                    artistes.photoCouverture && artistes.photoCouverture.length > 0
                    ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}/${artistes.photo}`
                    : '/default-avatar.png'
                }
                alt={artistes.name}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                }}
              />
          {/* Nom et prénom de l'artiste */}
          <p
            style={{
              margin: '5px 0',
              fontSize: '14px',
              color: '#333',
              fontWeight: 'bold',
            }}
          >
            {artistes.prenom} {artistes.nom}
          </p>

          {/* Date de naissance */}
          <p
            style={{
              fontSize: '12px',
              color: '#666',
            }}
          >
            {formatDate(artistes.dateAnniversaire)}
          </p>
            </div>
          ))
        ) : (
          <p style={{ color: '#888', fontStyle: 'italic' }}>
            No members found in this group.
          </p>
        )}
      </div>
    </div>
  </div>
)}

{activeSection === 'discography' && (
  <div style={styles.discographySection}>
    <div className="px-4 sm:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 max-w-2xl text-center mx-auto">
          <h2 className="md:text-4xl text-3xl font-semibold md:!leading-[50px] mb-6">
            Our Discography
          </h2>
          <p className="text-[#111]">
            Discover our latest album releases and enjoy a variety of music styles curated just for you.
          </p>
        </div>
      </div>

      {/* Section Galerie */}
      <div className="carousel-container">
      <h2><strong>Gallery</strong></h2>

        {group.chansons.length + group.albums.length === 0 ? (
          <p>Aucun contenu disponible.</p>
        ) : group.chansons.length + group.albums.length > 1 ? (
          // Affichage avec Slider si plusieurs éléments
          <Slider {...settings2}>
            {/* Chansons */}
            {group.chansons.map((chanson) => (
              <div
                key={chanson._id}
                className={`item-card ${selectedChanson === chanson ? "active" : ""}`}
                onClick={() => {
                  setSelectedChanson(chanson);
                  setSelectedAlbum(null);
                }}
              >
                <img
                  src={chanson.photo ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}${chanson.photo}` : "/placeholder.jpg"}
                  alt={chanson.nom}
                  className="item-image"
                  style={{
                    width: "300px", // Taille carrée (ajuste selon tes besoins)
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    display: "block", // Permet de centrer avec margin auto
                    margin: "auto",
                    border: selectedChanson === chanson ? "2px solidrgb(36, 34, 37)" : "none",
                  }}
                />
                <h3 style={{ textAlign: "center", marginTop: "10px" }}>{chanson.nom}</h3>
              </div>
            ))}

            {/* Albums */}
            {group.albums.map((album) => (
              <div
                key={album._id}
                className={`item-card ${selectedAlbum === album ? "active" : ""}`}
                onClick={() => {
                  setSelectedAlbum(album);
                  setSelectedChanson(null);
                }}
              >
                <img
                  src={album.photo ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}${album.photo}` : "/placeholder.jpg"}
                  alt={album.titre}
                  className="item-image"
                  style={{
                    width: "300px", // Taille carrée (ajuste selon tes besoins)
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    display: "block", // Permet de centrer avec margin auto
                    margin: "auto",
                    border: selectedAlbum === album ? "2px solidrgb(82, 82, 82)" : "none",
                  }}
                />
                <h3 style={{ textAlign: "center", marginTop: "10px" }}>{album.titre}</h3>
              </div>
            ))}
          </Slider>
        ) : (
          // Si une seule chanson ou un seul album, affichage direct sans Slider
          <>
            {group.chansons.map((chanson) => (
              <div
                key={chanson._id}
                className="item-card"
                onClick={() => {
                  setSelectedChanson(chanson);
                  setSelectedAlbum(null);
                }}
              >
                <img
                  src={chanson.photo ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}${chanson.photo}` : "/placeholder.jpg"}
                  alt={chanson.nom}
                  className="item-image"
                  style={{
                    width: "300px", // Taille carrée (ajuste selon tes besoins)
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    display: "block", // Permet de centrer avec margin auto
                    margin: "auto",
                  }}
                />
                <h3 style={{ textAlign: "center", marginTop: "10px" }}>{chanson.nom}</h3>
              </div>
            ))}

            {group.albums.map((album) => (
              <div
                key={album._id}
                className="item-card"
                onClick={() => {
                  setSelectedAlbum(album);
                  setSelectedChanson(null);
                }}
              >
                <img
                  src={album.photo ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}${album.photo}` : "/placeholder.jpg"}
                  alt={album.titre}
                  className="item-image"
                  style={{
                    width: "300px", // Taille carrée (ajuste selon tes besoins)
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    display: "block", // Permet de centrer avec margin auto
                    margin: "auto",
                  }}
                />
                <h3 style={{ textAlign: "center", marginTop: "10px" }}>{album.titre}</h3>
              </div>
            ))}
          </>
        )}
 {/* Détails d'une chanson */}
 {selectedChanson && (
        <div className="details">
          <div className="details-content">
            <img
              src={selectedChanson.photo ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}${selectedChanson.photo}` : "/placeholder.jpg"}
              alt={selectedChanson.nom}
              className="details-image"
            />
            <div className="details-info">
            <p style={{ color: 'gray' }}>
  <strong></strong> {formatDate(selectedChanson.anneeDeCreation)}
</p>
              <p><strong>{selectedChanson.nom} </strong> </p>
              <p style={{ whiteSpace: "pre-line" }} dangerouslySetInnerHTML={{ __html: formatText(selectedChanson.type) }}/>
               
                     
              </div>
              <SocialIcon href={selectedChanson.linkyoutube} target="_blank"className="hover:bg-[#FF0000] transition-colors duration-300 mr-3">
        <svg xmlns="http://www.w3.org/2000/svg"  width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" fill-opacity="0" d="M12 11L12 12L12 13z" ><animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" values="M12 11L12 12L12 13z;M10 8.5L16 12L10 15.5z"/><set fill="freeze" attributeName="fill-opacity" begin="0.6s" to="1"/></path><path fill="none" stroke="#fff" stroke-dasharray="64" stroke-dashoffset="64" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M12 5c9 0 9 0 9 7c0 7 0 7 -9 7c-9 0 -9 0 -9 -7c0 -7 0 -7 9 -7Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"/></path></svg>
        </SocialIcon>
        <SocialIcon  href={selectedChanson.spotify} target="_blank"className=" hover:bg-[#1ED760] transition-colors duration-300 ">
        <svg xmlns="http://www.w3.org/2000/svg" margin-Right="20" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" strokeWidth="1.5"><path stroke-dasharray="64" stroke-dashoffset="64" d="M2 12c0 -5.52 4.48 -10 10 -10c5.52 0 10 4.48 10 10c0 5.52 -4.48 10 -10 10c-5.52 0 -10 -4.48 -10 -10Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M8.63 15.31c2.18 -0.58 4.49 -0.34 6.5 0.69"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0"/></path><path stroke-dasharray="12" stroke-dashoffset="12" d="M7.5 12.07c1.1 -0.37 2.28 -0.57 3.5 -0.57c2.02 0 3.92 0.55 5.55 1.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="12;0"/></path><path stroke-dasharray="14" stroke-dashoffset="14" d="M7 8.91c1.38 -0.59 2.9 -0.91 4.5 -0.91c2.41 0 4.65 0.74 6.5 2"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.2s" values="14;0"/></path></g></svg>
        </SocialIcon>
          </div>
          
        </div>
        
        
      )}
      
        {/* Détails de l'Album Sélectionné avec Chansons */}
        {selectedAlbum && (
          <div className="album-details-container">
            <div className="album-details-content">
              <div className="album-image-container">
                <img
                  src={selectedAlbum.photo ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}${selectedAlbum.photo}` : "/placeholder.jpg"}
                  alt={selectedAlbum.titre}
                  className="album-image"
                />

              </div>

              <div className="album-info-container">
              <p style={{ color: 'gray' }}>
  <strong></strong> {selectedAlbum.anneeDeSortie}
</p>
                <p><strong> {selectedAlbum.titre}</strong></p>

                <p style={{ whiteSpace: "pre-line" }} dangerouslySetInnerHTML={{ __html: formatText(selectedAlbum.text) }}/>

              </div>
              
            </div>


            {/* Chansons de l'Album */}
            <div className="chanson-list-container">
  <h3><strong>Track List</strong></h3>
  {selectedAlbum.chansons.length > 0 ? (
    <ul className="chanson-list">
      {selectedAlbum.chansons.map((chanson, index) => (
        <li key={chanson._id} className="chanson-item">
          <div className="chanson-index">{index + 1}.</div>
          <div className="chanson-details">
          <h3 className="chanson-title">{chanson.nom}</h3>
           
           
          </div>
          <SocialIcon                 href={chanson.linkyoutube} target="_blank"className="hover:bg-[#FF0000] transition-colors duration-300 mr-3">
        <svg xmlns="http://www.w3.org/2000/svg"  width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" fill-opacity="0" d="M12 11L12 12L12 13z" ><animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" values="M12 11L12 12L12 13z;M10 8.5L16 12L10 15.5z"/><set fill="freeze" attributeName="fill-opacity" begin="0.6s" to="1"/></path><path fill="none" stroke="#fff" stroke-dasharray="64" stroke-dashoffset="64" stroke-linecap="round" stroke-linejoin="round" strokeWidth="2" d="M12 5c9 0 9 0 9 7c0 7 0 7 -9 7c-9 0 -9 0 -9 -7c0 -7 0 -7 9 -7Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"/></path></svg>
        </SocialIcon>
        <SocialIcon  href={chanson.spotify} target="_blank"className=" hover:bg-[#1ED760] transition-colors duration-300 ">
        <svg xmlns="http://www.w3.org/2000/svg" margin-Right="20" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" strokeWidth="1.5"><path stroke-dasharray="64" stroke-dashoffset="64" d="M2 12c0 -5.52 4.48 -10 10 -10c5.52 0 10 4.48 10 10c0 5.52 -4.48 10 -10 10c-5.52 0 -10 -4.48 -10 -10Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M8.63 15.31c2.18 -0.58 4.49 -0.34 6.5 0.69"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0"/></path><path stroke-dasharray="12" stroke-dashoffset="12" d="M7.5 12.07c1.1 -0.37 2.28 -0.57 3.5 -0.57c2.02 0 3.92 0.55 5.55 1.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="12;0"/></path><path stroke-dasharray="14" stroke-dashoffset="14" d="M7 8.91c1.38 -0.59 2.9 -0.91 4.5 -0.91c2.41 0 4.65 0.74 6.5 2"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.2s" values="14;0"/></path></g></svg>
        </SocialIcon> 
        </li>
      ))}
    </ul>
  ) : (
    <p>Aucune chanson disponible pour cet album.</p>
    
  )}
</div>

    {/* Style CSS */}
    <style jsx>{`
      .album-details-container {
        margin-top: 20px;
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
      }

      .album-details-content {
        display: flex;
        align-items: flex-start;
        gap: 20px;
      }

      .album-image-container {
        flex: 0 0 200px;
      }

      .album-image {
        width: 100%;
        height: auto;
        border-radius: 8px;
        object-fit: cover;
      }

      .album-info-container {
        flex: 1;
      }

     

      .action-button {
        padding: 8px 12px;
        border: none;
        border-radius: 4px;
        margin-right: 10px;
        color: white;
        cursor: pointer;
      }

      .action-button.youtube {
        background: #fd0000;
      }

      .action-button.spotify {
        background: #1ed760;
      }

      .chanson-list-container {
        margin-top: 20px;
      }

      .chanson-list {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .chanson-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 15px;
        border-bottom: 1px solid #ddd;
        transition: background 0.2s;
      }

      .chanson-item:hover {
        background: #f9f9f9;
      }

      .chanson-index {
        font-size: 1.2rem;
        font-weight: bold;
        color: #555;
      }

      .chanson-details {
        flex: 1;
        margin-left: 15px;
      }

      .chanson-title {
        font-size: 1.2rem;
        margin: 0;
        color: #333;
      }

      .chanson-type {
        margin: 5px 0 0;
        font-size: 0.9rem;
        color: #666;
      }

      .chanson-actions {
        display: flex;
        align-items: center;
        gap: 10px;
      }




    `}</style>
  </div>
)}



      {/* Styles */}
      <style jsx>{`
        .carousel-container {
          width: 80%;
          margin: 0 auto;
          padding-top: 20px;
          margin-bottom: 60px;
        }

        .item-card {
          text-align: center;
          padding: 10px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .item-card:hover {
          transform: scale(1.05);
        }

        .item-card.active {
          border: 2px solidrgb(100, 97, 101);
          border-radius: 8px;
        }

        .details {
          width: 80%;
          margin: 20px auto;
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }

        .details-content {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .details-image {
          width: 200px;
          height: auto;
          border-radius: 8px;
          margin-right: 20px;
        }

        .details-info {
          flex: 1;
        }

       
      `}</style>
      </div>



</div>
  </div>
)}
<footer className="bg-[#111] py-12 px-10 font-sans tracking-wide">
  <div className="max-w-screen-xl mx-auto text-center">
    {/* Newsletter section */}
    <div className="lg:max-w-[50%] mx-auto text-center">
      <h3 className="text-3xl font-bold text-[#FFFFFF]">Newsletter</h3>
      <p className="text-sm mt-6 text-gray-500">Subscribe to our newsletter and stay up to date with the latest news,
        updates, and exclusive offers. Get valuable insights. Join our community today!</p>

        <form
          onSubmit={handleSubmit1}
          className="bg-[#FFFFFF] flex px-2 py-1.5 rounded-full text-left mt-10 mx-auto"        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full outline-none bg-transparent text-sm pl-4"
                        required
          />
          <button
            type="submit"
            className="border border-black outline-none bg-transparent hover:bg-black text-black hover:text-[#dddddd] transition-all duration-300 text-sm rounded-full px-5 py-2.5 ml-4 transition-all">Submit</button>
        
           
        </form>

        {status1 && (
          <p
            className={`mt-4 font-bold ${
              status1.includes('successfully') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {status1}
          </p>
        )}
      
    </div>

    <hr className="border-gray-300 my-12" />

    {/* Footer menu, logo, and copyright */}
    <div className="flex flex-col items-center">
     
      {/* Logo */}
      <div className="mb-6">
        <a href="/home">
          <img src={customLogo} alt="logo" className="w-40" />
        </a>
      </div>

      {/* Copyright */}
      <p className="text-[#ddd] text-base mt-5">©OmhyEnertainment. All rights reserved.</p>
      <p className="text-[#000000] text-base mt-5">Made with ♥ </p>

    </div>
  </div>
</footer>
    </div>
    
  );
};




export default Groupe;
