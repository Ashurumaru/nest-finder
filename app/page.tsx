import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedProperties from '@/components/FeaturedProperties';
import InfoBoxes from "@/components/InfoBoxes";
import HomeProperties from "@/components/HomeProperties";
import {getProperties} from "@/utils/getProperties";

export default async function Home() {
    const data = await getProperties();
    return (
        <>
            <Header />
            <Hero />
            <FeaturedProperties properties={data}/>
            <HomeProperties/>
            <InfoBoxes/>
        </>
    );
}
