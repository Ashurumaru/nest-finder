'use client';

export default function FavoritesSection({ userId }: { userId: string }) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Мое избранное</h2>
            <p>Здесь будет список недвижимости, добавленной в избранное.</p>
        </div>
    );
}
