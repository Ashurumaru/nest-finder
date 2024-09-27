import prisma from "@/prisma/prisma";

export async function getProperties() {
    const properties = await prisma.post.findMany({
        include: {
            postDetail: true,
        },
    });

    return properties.map((property) => ({
        id: property.id,
        title: property.title,
        price: property.price,
        imageUrls: property.imageUrls,
        address: property.address,
        city: property.city,
        numBedrooms: property.numBedrooms,
        numBathrooms: property.numBathrooms,
        postDetail: {
            propertySize: property.postDetail?.propertySize ?? undefined,
        },
        type: property.type,
        property: property.property,
    }));
}
