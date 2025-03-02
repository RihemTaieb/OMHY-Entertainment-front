import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import customLogodark from "../../assets/img/custom-logo-dark.png";
import customLogo from "../../assets/img/custom-logo.png";

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
const NewsCard = styled.div`
  position: relative;
  width: 300px;
  height: 350px;
  background-color: #f5f5f5;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid transparent;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border: 2px solid black;
    transform: scale(1.05);
  }

  &:hover .image-title {
    opacity: 0; /* Masquer l'image, le titre et la date */
    transform: translateY(-20px);
  }

  &:hover .content {
    opacity: 1; /* Afficher le contenu */
    transform: translateY(0);
  }
`;

// Conteneur pour l'image, le titre et la date (visible au début)
const ImageAndTitle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  transition: all 0.3s ease;
  opacity: 1; /* Visible par défaut */
`;

// Titre de l'article
const NewsTitle = styled.h3`
  font-size: 18px;
  color: #333;
  font-weight: bold;
  margin: 0;
  text-align: center;
`;

// Date de publication
const NewsDate = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
  text-align: center;
`;

// Image de l'article
const NewsImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
`;

// Conteneur pour le contenu (visible au survol)
const HoverContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 16px;
  background-color: #fff; /* Fond blanc pour le contenu */
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  align-items: center;
  opacity: 0; /* Masqué par défaut */
  transform: translateY(20px);
  transition: all 0.3s ease;
`;

// Contenu de l'article
const NewsContent = styled.p`
  font-size: 14px;
    font-weight: bold;

  color: #333;
  line-height: 1.5;
  text-align: justify;
`;
const DiscoverButton = styled.button`
    background-color:rgb(9, 9, 9);
    color: white;
    border: none;
    padding: 10px 15px;
    font-size: 14px;
    cursor: pointer;
    border-radius: 30px;
    margin-top: 10px;

    &:hover {
        background-color:rgb(7, 7, 7);
    }
`;


// Main Component
const NewsDetails = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
      
  const [currentPage, setCurrentPage] = useState(1);
  const [news, setNews] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const newsPerPage = 6;
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

  // Fetch news articles
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/news`); // API Backend
        // Sort the news by date in descending order (most recent first)
        const sortedNews = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setNews(sortedNews);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Filter news articles based on search query
const filteredResults = news.filter((article) =>
    article.titre?.toLowerCase().includes(searchQuery.toLowerCase()) // Optional chaining to prevent errors
  );
  
  // Pagination logic
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  
  // Paginate only the filtered results
  const currentNews = filteredResults.slice(indexOfFirstNews, indexOfLastNews);
  
  // Calculate total pages based on filtered results
  const totalPages = Math.ceil(filteredResults.length / newsPerPage);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Show/hide scroll-to-top button on scroll
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

  return (
    <>
      <div className="max-w-[1920px] mx-auto scroll-smooth bg-[#FFFFFF]">
        <header className="py-4 px-4 sm:px-10 z-50 min-h-[70px] relative bg-[#FFFFFF]">
          <div className="lg:flex lg:items-center gap-x-2 relative">
            <div className="flex items-center shrink-0">
              <a href="/home">
                <img src={customLogodark} alt="logo" className="w-40" />
              </a>
            </div>
          </div>
        </header>

        <div className="font-[sans-serif] px-6 py-16">
          <div className="text-center max-w-3xl max-md:max-w-md mx-auto">
            <h2 className="text-gray-1000 md:text-5xl text-3xl font-extrabold md:!leading-[55px]">
              Latest News
            </h2>
            <div className="bg-[#FFFFFF] flex px-2 py-1.5 rounded-full text-left mt-10 mx-auto border border-black">
              <input
                type="text"
                placeholder="Search news..."
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

        {/* News Articles */}
        <div className="pt-20 flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-2 sm:px-4">
          {currentNews.map((article) => (
  <NewsCard 
  key={article._id}
  onClick={() => {
      if (article.lien) {
        window.open(article.lien, "_blank"); // Ouvre le lien dans un nouvel onglet
      }
  }}
>
  {/* Contenu affiché initialement */}
  <ImageAndTitle className="image-title">
      <NewsImage
          src={
              article.image
                  ? `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}/${article.image}`
                  : "/default-placeholder.png"
          }
          alt={article.titre || "Untitled Article"}
      />
      <NewsTitle>{article.titre.toUpperCase() || "Untitled Article"}</NewsTitle>
      <NewsDate>{new Date(article.date).toLocaleDateString()}</NewsDate>
       {/* Afficher le bouton uniquement si un lien existe */}
       {article.lien && (
          <DiscoverButton 
              onClick={(e) => {
                  e.stopPropagation(); // Empêcher le clic sur NewsCard de s'exécuter
                  window.open(article.lien, "_blank");
              }}
          >
              Discover
          </DiscoverButton>
      )}
  </ImageAndTitle>

  {/* Contenu affiché au survol */}
  <HoverContent className="content">
      <NewsTitle>{article.titre.toUpperCase() || "Untitled Article"}</NewsTitle>
      <NewsContent style={{ whiteSpace: "pre-line" }}>{article.contenu || "No content available"}</NewsContent>

      {/* Afficher le bouton uniquement si un lien existe */}
      {article.lien && (
          <DiscoverButton 
              onClick={(e) => {
                  e.stopPropagation(); // Empêcher le clic sur NewsCard de s'exécuter
                  window.open(article.lien, "_blank");
              }}
          >
              Discover
          </DiscoverButton>
      )}
  </HoverContent>
</NewsCard>
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
      </div>

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
    </>
  );
};

export default NewsDetails;
