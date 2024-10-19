import React, { ReactNode } from 'react';
import Link from 'next/link';

interface InfoBoxProps {
    heading: string;
    backgroundColor: string;
    buttonInfo: {
        link: string;
        text: string;
        backgroundColor: string;
    };
    children: ReactNode;
}

const InfoBox: React.FC<InfoBoxProps> = ({ heading, backgroundColor, buttonInfo, children }) => {
    return (
        <div className={`${backgroundColor} p-6 md:p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out`}>
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">{heading}</h2>
            <p className="text-base md:text-lg text-white mb-6">
                {children}
            </p>
            <Link href={buttonInfo.link} className={`inline-block ${buttonInfo.backgroundColor} text-white rounded-lg px-4 py-2 md:px-6 md:py-3 font-semibold transition-opacity duration-300 ease-in-out hover:opacity-90`}>
                {buttonInfo.text}
            </Link>
        </div>
    );
};

export default InfoBox;
