import {
    LayoutDashboardIcon,
    User,
    FileText,
    ArrowRight, FlagIcon
} from 'lucide-react';

import {
    FaBath,
    FaBed,
    FaBuilding,
    FaCalendarAlt,
    FaDog,
    FaEye,
    FaFire,
    FaHome,
    FaMapMarkerAlt,
    FaParking,
    FaRulerCombined,
    FaWarehouse,
    FaWifi,
    FaTag,
} from 'react-icons/fa';
import {
    MdFence,
    MdHouse,
    MdOutlineBalcony,
    MdOutlineGarage,
} from 'react-icons/md';

export const NavIcons = {
    dashboard: LayoutDashboardIcon,
    user: User,
    post: FileText,
    arrowRight: ArrowRight,
    flag: FlagIcon,
}

export const Icons = {
    area: <FaRulerCombined className="mr-2 text-blue-500" />,
    bedrooms: <FaBed className="mr-2 text-blue-500" />,
    bathrooms: <FaBath className="mr-2 text-blue-500" />,
    floor: <FaBuilding className="mr-2 text-blue-500" />,
    internet: <FaWifi className="mr-2 text-blue-500" />,
    address: <FaMapMarkerAlt className="text-lg text-orange-700" />,
    parking: <FaParking className="mr-2 text-blue-500" />,
    heating: <FaFire className="mr-2 text-blue-500" />,
    petPolicy: <FaDog className="mr-2 text-blue-500" />,
    yearBuilt: <FaCalendarAlt className="mr-2 text-blue-500" />,
    views: <FaEye className="mr-2 text-blue-500" />,
    loggia: <FaWarehouse className="mr-2 text-blue-500" />,
    fencing: <MdFence className="mr-2 text-blue-500" />,
    balcony: <MdOutlineBalcony className="mr-2 text-blue-500" />,
    garage: <MdOutlineGarage className="mr-2 text-blue-500" />,
    renovation: <FaHome className="mr-2 text-blue-500" />,
    house: <MdHouse className="mr-2 text-blue-500" />,
    tag: <FaTag className="mr-2 text-blue-500" />,
};
