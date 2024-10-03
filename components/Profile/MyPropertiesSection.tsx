'use client';

export default function MyPropertiesSection({ userId }: { userId: string }) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Моя недвижимость</h2>
            <p>Здесь будет список недвижимости, выложенной вами.</p>
        </div>
    );
}
