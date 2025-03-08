import React, { useEffect, useState } from "react";
import customLogo from "../../assets/img/custom-logo.png";
import styled from "styled-components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import backgroundImage1 from "assets/img/background1.jpg";
import backgroundImage2 from "assets/img/background2.jpg";
import backgroundImage3 from "assets/img/background3.jpg";
import backgroundImage4 from "assets/img/background4.jpg";
import backgroundImage5 from "assets/img/background5.jpg";
import backgroundImage6 from "assets/img/background6.jpg";
import backgroundImage7 from "assets/img/background7.jpg";
import backgroundImage8 from "assets/img/background8.jpg";
import axios from "axios";
import BackgroundImageService from "services/backgroundImageService";

// Styled components for buttons and icons
const ScrollToTopButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  background: #111;
  color: #fff;
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
  color: #fff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
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

const backgroundImages = [
  backgroundImage1,
  backgroundImage2,
  backgroundImage3,
  backgroundImage4,
  backgroundImage5,
  backgroundImage6,
  backgroundImage7,
  backgroundImage8,
];

const Casting = () => {


  const [sliders, setSliders] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Remplace **mot** par <b>mot</b>
  const formatText = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  };


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

  const backgroundImages = sliders.length > 0 ? sliders[0].images.map((img) => `${process.env.REACT_APP_API_BASE_URL.replace('/api', '')}${img}`) : [];

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
    fullName: "",
    email: "",
    phone: "",
    address: "",
    social: "",
    age: "",
    parentName: "",
    parentContact: "",
    profile: "",
    video: null,
    text:"",
  });
  const [age, setAge] = useState("");
  const [isUnder18, setIsUnder18] = useState(false);
  const [showButton, setShowButton] = useState(false);

  

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  // Handle age change
  const handleAgeChange = (e) => {
    const value = e.target.value;
    setAge(value);
    setFormData((prevData) => ({
      ...prevData,
      age: value,
    }));
    setIsUnder18(parseInt(value) < 18);
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/casting`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Casting submission successful!");
      console.log(response.data);
      
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit casting form.");
    }
  };
  

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Go back button handler
  const handleGoBack = () => {
    window.history.back(); // Navigate to the previous page
  };
  const [adminMessage, setAdminMessage] = useState("");

  // Charger le message depuis localStorage au chargement de la page
  useEffect(() => {
    const savedMessage = localStorage.getItem("adminMessage");
    if (savedMessage !== null) {
      setAdminMessage(savedMessage);
    }
  }, []);
  
  return (
    <div className="max-w-[1920px] mx-auto scroll-smooth">
      <div
        style={{
          backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          transition: "background-image 1s ease-in-out",
        }}
        className="min-h-screen"
      >
        <header className="py-4 px-4 sm:px-10 z-50 min-h-[70px] relative">
          <div className="flex items-center gap-x-2 relative">
            <a href="/home">
              <img src={customLogo} alt="logo" className="w-40" />
            </a>
          </div>
        </header>

       <div className="casting-form-container p-10 px-4 sm:px-10">
  <form className="bg-[#111] p-10 rounded-lg shadow-lg text-[#fff] max-w-3xl mx-auto" onSubmit={handleSubmit}>
    <h3 className="text-4xl font-bold text-center mb-8">Casting Subscription</h3>
    
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 gap-y-6">
      <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" className="w-full p-3 rounded-md bg-[#222] text-[#ddd] border border-[#444]" required />
      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" className="w-full p-3 rounded-md bg-[#222] text-[#ddd] border border-[#444]" required />
      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full p-3 rounded-md bg-[#222] text-[#ddd] border border-[#444]" required />
      <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Home Address" className="w-full p-3 rounded-md bg-[#222] text-[#ddd] border border-[#444]" required />
      <input type="text" name="social" value={formData.social} onChange={handleInputChange} placeholder="Instagram/Facebook (Optional)" className="w-full p-3 rounded-md bg-[#222] text-[#ddd] border border-[#444]" />
      <input type="number" name="age" value={age} onChange={handleAgeChange} placeholder="Age" className="w-full p-3 rounded-md bg-[#222] text-[#ddd] border border-[#444]" required />
      
      {isUnder18 && (
        <>
          <input type="text" name="parentName" value={formData.parentName} onChange={handleInputChange} placeholder="Parent Full Name" className="w-full p-3 rounded-md bg-[#222] text-[#ddd] border border-[#444]" required />
          <input type="tel" name="parentContact" value={formData.parentContact} onChange={handleInputChange} placeholder="Parent's Contact Number" className="w-full p-3 rounded-md bg-[#222] text-[#ddd] border border-[#444]" required />
        </>
      )}
      
      <textarea name="profile" value={formData.profile} onChange={handleInputChange} placeholder="Describe yourself (max 300 characters)" className="w-full p-3 rounded-md bg-[#222] text-[#ddd] border border-[#444] col-span-2" maxLength="300" rows="4"></textarea>
      <input type="file" name="video" onChange={handleFileChange} accept="video/*" className="w-full p-3 rounded-md bg-[#222] text-[#ddd] border border-[#444]" required />
    </div>

    {/* Bouton amélioré */}
    <button type="submit" className="w-full max-w-sm mx-auto p-3 mt-4 rounded-full border border-[#ddd] text-[#ddd] hover:bg-[#ddd] hover:text-[#111] transition-all duration-300">
      Submit
    </button>
  </form>
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
    </div>
    
  );
};

export default Casting;
