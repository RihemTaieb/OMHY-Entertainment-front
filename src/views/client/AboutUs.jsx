import React, { useEffect,useState } from 'react';
import customLogo from '../../assets/img/custom-logo.png';

import customLogodark from '../../assets/img/custom-logo-dark.png'
import imglogotrans from '../../assets/img/OMHY_3[1].png'
import arriere from '../../assets/img/Capture d’écran 2025-02-19 134229.jpg'
import olfa from '../../assets/img/olfa.jpeg'

import styled from "styled-components";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import { motion } from "framer-motion"; // Import des animations

import { useRef } from "react";
import gsap from "gsap";
// Animation des cartes au scroll
const slideIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};
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
// Social container for the floating icons
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



  const styles = {
    
    omhyText: {
      textAlign: 'center',
      fontSize: '3rem',
      fontWeight: 'bold',
      margin: '3px 0',
      color: '#000',
    },
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
    artistDescription: {
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
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
      marginBottom: "20px",
    },
    tabButton: {
      padding: "10px 20px",
      fontSize: "20px",
      cursor: "pointer",
      backgroundColor: "transparent",
      border: "none",
      outline: "none",
      transition: "color 0.3s ease",
      color: "#7c7b7b",
    },
    activeTab: {
      color: "red", // Bouton rouge quand il est actif
      textDecoration: "underline",
    },
  
  };
  
  

const About = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('about'); // Initialisation avec 'about'
  const bgRef = useRef(null);
  const cardVariants = {
    hidden: { opacity: 0, y: 50 }, // État initial (invisible et décalé vers le bas)
    visible: { opacity: 1, y: 0 }, // État final (visible et position normale)
  };
  useEffect(() => {
    gsap.to(bgRef.current, {
      y: -5,          // Réduction de la montée (limité à -5px au lieu de -15px)
      scale: 1.1,     // Zoom avant
      repeat: -1,     // Répétition infinie
      yoyo: true,     // Effet de va-et-vient
      duration: 2.5,  // Durée d'un cycle
      ease: "power1.inOut",
    });
  }, []);
  
