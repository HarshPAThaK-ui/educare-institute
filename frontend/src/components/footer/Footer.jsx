import React from 'react'
import './footer.css'
import { FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import { IoLogoTwitter } from "react-icons/io";

const Footer = () => {
  return (
    <footer>
        <div className="footer-content">
            <p>
                &copy; Educare Institute 2025. All rights reserved. <br /> Made with ❤️ by Harsh Pathak
            </p>
            <div className="social-links">
  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
    <FaFacebook />
  </a>
  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
    <FaSquareInstagram />
  </a>
  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
    <IoLogoTwitter />
  </a>
</div>

        </div>
    </footer>
  )
}

export default Footer
