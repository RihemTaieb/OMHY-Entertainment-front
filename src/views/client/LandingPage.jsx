import React, { useEffect,useState } from 'react';
import axios from 'axios';


import customLogo from '../../assets/img/custom-logo.png';
import customLogodark from '../../assets/img/custom-logo-dark.png'

import { TypeAnimation } from 'react-type-animation';
import styled from "styled-components";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import BackgroundImageService from "services/backgroundImageService";




  const ScrollToTopButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: #111 ;
  color: ${(props) => (props.isDark ? "#000" : "#fff")};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1000;
  display: ${(props) => (props.visible ? "block" : "none")};
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  transition: background 0.3s ease, transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
    background-color: #616161 ;

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
const artistSettings = {
  dots: true,            // Show dots navigation
  infinite: true,        // Infinite loop
  speed: 500,            // Transition speed
  slidesToShow: 2,       // Show 3 cards at once
  slidesToScroll: 1,     // Scroll one card at a time
  autoplay: true, // Enable auto-scrolling
  autoplaySpeed: 2100, // Delay between auto-scroll (in milliseconds)
  cssEase: "linear", // Smooth transition effect
  responsive: [
    {
      breakpoint: 768,   // For mobile screens
      settings: {
        slidesToShow: 1, // Show 1 card on smaller screens
      },
    },
  ],
};
const albumSettings = {
  dots: true,            // Show dots navigation
  infinite: true,        // Infinite loop
  speed: 500,            // Transition speed
  slidesToShow: 1,       // Show 3 cards at once
  slidesToScroll: 1,     // Scroll one card at a time
  autoplay: true, // Enable auto-scrolling
  autoplaySpeed: 3000, // Delay between auto-scroll (in milliseconds)
  cssEase: "linear", // Smooth transition effect
  responsive: [
    {
      breakpoint: 768,   // For mobile screens
      settings: {
        slidesToShow: 1, // Show 1 card on smaller screens
      },
    },
  ],
};

