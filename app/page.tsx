import Hero from '@/components/Hero';
import HomeFeaturedProperties from '@/components/HomeFeaturedProperties';
import HomeInfoBoxes from "@/components/HomeInfoBoxes";
import HomeProperties from "@/components/HomeProperties";
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
