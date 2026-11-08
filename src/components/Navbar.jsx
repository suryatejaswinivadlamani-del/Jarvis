import React, { useState, useEffect } from 'react';
import { MenuIcon, CloseIcon, SparklesIcon } from './Icons';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Live Console', href: '#console' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Architecture', href: '#architecture' },
  ];

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Brand Logo */}
        <a href="#" className="navbar-brand">
          <div className="brand-icon-wrapper">
            <span className="brand-pulse-dot"></span>
            <SparklesIcon className="brand-svg" />
          </div>
          <span className="brand-name">
            J.A.R.V.I.S<span className="brand-accent">.AI</span>
          </span>
        </a>

        {/* Desktop Links */}
        <nav className="navbar-desktop-nav">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="navbar-desktop-actions">
          <a href="#console" className="btn-secondary">
            System Status
          </a>
          <a href="#console" className="btn-primary">
            <span>Launch Console</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav-list">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mobile-drawer-actions">
              <a
                href="#console"
                className="btn-primary full-width"
                onClick={() => setMobileMenuOpen(false)}
              >
                Launch Console
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
