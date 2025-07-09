import React, { useEffect, useRef } from 'react';

const logos = [
  { src: '/logos/google.svg', alt: 'Google' },
  { src: '/logos/microsoft.svg', alt: 'Microsoft' },
  { src: '/logos/apple.svg', alt: 'Apple' },
  { src: '/logos/github.svg', alt: 'GitHub' },
  { src: '/logos/meta.svg', alt: 'Meta' },
  { src: '/logos/amazon.svg', alt: 'Amazon' },
  { src: '/logos/openai.svg', alt: 'OpenAI' },
];

export const LogoCloud: React.FC = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.setAttribute('data-animated', 'true');
    }
  }, []);

  return (
    // --- PERUBAHAN DI SINI ---
    <div className="relative z-10 w-full overflow-hidden border-y border-white/10 bg-white/5 py-16">
      <p className="mb-8 text-center font-satoshi text-sm text-neutral-500">
        Dipercaya oleh tim-tim inovatif di seluruh dunia
      </p>
      <div className="scroller" ref={scrollerRef}>
        <div className="scroller-inner">
          {[...logos, ...logos].map((logo, index) => (
            <div key={index} className="logo-item-container">
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-6 w-auto logo-item"
              />
              <span className="font-satoshi text-lg font-medium">
                {logo.alt}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};