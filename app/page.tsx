import Hero from '@/components/home/Hero';
import HomeFeaturedProperties from '@/components/home/HomeFeaturedProperties';
import HomeInfoBoxes from "@/components/home/HomeInfoBoxes";
import HomeProperties from "@/components/home/HomeProperties";
import {getProperties} from "@/utils/getProperties";

export default async function Home() {
    const data = await getProperties();
    return (
        <>
            <Hero />
            <HomeInfoBoxes/>
            <HomeFeaturedProperties properties={data}/>
            <HomeProperties/>
        </>
    );
}