const LandingPage = () => {
  const [sliders, setSliders] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchSliders();
  }, []);

  useEffect(() => {
    if (sliders.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % sliders[0].images.length);
      }, 3000); // Change d'image toutes les 3 secondes

      return () => clearInterval(interval);
    }
  }, [sliders]);

  const fetchSliders = async () => {
    try {
      const data = await BackgroundImageService.getAllSliders();
      setSliders(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des sliders :", error.message);
    }
  };

  const backgroundImages = sliders.length > 0 ? sliders[0].images.map((img) =>`${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}${img}`) : [];

  const [news, setNews] = useState([]);
  const [email, setEmail] = useState('');
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    interest: '', // Pour stocker l'intérêt sélectionné
  });

  const [status, setStatus] = useState(''); // État pour afficher le statut (succès/échec)

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
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/news`); // API Backend
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
  }, []);
const [artists, setArtists] = useState([]); // État pour stocker les artistes

  useEffect(() => {
    // Fonction pour récupérer les artistes
    const fetchArtists = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/artistes`);
        setArtists(response.data); // Met à jour l'état avec les artistes
      } catch (error) {
        console.error('Erreur lors de la récupération des artistes:', error);
      }
    };

    fetchArtists(); 
  }, []);
  const [groupes, setGroupes] = useState([]); 

  useEffect(() => {
    // Fonction pour récupérer les artistes
    const fetchGroupes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/groupes`);
        setGroupes(response.data); // Met à jour l'état avec les artistes
      } catch (error) {
        console.error('Erreur lors de la récupération des groupes:', error);
      }
    };

    fetchGroupes(); 
  }, []);
  const [albums, setAlbums] = useState([]); 

  useEffect(() => {
    // Fonction pour récupérer les artistes
    const fetchAlbums = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/albums`);
        setAlbums(response.data); // Met à jour l'état avec les artistes
      } catch (error) {
        console.error('Erreur lors de la récupération des albums:', error);
      }
    };

    fetchAlbums(); 
  }, []);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
   
    const handleNavigation = () => {
      navigate("/artistdetails");
    };
    const handleNavigation1 = () => {
      navigate("/albums");
    };


    const handleNavigation3 = () => {
      navigate("/news");
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
  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen); // Toggle menu open/close state
  };
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
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${searchQuery}`); // Redirige vers la page de résultats
    }
  };
  return (
    <div className="max-w-[1920px] mx-auto scroll-smooth">
<div className="text-gray-100 text-[15px]" style={{ backgroundColor: '#111' }}>
<div
      className="relative lg:min-h-screen 2xl:min-h-[730px] before:absolute before:inset-0 before:w-full before:bg-black before:opacity-60"
      style={{
        backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        transition: 'background-image 1s ease-in-out'
      }}
    >
  
<header className='py-4 px-4 sm:px-10 z-50 min-h-[70px] relative'>
  
<div className='lg:flex lg:items-center gap-x-2 relative'>
        <div className="flex items-center shrink-0">
          <a href="/home"><img src={customLogo} alt="logo" className='w-40' /></a>
          <button id="toggleOpen" className='lg:hidden ml-auto' onClick={toggleMenu}>
            <svg className="w-7 h-7" fill="#fff" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"></path>
            </svg>
          </button>
        </div>

        <div
          id="collapseMenu"
          className={`lg:ml-14 w-full ${mobileMenuOpen ? 'max-lg:block' : 'max-lg:hidden'} max-lg:fixed max-lg:bg-black max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50`}>
          <button id="toggleClose" className='lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white p-3' onClick={toggleMenu}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 fill-black" viewBox="0 0 320.591 320.591">
              <path d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z" />
              <path d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z" />
            </svg>
          </button>

          <div className='lg:flex items-center w-full gap-6 max-lg:fixed max-lg:bg-black max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50'>
            <ul className='lg:flex gap-x-6 max-lg:space-y-3'>
              <li className='mb-6 hidden max-lg:block'>
                <a href="#"><img src={customLogo} className='w-50'/>
                </a>
              </li>
              <li className=' max-lg:border-b max-lg:py-3 px-3'><a href='#about-us' className='ml-4 hover:underline block transition-all'>About Us</a></li>
              <li className='max-lg:border-b max-lg:py-3 px-3'><a href='#artists' className='ml-4 hover:underline block transition-all'>Artists</a></li>
              <li className='max-lg:border-b max-lg:py-3 px-3'><a href='#albums' className='ml-4 hover:underline block transition-all'>Album</a></li>
              <li className='max-lg:border-b max-lg:py-3 px-3'><a href='#news' className='ml-4 hover:underline block transition-all'>News</a></li>
              <li className='max-lg:border-b max-lg:py-3 px-3'><a href='#contact-us' className='ml-4 hover:underline block transition-all'>Contact Us</a></li>
            </ul>

            <div className='flex xl:w-30 max-xl:w-full bg-transparent px-6 py-2.5 rounded-full border border-white lg:ml-auto max-lg:mt-10'>
           <a href='/casting' >Casting</a>

            
            </div>
          </div>
        </div>
      </div>
      </header>
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
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="17" cy="7" r="1.5" fill="#fff" fill-opacity="0"><animate fill="freeze" attributeName="fill-opacity" begin="1.3s" dur="0.15s" values="0;1"/></circle><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="72" stroke-dashoffset="72" d="M16 3c2.76 0 5 2.24 5 5v8c0 2.76 -2.24 5 -5 5h-8c-2.76 0 -5 -2.24 -5 -5v-8c0 -2.76 2.24 -5 5 -5h4Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="72;0"/></path><path stroke-dasharray="28" stroke-dashoffset="28" d="M12 8c2.21 0 4 1.79 4 4c0 2.21 -1.79 4 -4 4c-2.21 0 -4 -1.79 -4 -4c0 -2.21 1.79 -4 4 -4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.6s" values="28;0"/></path></g></svg>
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
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" fill-opacity="0" d="M12 11L12 12L12 13z" ><animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" values="M12 11L12 12L12 13z;M10 8.5L16 12L10 15.5z"/><set fill="freeze" attributeName="fill-opacity" begin="0.6s" to="1"/></path><path fill="none" stroke="#fff" stroke-dasharray="64" stroke-dashoffset="64" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5c9 0 9 0 9 7c0 7 0 7 -9 7c-9 0 -9 0 -9 -7c0 -7 0 -7 9 -7Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"/></path></svg>
        </SocialIcon>
        <SocialIcon href="https://spotify.com" target="_blank"className="hover:bg-[#1ED760] transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path stroke-dasharray="64" stroke-dashoffset="64" d="M2 12c0 -5.52 4.48 -10 10 -10c5.52 0 10 4.48 10 10c0 5.52 -4.48 10 -10 10c-5.52 0 -10 -4.48 -10 -10Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="64;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M8.63 15.31c2.18 -0.58 4.49 -0.34 6.5 0.69"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0"/></path><path stroke-dasharray="12" stroke-dashoffset="12" d="M7.5 12.07c1.1 -0.37 2.28 -0.57 3.5 -0.57c2.02 0 3.92 0.55 5.55 1.5"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="12;0"/></path><path stroke-dasharray="14" stroke-dashoffset="14" d="M7 8.91c1.38 -0.59 2.9 -0.91 4.5 -0.91c2.41 0 4.65 0.74 6.5 2"><animate fill="freeze" attributeName="stroke-dashoffset" begin="1s" dur="0.2s" values="14;0"/></path></g></svg>
        </SocialIcon>
      </SocialIconsContainer>
      <ScrollToTopButton onClick={scrollToTop} {...(showButton ? { visible: "true" } : {})}>
        ↑ UP
      </ScrollToTopButton>
<div className="max-w-5xl mx-auto text-center relative px-4 sm:px-10 mt-16 flex flex-col justify-start items-center min-h-screen font-semibold space-y-4 pt-20">
<TypeAnimation
     sequence={[
      'Bonjour ',        // French
      2000,
      'Welcome ',        // English
      2000,
      'عسلامة ',         // Arabic
      2000,
      'Hola ',           // Spanish
      2000,
      'Ciao ',           // Italian
      2000,
      'Hallo ',          // German
      2000,
      'こんにちは ',      // Japanese
      2000,
      '안녕하세요 ',      // Korean
      2000,
      '你好 ',            // Chinese (Mandarin)
      2000,
      'नमस्ते ',        // Hindi
      2000
     
    ]}
    
      wrapper="h1"
      speed={30}
      style={{ fontSize: '4em', display: 'inline-block' }}
      repeat={Infinity}
    />  
    

<h3 className="text-lg sm:text-xl md:text-2xl text-white-20">
  Shaping the future of entertainment
</h3>
<a href="#about-us"
type="button"className="px-5 py-2.5 rounded-full text-sm tracking-wider font-medium border border-white outline-none bg-transparent hover:bg-white text-white hover:text-[#111] transition-all duration-300">
Learn More 
        </a>
</div>

    </div> 
    <div
  id="about-us"
  className="w-full font-[sans-serif] bg-[#ffffff] py-16 px-4 flex items-center justify-center"
  style={{ minHeight: "600px" }}
>
  <div className="relative w-full flex flex-col md:flex-row">
    {/* Left Side - Black Rectangles */}
    <div className="relative w-full md:w-[40%]">
      {/* First Black Rectangle (top, rounded corners) */}
      <div className="absolute top-[10%] left-0 w-[90%] md:w-[80%] h-[25%] md:h-[35%] bg-black rounded-tr-[100px] rounded-br-[100px]"></div>

      {/* Second Black Rectangle (below, smaller) */}
      <div className="absolute top-[50%] left-0 w-[70%] md:w-[40%] h-[20%] md:h-[35%] bg-black rounded-tr-[100px] rounded-br-[100px]"></div>
    </div>

    {/* Right Side - Content */}
    <div className="relative w-full md:w-[70%] ml-auto px-4 md:px-8">
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black text-center md:text-left">
          About Us
        </h1>
        <div className="mt-6 mb-7">
          <p className="text-sm md:text-base text-black leading-relaxed text-justify">
            OMHY Entertainment is an innovative music label dedicated to discovering and promoting exceptional musical talents.
            Our mission is to support artists in the development of their careers and help them reach a global audience.
          </p>
          <p className="mt-4 text-sm md:text-base text-black leading-relaxed text-justify">
            We work with a diversity of passionate and creative artists, covering a wide range of musical genres, from pop
            and rock to electro and hip-hop. Each artist signed to OMHY Entertainment benefits from personalized support and
            an environment conducive to musical creation.
          </p>
        </div>
        <a
          href="/Aboutomhy"
          className="mt-6 inline-block px-6 py-3 rounded-full text-black text-sm tracking-wider font-semibold border border-black bg-transparent hover:bg-black hover:text-white transition-all duration-300"
        >
          More
        </a>
      </div>
    </div>
  </div>
</div>



<div id ="artists" className="px-4 sm:px-10 ">
  <div className="mt-32 max-w-7xl mx-auto">
    <div className="mb-16 max-w-2xl text-center mx-auto">
      <h2 className="md:text-4xl text-3xl font-semibold md:!leading-[50px] mb-6">Take a Sneak Peek To Our Artist</h2>
      <p className="text-gray-400">
  Dive into the unique world of our talents, where every piece tells a story and sparks emotions.
</p>
    </div>
  </div>

  
    <div className="carousel-container-artist">
      <h2>Artist Gallery</h2>
      <Slider {...artistSettings}>
  {[
    // Filtrer et mapper les artistes
    ...artists
      .filter((artist) => artist.bol === true) // Filtrer les artistes avec bol === true
      .map((artist) => (
        <div key={artist._id} className="artist-card">
          <img
            src={
              artist.photo && artist.photo.length > 0
                ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}/${artist.photo}`// URL pour la photo de l'artiste
                : "/default-avatar.png" // Image par défaut
            }
            alt={`${artist.prenom || ""} ${artist.nom || ""}`} // Nom complet de l'artiste
            className="artist-image"
          />
          
        </div>
      )),

    // Filtrer et mapper les groupes
    ...groupes
      .filter((groupe) => groupe.bol === true) // Filtrer les groupes avec bol === true
      .map((groupe) => (
        <div key={groupe._id} className="artist-card">
          <img
            src={
              groupe.photo && groupe.photo.length > 0
                ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}${groupe.photo[0]}` // URL pour la première photo du groupe
                : "/default-avatar.png" // Image par défaut
            }
            alt={groupe.name || "Nom du groupe inconnu"} // Nom du groupe
            className="artist-image"
          />
        </div>
      )),
  ]}
</Slider>

    

    {/* Inline CSS */}
    <style jsx>{`
  .carousel-container-artist {
    width: 85%;
    margin: 0 auto;
    padding-top: 20px;
  }

  .artist-card {
    text-align: center;
  }

  .artist-image {
    width: 450px; /* Taille fixe pour toutes les images */
    height: 370px; /* Taille fixe pour garder la cohérence */
    object-fit: cover; /* Coupe et ajuste l'image pour remplir la zone */
    border-radius: 8px;
  }

  /* Style pour les dots de navigation */
  .slick-dots li button {
    background-color: #ddd;
    border-radius: 50%;
    width: 10px;
    height: 10px;
  }

  .slick-dots li.slick-active button {
    background-color: #333;
  }
`}</style>

  </div>
    <div class="flex justify-center items-center ">
  <button
    type="button"
    class="px-6 py-3 rounded-full text-sm tracking-wider font-medium border border-white outline-none bg-transparent hover:bg-white text-white hover:text-[#111] transition-all duration-300 mt-10 mb-20"
    onClick={handleNavigation}
    >
    More
  </button>
</div>

</div>
<div id="albums" className="px-4 sm:px-10">
  <div className=" max-w-7xl mx-auto">
    <div className="mb-16 max-w-2xl text-center mx-auto">
      <h2 className="md:text-4xl text-3xl font-semibold md:!leading-[50px] ">Our Albums</h2>
      <p className="text-gray-400">
        Discover our latest album releases and enjoy a variety of music styles curated just for you.
      </p>
      
    </div>
  </div>
  {/* Album Carousel Section */}
  <div className="carousel-container-album">
    <h2>Album Gallery</h2>
    {albums && albums.length > 1 ? (
  // Cas où il y a plus d'un album
  <Slider {...albumSettings}>
    {albums.map((album) => (
      <div key={album.id} className="album-card">
        <img
          src={album.photo ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}${album.photo}` : "/placeholder.jpg"} // URL pour charger les images
          alt={album.titre || "Album"}
          className="album-image"
        />
      </div>
    ))}
  </Slider>
) : albums && albums.length === 1 ? (
  // Cas où il n'y a qu'un seul album
  <div className="album-card">
    <img
      src={albums[0].photo ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}${albums[0].photo}` : "/placeholder.jpg"} // URL pour charger l'image du premier album
      alt={albums[0].titre || "Album"}
      className="album-image"
    />
  </div>
) : (
  // Cas où il n'y a pas d'albums
  <p>No album available. Visit our website for more.</p>
)}






    {/* Inline CSS */}
    <style jsx>{`
      .carousel-container-album {
        width: 60%;
        margin: 0 auto;
        padding-top: 10px;
        margin-top:3px;
      }

      .album-card {
        text-align: center;
        padding: 10px;
      }

      .album-image {
        width: 100%;
        height: auto;
        border-radius: 8px;
      }
    `}</style>
  </div>

  {/* More Button Section */}
  <div className="flex justify-center items-center">
    <button
      type="button"
      className="px-6 py-3 rounded-full text-sm tracking-wider font-medium border border-white outline-none bg-transparent hover:bg-white text-white hover:text-[#111] transition-all duration-300 mt-10 mb-20"
      onClick={handleNavigation1}>
      More
    </button>
  </div>
</div>
<div id="news" className="bg-[#ffffff] font-sans p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 gap-12 items-center max-w-6xl max-lg:max-w-2xl max-sm:max-w-sm mx-auto">
        <div>
          <h2 className="text-4xl font-bold text-[#616161] uppercase mb-6">News</h2>
          <h2 className="text-3xl max-md:text-2xl font-extrabold text-[#111] uppercase leading-10">
        Discover Our Latest News
      </h2>
      <button 
       onClick={handleNavigation3}
        type="button"
        className="px-5 py-2.5 rounded-full text-sm tracking-wider font-medium border border-black outline-none bg-transparent text-black hover:text-[#111] transition-all duration-300 mt-6 inline-block"
      >
        See All
      </button>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:col-span-2">
      {news
        .slice(-4) // Affiche les 4 derniers articles
        .map((article) => (
          <div
            key={article._id}
            className="cursor-pointer rounded overflow-hidden group"
            onClick={() => {
              if (article.lien) {
                window.open(article.lien, "_blank"); // Ouvre le lien dans un nouvel onglet
              }
            }}
          >
            <img
              src={
                article.image
                  ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}/${article.image}`
                  : "/default-placeholder.png"
              }
              alt={article.titre}
              className="w-full h-52 object-cover rounded-md"
            />
            <div className="py-6">
              <span className="text-sm block text-gray-400 mb-2">
                {new Date(article.date).toLocaleDateString()}
              </span>
              <h3 className="text-xl font-bold text-[#111] group-hover:text-[#616161] transition-all">
                {article.titre.toUpperCase()}
              </h3>
            </div>
          </div>
        ))}
    </div>
      </div>
    </div>
