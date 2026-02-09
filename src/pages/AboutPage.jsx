import React from 'react';
import { Shield, Zap, Globe, Github, Twitter, Mail, HelpCircle, FileText } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="page-container fade-in">
            <div className="about-container">
                {/* Hero Section */}
                <div className="about-hero">
                    <h1>About <span className="highlight-text">VidGrab</span></h1>
                    <p className="about-subtitle">The world's most advanced, privacy-focused video downloader.</p>
                </div>

                {/* Mission Grid */}
                <div className="about-grid">
                    <div className="about-card glass-panel">
                        <div className="icon-wrapper"><Zap size={24} className="text-accent" /></div>
                        <h3>Lightning Fast</h3>
                        <p>Our proprietary chunking engine splits files into smaller pieces to maximize your bandwidth, delivering downloads up to 500% faster than standard browser downloads.</p>
                    </div>
                    <div className="about-card glass-panel">
                        <div className="icon-wrapper"><Shield size={24} className="text-accent" /></div>
                        <h3>Privacy First</h3>
                        <p>We believe in digital freedom. VidGrab operates with a strict no-logs policy. We don't track your downloads, your IP, or your personal data. What you download is your business.</p>
                    </div>
                    <div className="about-card glass-panel">
                        <div className="icon-wrapper"><Globe size={24} className="text-accent" /></div>
                        <h3>Universal Support</h3>
                        <p>From social media giants like Twitter and Instagram to video platforms like YouTube and Vimeo, VidGrab supports over 1000+ websites with a single click.</p>
                    </div>
                </div>

                {/* Detailed Info Section */}
                <div className="about-section glass-panel">
                    <div className="section-header">
                        <HelpCircle size={20} className="text-accent" />
                        <h2>Frequently Asked Questions</h2>
                    </div>

                    <div className="faq-item">
                        <h4>Is VidGrab really free?</h4>
                        <p>Yes, VidGrab is 100% free to use. We rely on unintrusive advertising and community donations to keep our high-performance servers running.</p>
                    </div>

                    <div className="faq-item">
                        <h4>Where are my files saved?</h4>
                        <p>On Android and Desktop, files are saved to your device's default "Downloads" folder. On iOS, you can find them in the "Files" app.</p>
                    </div>

                    <div className="faq-item">
                        <h4>Is it legal?</h4>
                        <p>VidGrab is a tool designed for personal backup and educational purposes. We do not endorse copyright infringement. Please respect the rights of content creators.</p>
                    </div>

                    <div className="faq-item">
                        <h4>How do I install the App?</h4>
                        <p>VidGrab is a Progressive Web App (PWA). You can install it directly from your browser by tapping "Add to Home Screen" in your browser's menu, or by clicking the install button in the settings.</p>
                    </div>
                </div>

                {/* Contact / Links */}
                <div className="about-links-grid">
                    <a href="https://github.com/manash44/vidgrab" target="_blank" rel="noopener noreferrer" className="link-card glass-panel">
                        <Github size={24} />
                        <span>Open Source</span>
                    </a>
                    <a href="#" className="link-card glass-panel">
                        <Twitter size={24} />
                        <span>Twitter</span>
                    </a>
                    <a href="mailto:support@vidgrab.app" className="link-card glass-panel">
                        <Mail size={24} />
                        <span>Support</span>
                    </a>
                    <div className="link-card glass-panel">
                        <FileText size={24} />
                        <span>Terms of Service</span>
                    </div>
                </div>

                <div className="about-footer">
                    <p>Built with ❤️ by the VidGrab Team.</p>
                    <p className="version">Version 2.1.0 (Stable)</p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
