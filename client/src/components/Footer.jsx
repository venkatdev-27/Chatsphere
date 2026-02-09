import React from "react";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gray-950 text-white py-14 border-t border-gray-900">
            <div className="container mx-auto px-6">
                {/* Top */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                            ChatSphere
                        </h3>
                        <p className="text-gray-400 mt-3 max-w-sm text-sm leading-relaxed">
                            A modern real-time chat platform built for speed, security,
                            and seamless communication across devices.
                        </p>

                        <div className="flex space-x-5 mt-5">
                            <a
                                href="https://github.com/venkatdev-27/ChatSphere"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 transition-transform duration-200 ease-out hover:text-white hover:scale-125"
                                aria-label="GitHub"
                            >
                                <Github size={24} />
                            </a>
                            <a
                                href="https://linkedin.com/in/venkat18"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 transition-transform duration-200 ease-out hover:text-white hover:scale-125"
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={24} />
                            </a>
                            <a
                                href="https://x.com/VenkatK04181110"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 transition-transform duration-200 ease-out hover:text-white hover:scale-125"
                                aria-label="X"
                            >
                                <Twitter size={24} />
                            </a>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
                            Services
                        </h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li>
                                <a href="#hero" className="hover:text-white transition-colors cursor-pointer">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="#overview" className="hover:text-white transition-colors cursor-pointer">
                                    Overview
                                </a>
                            </li>
                            <li>
                                <a href="#features" className="hover:text-white transition-colors cursor-pointer">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#services" className="hover:text-white transition-colors cursor-pointer">
                                    Services
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>
                        © {new Date().getFullYear()} ChatSphere. All rights reserved.
                    </p>

                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <span className="hover:text-gray-300 transition-colors cursor-pointer">
                            Privacy Policy
                        </span>
                        <span className="hover:text-gray-300 transition-colors cursor-pointer">
                            Terms of Service
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
