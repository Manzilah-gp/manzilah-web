import React from "react";
import { FacebookOutlined, InstagramOutlined, TwitterOutlined, YoutubeOutlined } from "@ant-design/icons";
import "../Styles/Header_Footer.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-section">
          <h4>Manzilah</h4>
          <p>Connecting mosques, students, teachers, and donors across Palestine.</p>
        </div>
        <div className="footer-section">
          <h4>Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/courses">Courses</a></li>
            <li><a href="/mosques">Mosques</a></li>
            <li><a href="/registration">Registration</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <FacebookOutlined />
            <InstagramOutlined />
            <TwitterOutlined />
            <YoutubeOutlined />
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Manzilah. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
