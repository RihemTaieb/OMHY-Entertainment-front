import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import customLogo from "../../assets/img/custom-logo.png";
import customLogodark from "../../assets/img/custom-logo-dark.png";

// Styled components
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
  display: ${(props) => (props.$visible ? "block" : "none")};
`;

const GoBackButton = styled.button`
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 50px;
  height: 50px;
  background: #111;
  color: ${(props) => (props.isDark ? "#000" : "#fff")};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1000;
  display: block;
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
    margin-bottom: 20px;

`;

const PageButton = styled.button`
  background-color: transparent;
  border: 2px solid black;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 50%;
  color: black;
  font-size: 16px;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: black;
    color: white;
  }

  &.active {
    background-color: black;
    color: white;
  }
`;

const ArtistCard = styled.div`
  text-align: center;
  position: relative;
  width: 250px;
  margin: 10px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const ArtistImage = styled.img`
  height: 250px; /* Taille fixe pour garder la cohérence */
  width: 350px;
  border-radius: 10px;
`;

// Main component
const ArtistDetails = () => {

  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [artists, setArtists] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showButton, setShowButton] = useState(false);
  const artistsPerPage = 6;
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
  const navigate = useNavigate();

  // Fetch groupes
  useEffect(() => {
    const fetchGroupes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/groupes`);
        setGroupes(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des groupes:", error);
      }
    };

    fetchGroupes();
  }, []);

  // Fetch artists
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/artistes`);
        setArtists(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des artistes:", error);
      }
    };

    fetchArtists();
  }, []);

  // Search functionality
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };
  const filteredArtists = artists.filter(
    (item) => item.bol === true && item.prenom && item.nom
  ); 
  const filteredResults = [
    ...filteredArtists.filter((artist) =>
      `${artist.prenom} ${artist.nom}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ),
    ...groupes.filter((groupe) =>
      groupe.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  ];
  // Pagination
  const indexOfLastArtist = currentPage * artistsPerPage;
  const indexOfFirstArtist = indexOfLastArtist - artistsPerPage;
  const currentArtists = filteredResults.slice(indexOfFirstArtist, indexOfLastArtist);
  const totalPages = Math.ceil(filteredResults.length / artistsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoBack = () => {
    window.history.back();
  };
  const handleRedirect = () => {
    navigate("/home#contact-us");
    setTimeout(() => {
      const section = document.getElementById("contact-us");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 500); // Petit délai pour s'assurer que la navigation est terminée
  };


  return (
  
      <div className="max-w-[1920px] mx-auto scroll-smooth bg-[#FFFFFF]">
        <header className="py-4 px-4 sm:px-10 z-50 min-h-[70px] relative bg-[#FFFFFF]">
          

        <div className="lg:flex items-center justify-between w-full gap-6 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
  {/* Logo Section */}
  <div className="flex items-center shrink-0 mb-4 lg:mb-0">
    <a href="/home" >
      <img src={customLogodark} alt="logo" className="w-40" />
    </a>
  </div>

  {/* Navigation Menu */}
  <ul className="lg:flex items-center gap-x-6 max-lg:space-y-3 bg-white text-black">
  
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
    <li
        onClick={handleRedirect}
        className="max-lg:border-b max-lg:py-3 px-3"
      >
        <span className="ml-4 hover:underline block transition-all">
          Contact Us
        </span>
      </li>
  </ul>

  {/* Call-to-Action Button */}
  <div
  className="flex items-center justify-center bg-transparent px-6 py-2.5 rounded-full border border-black shadow-xl lg:ml-auto max-lg:mt-10"
>
  <a href="/casting" className="text-black hover:underline">
    Casting
  </a>
</div>

</div>

          
        </header>
<main>
        <div className="font-[sans-serif] px-6 py-16">
          <div className="text-center max-w-3xl max-md:max-w-md mx-auto">
            <h2 className="text-gray-1000 md:text-5xl text-3xl font-extrabold md:!leading-[55px]">
              Explore Our Artists
            </h2>
            <div className="bg-[#FFFFFF] flex px-2 py-1.5 rounded-full text-left mt-10 mx-auto border border-black">
              <input
                type="text"
                className="w-full outline-none bg-transparent text-sm pl-4"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button
                type="button"
                className="border border-black outline-none bg-transparent hover:bg-black text-black hover:text-[#dddddd] transition-all duration-300 text-sm rounded-full px-5 py-2.5 ml-4"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Artists and Groups */}
        <div className="pt-20 flex justify-center">
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-2 sm:px-4">

    {/* Rendu des artistes */}
    {currentArtists
      .filter((item) => item.bol === true && item.prenom && item.nom) // Filtrer les artistes
      .map((artist) => (
        <ArtistCard key={artist._id}>
          <ArtistImage
            src={
              artist.photo && artist.photo.length > 0
                ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}/${artist.photo[0]}` // URL pour la photo de l'artiste
                : "/default-avatar.png" // Image par défaut
            }
            alt={`${artist.prenom} ${artist.nom}`} // Nom complet de l'artiste
            onClick={() => navigate(`/profile/${artist._id}`)} // Navigate vers le profil de l'artiste
          />
          <a
            onClick={() => navigate(`/profile/${artist._id}`)}
            className="mt-2 hover:underline cursor-pointer block"
          >
            <h3>{`${artist.prenom} ${artist.nom}`.toUpperCase()}</h3>
          </a>
        </ArtistCard>
      ))}

    {/* Rendu des groupes */}
    {currentArtists
      .filter((item) => item.bol === true && !item.prenom && !item.nom) // Filtrer les groupes
      .map((groupe) => (
        <ArtistCard key={groupe._id}>
          <ArtistImage
            src={
              groupe.photo && groupe.photo.length > 0
                ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}${groupe.photo[0]}` // URL pour la photo du groupe
                : "/default-avatar.png" // Image par défaut
            }
            alt={groupe.name || "Nom du groupe inconnu"} // Nom du groupe
            onClick={() => navigate(`/groupe/${groupe._id}`)} // Navigate vers le groupe
          />
          <a
            onClick={() => navigate(`/groupe/${groupe._id}`)}
            className="mt-2 hover:underline cursor-pointer block"
          >
            <h3>{groupe.name || "Nom du groupe inconnu"}</h3>
          </a>
        </ArtistCard>
      ))}
  </div>
</div>


        {/* Pagination */}
        <PaginationContainer>
          {Array.from({ length: totalPages }, (_, index) => (
            <PageButton
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? "active" : ""}
            >
              {index + 1}
            </PageButton>
          ))}
        </PaginationContainer>

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
</main>
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
      <p className="text-[#ddd] text-base mt-5">Made with ♥ </p>

    </div>
  </div>
</footer>
      </div>

      

    
  );
  
};

export default ArtistDetails;