<div id="contact-us" class="mt-6 max-w-6xl max-lg:max-w-3xl mx-auto rounded-lg">
            <div class="grid lg:grid-cols-2 items-center gap-14 sm:p-8 p-4 font-[sans-serif]">
                <div>
                    <h1 class="text-4xl font-bold text-white">Get in Touch</h1>
                    <p class="text-sm text-gray-300 mt-4 leading-relaxed">Have some big idea or brand to develop and need help? Then reach out we'd love to hear about your project  and provide help.</p>

                    <ul class="mt-12 space-y-8">
                        <li class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill='#fff'
                                viewBox="0 0 479.058 479.058">
                                <path
                                    d="M434.146 59.882H44.912C20.146 59.882 0 80.028 0 104.794v269.47c0 24.766 20.146 44.912 44.912 44.912h389.234c24.766 0 44.912-20.146 44.912-44.912v-269.47c0-24.766-20.146-44.912-44.912-44.912zm0 29.941c2.034 0 3.969.422 5.738 1.159L239.529 264.631 39.173 90.982a14.902 14.902 0 0 1 5.738-1.159zm0 299.411H44.912c-8.26 0-14.971-6.71-14.971-14.971V122.615l199.778 173.141c2.822 2.441 6.316 3.655 9.81 3.655s6.988-1.213 9.81-3.655l199.778-173.141v251.649c-.001 8.26-6.711 14.97-14.971 14.97z"
                                    data-original="#000000" />
                            </svg>
                            <a href="javascript:void(0)" class="text-white text-sm ml-4">
                            contact@omhyentertainment.com
                            </a>
                        </li>
   {/*<li className="flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill='#000' viewBox="0 0 482.6 482.6">
                                <path d="M98.339 320.8c47.6 56.9 104.9 101.7 170.3 133.4 24.9 11.8 58.2 25.8 95.3 28.2 2.3.1 4.5.2 6.8.2 24.9 0 44.9-8.6 61.2-26.3.1-.1.3-.3.4-.5 5.8-7 12.4-13.3 19.3-20 4.7-4.5 9.5-9.2 14.1-14 21.3-22.2 21.3-50.4-.2-71.9l-60.1-60.1c-10.2-10.6-22.4-16.2-35.2-16.2-12.8 0-25.1 5.6-35.6 16.1l-35.8 35.8c-3.3-1.9-6.7-3.6-9.9-5.2-4-2-7.7-3.9-11-6-32.6-20.7-62.2-47.7-90.5-82.4-14.3-18.1-23.9-33.3-30.6-48.8 9.4-8.5 18.2-17.4 26.7-26.1 3-3.1 6.1-6.2 9.2-9.3 10.8-10.8 16.6-23.3 16.6-36s-5.7-25.2-16.6-36l-29.8-29.8c-3.5-3.5-6.8-6.9-10.2-10.4-6.6-6.8-13.5-13.8-20.3-20.1-10.3-10.1-22.4-15.4-35.2-15.4-12.7 0-24.9 5.3-35.6 15.5l-37.4 37.4c-13.6 13.6-21.3 30.1-22.9 49.2-1.9 23.9 2.5 49.3 13.9 80 17.5 47.5 43.9 91.6 83.1 138.7zm-72.6-216.6c1.2-13.3 6.3-24.4 15.9-34l37.2-37.2c5.8-5.6 12.2-8.5 18.4-8.5 6.1 0 12.3 2.9 18 8.7 6.7 6.2 13 12.7 19.8 19.6 3.4 3.5 6.9 7 10.4 10.6l29.8 29.8c6.2 6.2 9.4 12.5 9.4 18.7s-3.2 12.5-9.4 18.7c-3.1 3.1-6.2 6.3-9.3 9.4-9.3 9.4-18 18.3-27.6 26.8l-.5.5c-8.3 8.3-7 16.2-5 22.2.1.3.2.5.3.8 7.7 18.5 18.4 36.1 35.1 57.1 30 37 61.6 65.7 96.4 87.8 4.3 2.8 8.9 5 13.2 7.2 4 2 7.7 3.9 11 6 .4.2.7.4 1.1.6 3.3 1.7 6.5 2.5 9.7 2.5 8 0 13.2-5.1 14.9-6.8l37.4-37.4c5.8-5.8 12.1-8.9 18.3-8.9 7.6 0 13.8 4.7 17.7 8.9l60.3 60.2c12 12 11.9 25-.3 37.7-4.2 4.5-8.6 8.8-13.3 13.3-7 6.8-14.3 13.8-20.9 21.7-11.5 12.4-25.2 18.2-42.9 18.2-1.7 0-3.5-.1-5.2-.2-32.8-2.1-63.3-14.9-86.2-25.8-62.2-30.1-116.8-72.8-162.1-127-37.3-44.9-62.4-86.7-79-131.5-10.3-27.5-14.2-49.6-12.6-69.7z" data-original="#000000"></path>
                            </svg>
      <span className="ml-4 text-black"></span>
    </li>}
    {/* Address */}
                        <li class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" fill='#fff' viewBox="0 0 368.16 368.16">
                                <path d="M184.08 0c-74.992 0-136 61.008-136 136 0 24.688 11.072 51.24 11.536 52.36 3.576 8.488 10.632 21.672 15.72 29.4l93.248 141.288c3.816 5.792 9.464 9.112 15.496 9.112s11.68-3.32 15.496-9.104l93.256-141.296c5.096-7.728 12.144-20.912 15.72-29.4.464-1.112 11.528-27.664 11.528-52.36 0-74.992-61.008-136-136-136zM293.8 182.152c-3.192 7.608-9.76 19.872-14.328 26.8l-93.256 141.296c-1.84 2.792-2.424 2.792-4.264 0L88.696 208.952c-4.568-6.928-11.136-19.2-14.328-26.808-.136-.328-10.288-24.768-10.288-46.144 0-66.168 53.832-120 120-120s120 53.832 120 120c0 21.408-10.176 45.912-10.28 46.152z" data-original="#000000"></path>
                                <path d="M184.08 64.008c-39.704 0-72 32.304-72 72s32.296 72 72 72 72-32.304 72-72-32.296-72-72-72zm0 128c-30.872 0-56-25.12-56-56s25.128-56 56-56 56 25.12 56 56-25.128 56-56 56z" data-original="#000000"></path>
                            </svg>
                            <a href="javascript:void(0)" class="text-white text-sm ml-4">
                                Tunisia
                            </a>
                        </li>
                    </ul>

                   
                </div>

                <div class="bg-gray-100 p-6 rounded-lg">
                    <p class="text-sm font-semibold text-gray-800">I'm interested in...</p>

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
          placeholder="Name"
          required
          className="w-full p-3 border rounded text-[#000000]"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="w-full p-3 border rounded text-[#000000]"
        />
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject"
          className="w-full p-3 border rounded text-[#000000]"
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Message"
          rows="4"
          required
          className="w-full p-3 border rounded text-[#000000]"
        ></textarea>
        <button
          type="submit"
          className="border border-black outline-none bg-transparent hover:bg-black text-black hover:text-white transition-all duration-300 tracking-wide rounded-full text-sm px-4 py-3 flex items-center justify-center w-full !mt-6 group"
        >
          Send Message
        </button>
      </form>
      {status && (
        <p className={`mt-4 text-center font-bold ${status.includes('') ? 'text-gray-900' : 'text-red-600'}`}>
          {status}
        </p> )}
                </div>
            </div>
