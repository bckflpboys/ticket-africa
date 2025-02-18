import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="footer p-10 bg-base-200 text-base-content">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="footer-title">Company</span>
            <Link href="/about" className="link link-hover">About us</Link>
            <Link href="/contact" className="link link-hover">Contact</Link>
            <Link href="/careers" className="link link-hover">Careers</Link>
          </div>
          <div>
            <span className="footer-title">Legal</span>
            <Link href="/terms" className="link link-hover">Terms of use</Link>
            <Link href="/privacy" className="link link-hover">Privacy policy</Link>
            <Link href="/cookie" className="link link-hover">Cookie policy</Link>
          </div>
          <div>
            <span className="footer-title">Social</span>
            <div className="flex gap-4">
              <a href="#" className="link link-hover">Twitter</a>
              <a href="#" className="link link-hover">Facebook</a>
              <a href="#" className="link link-hover">Instagram</a>
            </div>
          </div>
          <div>
            <span className="footer-title">Newsletter</span>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Enter your email</span>
              </label>
              <div className="relative">
                <input type="text" placeholder="username@site.com" className="input input-bordered w-full pr-16" />
                <button className="btn btn-primary absolute top-0 right-0 rounded-l-none">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
