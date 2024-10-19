import Hero from '@/components/home/Hero';
import FitPropertyList from '@/components/property/home-property/FitPropertyList';
import HomeInfoBoxes from "@/components/home/HomeInfoBoxes";
import LastAddPropertyList from "@/components/property/home-property/LastAddPropertyList";

export default async function Home() {
    return (
        <>
            <Hero />
            <HomeInfoBoxes />
            <FitPropertyList />
            <LastAddPropertyList />
        </>
    );
}