</div>
<footer className="bg-[#ffffff] py-12 px-10 font-sans tracking-wide">
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

<div className="flex flex-col items-center px-4 py-6">
  {/* Menu items */}
  <ul className="flex flex-col sm:flex-row sm:items-center justify-center sm:gap-y-0 gap-y-4 mb-6 sm:space-x-6">
    <li>
      <a href="#about-us" className="text-[#111] hover:underline text-base">
        About Us
      </a>
    </li>
    <li>
      <a href="#artists" className="text-[#111] hover:underline text-base">
        Artists
      </a>
    </li>
    <li>
      <a href="#albums" className="text-[#111] hover:underline text-base">
        Albums
      </a>
    </li>
    <li>
      <a href="#news" className="text-[#111] hover:underline text-base">
        News
      </a>
    </li>
    <li>
      <a href="#contact-us" className="text-[#111] hover:underline text-base">
        Contact Us
      </a>
    </li>
    <li>
      <a href="/casting" className="text-[#111] hover:underline text-base">
        Casting
      </a>
    </li>
  </ul>

  {/* Logo */}
  <div className="mb-6">
    <a href="javascript:void(0)">
      <img src={customLogodark} alt="logo" className="w-40" />
    </a>
  </div>

  {/* Copyright */}
  <p className="text-[#000000] text-base text-center">
    © Omhy Entertainment. All rights reserved.
  </p>
  <p className="text-[#000000] text-base text-center mt-5">Made with ♥</p>
</div>
</div>
</footer>



  </div>

    </div>
  );
};

export default LandingPage;
