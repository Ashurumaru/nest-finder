import React, { ReactNode } from 'react';

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
        <div className={`${backgroundColor} p-6 rounded-lg shadow-md`}>
            <h2 className="text-2xl font-bold">{heading}</h2>
            <p className="mt-2 mb-4">
                {children}
            </p>
            <a
                href={buttonInfo.link}
                className={`inline-block ${buttonInfo.backgroundColor} text-white rounded-lg px-4 py-2 opacity-80`}
            >
                {buttonInfo.text}
            </a>
        </div>
    );
}

export default InfoBox;
