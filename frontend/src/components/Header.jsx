import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import logo from "../assets/images/logo.png";

const Header = () => {
  return (
    <header className="header">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Logo */}
        <div>
          <Link to="/" className="text-black text-decoration-none h4">
            <img src={logo} className="logo" alt="Logo" />
          </Link>
        </div>

        
        {/* <div className="flex-grow-1 mx-4">
          <form className="d-flex">
            <input
              type="text"
              className="form-control rounded-pill"
              placeholder="Search hotels..."
              aria-label="Search"
            />
            <button className="btn btn-light ms-2 rounded-pill" type="submit">
              <strong>Search</strong>
            </button>
          </form>
        </div> */}

        {/* Navigation Links */}
        <nav className="d-flex align-items-center">
          <Link to="/" className="text-black me-3 btn btn-outline-light rounded-pill px-4">
            Home
          </Link>
          <Link to="/hotels" className="text-black me-3 btn btn-outline-light rounded-pill px-4">
            Hotels
          </Link>

          <Link to="/add-hotel" className="text-black me-3 btn btn-outline-light rounded-pill px-4">
            Add Hotel
          </Link>
                  <Link to="/bookinglist" className="text-black me-3 btn btn-outline-light rounded-pill px-4">
            Booking List
          </Link>
          {/* User Dropdown Button for SignIn/Login */}
          <Dropdown className="me-3">
            <Dropdown.Toggle variant="light" id="signin-login-dropdown" className="btn btn-primary rounded-pill">
              <strong>signin / login</strong>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/login">
                Login
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/signin">
                SignIn
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* Profile Button - Using User Avatar Image */}
          <Link to="/profile" className="d-flex align-items-center">
            <img
              src="https://pic.onlinewebfonts.com/thumbnails/icons_542942.svg"
              alt="Profile"
              className="rounded-circle border border-2 border-light"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
          </Link>

        </nav>
      </div>
    </header>
  );
};

export default Header;