const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    interest: '', // Pour stocker l'intérêt sélectionné
  });
  const [email, setEmail] = useState('');

  const [status, setStatus] = useState(''); // État pour afficher le statut (succès/échec)
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
  // Gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gérer la sélection d'intérêt
  const handleInterestSelect = (interest) => {
    setFormData({ ...formData, interest });
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus(''); // Réinitialise le message avant d'envoyer

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('Message sent successfully!');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          interest: '',
        });
      } else {
        setStatus(data.error || 'Something went wrong, please try again.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message :', error);
      setStatus('Failed to send the message. Please try again later.');
    }
  };
   

  useEffect(() => {
    // Add Google Fonts dynamically
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
 
    // Load TailwindCSS if not already loaded
    const script = document.createElement('script');
    script.src = "https://cdn.tailwindcss.com";
    document.head.appendChild(script);

    return () => {
      // Clean up resources when the component unmounts
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleGoBack = () => {
    window.history.back(); // Navigates to the previous page
  };

  return (
    <div className="max-w-[1920px] mx-auto scroll-smooth bg-[#FFFFFF]">
    <div className="text-[#111] text-[15px] bg[#ffffff]" >
    <div
    >
        <div>
      {/* Header */}
      <header className="py-4 px-4 sm:px-10 z-50 min-h-[70px] relative">
        <div className="lg:flex lg:items-center gap-x-2 relative">
          <div className="flex items-center shrink-0">
            <a href="/home">
              <img src={customLogodark} alt="logo" className="w-40" />
            </a>
          </div>
        </div>
      </header>

      {/* Nom de l'artiste */}
      <div>
      {/* Titre */}
      <p 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          margin: '20px 0' 
        }}
      >
        
      </p>  

      {/* Onglets de navigation */}
      <div 
        style={{
          ...styles.tabs,
          flexDirection: window.innerWidth > 768 ? "row" : "column", // PC: horizontal, Mobile: vertical
        }}
      >
        {["about", "history", "notice", "contact"].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            style={{
              ...styles.tabButton,
              ...(activeSection === section ? styles.activeTab : {}), // Change en rouge si actif
              width: window.innerWidth > 768 ? "auto" : "100%", // PC = auto, Mobile = pleine largeur
              maxWidth: "250px",
              textAlign: "center",
            }}
          >
            {section === "about"
              ? "About OMHY"
              : section === "history"
              ? "Meet the Founder"
              : section === "notice"
              ? "Our Services"
              : "Contact"}
          </button>
        ))}
      </div>
    </div>
      <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '1.2rem' }}>
      {activeSection === 'about' && (
  <motion.section
    className="relative bg-[#FFFFFF] py-16 px-6 sm:px-12 lg:px-24 flex justify-center items-center"
    initial={{ opacity: 0, y: 50 }} 
    animate={{ opacity: 1, y: 0 }} 
    exit={{ opacity: 0, y: 50 }} 
    transition={{ duration: 1, ease: "easeOut" }}
  >
    {/* Cadre principal */}
    <motion.div
      className="max-w-6xl w-full bg-white border border-gray-300 shadow-lg rounded-xl p-8 flex flex-col md:flex-row items-center gap-8"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Image à gauche (centrée sur mobile) */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="relative flex justify-center items-center overflow-hidden w-full">
          {/* Image animée en arrière-plan */}
          <img 
    ref={bgRef}
    src={arriere} 
    alt="Moving Background"
    className="absolute top-0 left-0 w-full h-full object-cover"
  />

  {/* Logo principal (même taille que l’image de fond) */}
  <img 
    src={imglogotrans} 
    alt="About Us"
    className="relative shadow-lg w-full h-full object-cover"
  />
        </div>
      </div>

      {/* Texte à droite */}
      <motion.div
        className="w-full md:w-1/2 text-center md:text-left px-4"
        initial={{ opacity: 0, x: -50 }} 
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <p className="text-lg md:text-xl font-bold text-black leading-relaxed">
          OMHY Entertainment
        </p>
        <p className="text-sm md:text-base">
          OMHY Entertainment is an innovative music label dedicated to discovering and
          promoting exceptional musical talents. Our mission is to support
          artists in the development of their careers and help them reach a
          global audience.
        </p>
        <p className="text-sm md:text-base">
          We work with a diversity of passionate and creative artists,
          covering a wide range of musical genres, from pop and rock to
          electro and hip-hop. Each artist signed to OMHY Entertainment
          benefits from personalized support and an environment conducive
          to musical creation.
        </p>
        <p className="text-md md:text-lg font-bold text-black leading-relaxed mb-4 mt-3">
          Our Vision
        </p>
        <p className="text-sm md:text-base">
          At OMHY Entertainment, we believe that music has the power to
          connect people and transcend boundaries. We are committed to
          providing our artists with the means to realize their artistic
          vision while reaching new heights in the music industry.
        </p>
      </motion.div>
    </motion.div>
  </motion.section>
)}

  {activeSection === "history" && (
 <motion.section
 className="relative bg-[#FFFFFF] py-16 px-6 sm:px-12 lg:px-24 flex justify-center items-center"
 initial={{ opacity: 0, y: 50 }} 
 animate={{ opacity: 1, y: 0 }} 
 exit={{ opacity: 0, y: 50 }} 
 transition={{ duration: 1, ease: "easeOut" }}
>
 {/* Cadre avec ombre et bordure */}
 <motion.div
   className="max-w-4xl w-full bg-white border border-gray-300 shadow-lg rounded-xl p-8 flex flex-col md:flex-row items-center gap-8"
   initial={{ scale: 0.95 }}
   animate={{ scale: 1 }}
   transition={{ duration: 0.8, ease: "easeOut" }}
 >
   {/* Photo de la fondatrice */}
   <motion.div
     className="w-full md:w-1/3 flex justify-center"
     initial={{ scale: 0 }} 
     animate={{ scale: 1 }}
     transition={{ duration: 1, delay: 0.2 }}
   >
     <img
       src={olfa} 
       alt="Founder"
       className="rounded-full shadow-lg object-cover w-80 h-80 border-4 border-gray-200"
     />
   </motion.div>

   {/* Description */}
   <motion.div
     className="w-full md:w-2/3"
     initial={{ opacity: 0, x: -50 }} 
     animate={{ opacity: 1, x: 0 }}
     transition={{ duration: 1, delay: 0.4 }}
   >
     <p className="text-black leading-relaxed">
       <strong>OMHY Entertainment </strong> was founded by{" "}
       <strong>Olfa Jalel Revel</strong>, a visionary leader passionate about music and creativity.
       With years of experience in the industry, she has built OMHY as a platform to discover and nurture exceptional talents.
     </p>
     <p className="text-black leading-relaxed mt-4">
       Her mission is to connect artists with global audiences, creating a community that thrives on innovation and collaboration.
     </p>
   </motion.div>
 </motion.div>
</motion.section>
)

}
  {activeSection === "notice" && (
      <motion.section
        className="relative bg-[#ffffff] py-16 px-6 sm:px-12 lg:px-24"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }, // Décalage de 0.2s entre chaque enfant
          },
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-black leading-relaxed mb-6">
            <strong>OMHY Entertainment</strong> is committed to providing a wide range of professional services to empower our artists and ensure their success. Here’s what we offer:
          </p>

          {/* Grille de cartes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Carte 1 */}
            <motion.div
              className="bg-white shadow-md rounded-lg p-6"
              variants={cardVariants}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h3 className="text-lg font-bold text-red-500 mb-2">Music Production</h3>
              <p className="text-gray-600 text-sm">
                High-quality recording, mixing, and mastering in our studios as well as at renowned partners.
              </p>
            </motion.div>

            {/* Carte 2 */}
            <motion.div
              className="bg-white shadow-md rounded-lg p-6"
              variants={cardVariants}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h3 className="text-lg font-bold text-red-500 mb-2">Promotion & Marketing</h3>
              <p className="text-gray-600 text-sm">
                Tailor-made promotion strategies, digital marketing campaigns, and social media management.
              </p>
            </motion.div>

            {/* Carte 3 */}
            <motion.div
              className="bg-white shadow-md rounded-lg p-6"
              variants={cardVariants}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h3 className="text-lg font-bold text-red-500 mb-2">Distribution</h3>
              <p className="text-gray-600 text-sm">
                Distribution of music on all major streaming and download platforms.
              </p>
            </motion.div>

            {/* Carte 4 */}
            <motion.div
              className="bg-white shadow-md rounded-lg p-6"
              variants={cardVariants}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h3 className="text-lg font-bold text-red-500 mb-2">Publishing</h3>
              <p className="text-gray-600 text-sm">
                Legal protection and copyright for our artists' work.
              </p>
            </motion.div>

            {/* Carte 5 */}
            <motion.div
              className="bg-white shadow-md rounded-lg p-6"
              variants={cardVariants}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h3 className="text-lg font-bold text-red-500 mb-2">Events</h3>
              <p className="text-gray-600 text-sm">
                Organizing concerts, showcases, and tours for our artists, as well as meeting with fans.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    )
  
}
  {activeSection === 'contact' && 
  
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-12 px-6 s font-[sans-serif]">
  {/* Colonne Informations */}
  <div className="space-y-6 ">
  <strong>
    <p className="text-black mt-10">
      We'd love to hear from you! Whether you have a question about our services or you'd like to collaborate, feel free to reach out to us.
    </p> </strong>

    <div className="flex items-center justify-center">
  <ul className="space-y-4">
    {/* Email */}
    <li className="flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="#000"
        viewBox="0 0 479.058 479.058">
        <path
          d="M434.146 59.882H44.912C20.146 59.882 0 80.028 0 104.794v269.47c0 24.766 20.146 44.912 44.912 44.912h389.234c24.766 0 44.912-20.146 44.912-44.912v-269.47c0-24.766-20.146-44.912-44.912-44.912zm0 29.941c2.034 0 3.969.422 5.738 1.159L239.529 264.631 39.173 90.982a14.902 14.902 0 0 1 5.738-1.159zm0 299.411H44.912c-8.26 0-14.971-6.71-14.971-14.971V122.615l199.778 173.141c2.822 2.441 6.316 3.655 9.81 3.655s6.988-1.213 9.81-3.655l199.778-173.141v251.649c-.001 8.26-6.711 14.97-14.971 14.97z"
          data-original="#000000" />
      </svg>
    
      <span className="ml-4 text-black">contact@omhyentertainment.com</span>
    </li>
    {/* Phone */}
    {/*<li className="flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill='#000' viewBox="0 0 482.6 482.6">
                                <path d="M98.339 320.8c47.6 56.9 104.9 101.7 170.3 133.4 24.9 11.8 58.2 25.8 95.3 28.2 2.3.1 4.5.2 6.8.2 24.9 0 44.9-8.6 61.2-26.3.1-.1.3-.3.4-.5 5.8-7 12.4-13.3 19.3-20 4.7-4.5 9.5-9.2 14.1-14 21.3-22.2 21.3-50.4-.2-71.9l-60.1-60.1c-10.2-10.6-22.4-16.2-35.2-16.2-12.8 0-25.1 5.6-35.6 16.1l-35.8 35.8c-3.3-1.9-6.7-3.6-9.9-5.2-4-2-7.7-3.9-11-6-32.6-20.7-62.2-47.7-90.5-82.4-14.3-18.1-23.9-33.3-30.6-48.8 9.4-8.5 18.2-17.4 26.7-26.1 3-3.1 6.1-6.2 9.2-9.3 10.8-10.8 16.6-23.3 16.6-36s-5.7-25.2-16.6-36l-29.8-29.8c-3.5-3.5-6.8-6.9-10.2-10.4-6.6-6.8-13.5-13.8-20.3-20.1-10.3-10.1-22.4-15.4-35.2-15.4-12.7 0-24.9 5.3-35.6 15.5l-37.4 37.4c-13.6 13.6-21.3 30.1-22.9 49.2-1.9 23.9 2.5 49.3 13.9 80 17.5 47.5 43.9 91.6 83.1 138.7zm-72.6-216.6c1.2-13.3 6.3-24.4 15.9-34l37.2-37.2c5.8-5.6 12.2-8.5 18.4-8.5 6.1 0 12.3 2.9 18 8.7 6.7 6.2 13 12.7 19.8 19.6 3.4 3.5 6.9 7 10.4 10.6l29.8 29.8c6.2 6.2 9.4 12.5 9.4 18.7s-3.2 12.5-9.4 18.7c-3.1 3.1-6.2 6.3-9.3 9.4-9.3 9.4-18 18.3-27.6 26.8l-.5.5c-8.3 8.3-7 16.2-5 22.2.1.3.2.5.3.8 7.7 18.5 18.4 36.1 35.1 57.1 30 37 61.6 65.7 96.4 87.8 4.3 2.8 8.9 5 13.2 7.2 4 2 7.7 3.9 11 6 .4.2.7.4 1.1.6 3.3 1.7 6.5 2.5 9.7 2.5 8 0 13.2-5.1 14.9-6.8l37.4-37.4c5.8-5.8 12.1-8.9 18.3-8.9 7.6 0 13.8 4.7 17.7 8.9l60.3 60.2c12 12 11.9 25-.3 37.7-4.2 4.5-8.6 8.8-13.3 13.3-7 6.8-14.3 13.8-20.9 21.7-11.5 12.4-25.2 18.2-42.9 18.2-1.7 0-3.5-.1-5.2-.2-32.8-2.1-63.3-14.9-86.2-25.8-62.2-30.1-116.8-72.8-162.1-127-37.3-44.9-62.4-86.7-79-131.5-10.3-27.5-14.2-49.6-12.6-69.7z" data-original="#000000"></path>
                            </svg>
      <span className="ml-4 text-black"></span>
    </li>}
    {/* Address */}
    <li className="flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill='#000' viewBox="0 0 368.16 368.16">
                                <path d="M184.08 0c-74.992 0-136 61.008-136 136 0 24.688 11.072 51.24 11.536 52.36 3.576 8.488 10.632 21.672 15.72 29.4l93.248 141.288c3.816 5.792 9.464 9.112 15.496 9.112s11.68-3.32 15.496-9.104l93.256-141.296c5.096-7.728 12.144-20.912 15.72-29.4.464-1.112 11.528-27.664 11.528-52.36 0-74.992-61.008-136-136-136zM293.8 182.152c-3.192 7.608-9.76 19.872-14.328 26.8l-93.256 141.296c-1.84 2.792-2.424 2.792-4.264 0L88.696 208.952c-4.568-6.928-11.136-19.2-14.328-26.808-.136-.328-10.288-24.768-10.288-46.144 0-66.168 53.832-120 120-120s120 53.832 120 120c0 21.408-10.176 45.912-10.28 46.152z" data-original="#000000"></path>
                                <path d="M184.08 64.008c-39.704 0-72 32.304-72 72s32.296 72 72 72 72-32.304 72-72-32.296-72-72-72zm0 128c-30.872 0-56-25.12-56-56s25.128-56 56-56 56 25.12 56 56-25.128 56-56 56z" data-original="#000000"></path>
                            </svg>
      <span className="ml-4 text-black">Tunisia</span>
    </li>
  </ul>
</div>

  </div>
           
  <div className="bg-white p-8 rounded-lg shadow-lg">
    <h2 className="text-xl font-semibold text-black mb-4">Let us know what you're interested in...</h2>
    <div className="flex flex-wrap gap-4 mb-6">
      {['Business', 'Playing', 'Songwriting', 'Producing', 'DJing', 'Coaching'].map((interest) => (
        <button
          key={interest}
          type="button"
          onClick={() => handleInterestSelect(interest)}
          className={`px-4 py-2 rounded-full ${
            formData.interest === interest
              ? 'bg-black text-white border-black'
              : 'bg-gray-100 text-gray-700 border border-gray-300'
          } text-sm tracking-wide font-medium transition-all hover:bg-black hover:text-white`}
        >
          {interest}
        </button>
      ))}
    </div>

    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Your Name"
        required
        className="w-full p-3 border rounded-lg text-gray-800 focus:ring focus:ring-gray-300"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Your Email"
        required
        className="w-full p-3 border rounded-lg text-gray-800 focus:ring focus:ring-gray-300"
      />
      <input
        type="text"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        placeholder="Subject"
        className="w-full p-3 border rounded-lg text-gray-800 focus:ring focus:ring-gray-300"
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Your Message"
        rows="4"
        required
        className="w-full p-3 border rounded-lg text-gray-800 focus:ring focus:ring-gray-300"
      ></textarea>
      <button
        type="submit"
        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-all"
      >
        Send Message
      </button>
    </form>
    {status && (
      <p className={`mt-4 text-center font-bold ${status.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
        {status}
      </p>
    )}
  </div>
</div>
  }
</div>

</div>
   

      <SocialIconsContainer>
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
      <GoBackButton onClick={handleGoBack} {...(showButton ? { visible: "true" } : {})} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 18h3.75a5.25 5.25 0 1 0 0-10.5H5M7.5 4L4 7.5L7.5 11"/>
  </svg>
</GoBackButton>

      </div>

</div>
<footer className="bg-[#111] py-12 px-10 font-sans tracking-wide">
<div className="max-w-screen-xl mx-auto text-center">
    {/* Newsletter section */}
    <div className="lg:max-w-[50%] mx-auto text-center">
      <h3 className="text-3xl font-bold text-[#111]">Newsletter</h3>
      <p className="text-sm mt-6 text-gray-500">Subscribe to our newsletter and stay up to date with the latest news,
        updates, and exclusive offers. Get valuable insights. Join our community today!</p>

        <form
          onSubmit={handleSubmit1}
          className="bg-[#dddddd] flex px-2 py-1.5 rounded-full text-left mt-10 mx-auto"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full outline-none bg-transparent text-sm pl-4 text-[#000000]"
            required
          />
          <button
            type="submit"
            className="border border-black outline-none bg-transparent hover:bg-black text-black hover:text-[#dddddd] transition-all duration-300 text-sm rounded-full px-5 py-2.5 ml-4"
          >
            Submit
          </button>
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
      <p className="text-[#ddd] text-base mt-5">Made with ♥ </p>

    </div>
  </div>
</footer>

</div>

);
};

export default About;