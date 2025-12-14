import React from 'react';
import DecryptedText from './sokulu/DecryptedText';
import CyberFrame from './sokulu/CyberFrame'; // Import the new component

// Optional: Replace with your actual image path
import profileImg from './images/me.png'; 

const Main_story = () => (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
            
            {/* Text Content - Left Side */}
            <div className="flex-1 text-left max-w-2xl">
                <h2 className="text-lg md:text-xl text-gold font-mono mb-4">
                    Greetings, I am
                </h2>
                
                <DecryptedText 
                    text="KURAPATI VENKATA LAKSHMI NARASIMHA KUSHAL."
                    parentClassName="text-3xl sm:text-4xl md:text-5xl font-bold text-light-slate mb-4 tracking-wider leading-tight"
                    encryptedClassName="text-encrypted"
                    animateOn="hover"
                    speed={50}
                    sequential={true}
                    revealDirection="start"
                />

                <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate mb-6 mt-2 tracking-wide">
                    I build for the future web.
                </h3>
                
                <p className="text-slate mb-10 text-base sm:text-lg leading-relaxed max-w-xl">
                    I'm a software engineer specializing in building high-performance digital experiences. Currently, I'm focused on developing robust systems and translating complex data into actionable insights.
                </p>
                
                <a
                    href="https://www.linkedin.com/in/venkata-lakshmi-narasimha-kushal-kurapati-729ab4289/"  target='_blank' rel='noopener noreferrer'
                    className="inline-block text-gold border-2 border-gold rounded-md px-8 py-3 font-bold text-lg
                               hover:bg-gold/10 hover:shadow-[0_0_15px_rgba(255,215,0,0.3)] transition-all duration-300"
                >
                    Connect With Me
                </a>

                {
                /* rel="noopener noreferrer" is a security best practice when opening external links 
                noopener

Prevents the new tab from accessing window.opener
Protects your site from tab-nabbing attacks
Improves performance by cutting the JS connection between tabs

noreferrer
Prevents sending your page’s URL as the referrer to the new site
Adds an extra layer of privacy.
Automatically implies noopener in most modern browsers

                */
                }

            </div>

            {/* Image Content - Right Side */}
            <div className="flex-1 w-full max-w-md lg:max-w-lg justify-center">
                 {/* Pass your image URL here. If you don't have one yet, it uses a placeholder. */}
                <CyberFrame imageUrl={profileImg} />
            </div>
        </div>
    </section>
);

export default Main_story;