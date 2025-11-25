import React from 'react';
import Image from 'next/image';

const BuyMeACoffeeWidget = () => {
    return (
        <a
            href="https://www.buymeacoffee.com/hskdev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-2 py-1 bg-white shadow-md rounded-lg transition-all hover:bg-[#FFDD00] "
            style={{ fontFamily: 'Cookie, cursive, sans-serif' }}
        >
            <Image
                src="/buymeacoffee-logo.png"
                alt="Buy Me a Coffee logo"
                width={24}
                height={24}
                className="mr-2"
            />
            <span className="text-xl" style={{ color: '#000' }}>
                Buy me a coffee
            </span>
        </a>
    );
};

export default BuyMeACoffeeWidget;
