import React, { useState, useEffect } from 'react';

interface AddressInputProps {
    onAddressSelect: (latitude: number, longitude: number, address: string) => void;
    address: string; // Receive the current address value from props
}

const AddressInput: React.FC<AddressInputProps> = ({ onAddressSelect, address }) => {
    const [inputValue, setInputValue] = useState(address); // Use a separate state for the input
    const [suggestions, setSuggestions] = useState<{ label: string; lat: number; lon: number }[]>([]);

    useEffect(() => {
        setInputValue(address); // Update local state when address prop changes
    }, [address]);

    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value); // Update local input state

        if (value.length > 2) {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&countrycodes=RU&q=${value}`
            );
            const results = await response.json();
            setSuggestions(
                results.map((result: any) => ({
                    label: result.display_name,
                    lat: parseFloat(result.lat),
                    lon: parseFloat(result.lon),
                }))
            );
        } else {
            setSuggestions([]); // Clear suggestions if input is less than 3 characters
        }
    };

    const handleSuggestionClick = (suggestion: { label: string; lat: number; lon: number }) => {
        setInputValue(suggestion.label); // Set the selected address in the input
        setSuggestions([]); // Clear suggestions
        onAddressSelect(suggestion.lat, suggestion.lon, suggestion.label); // Trigger the callback
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={inputValue} // Use the local input state
                onChange={handleInputChange}
                placeholder="Введите адрес"
                className="w-full border p-2 rounded"
            />
            {suggestions.length > 0 && (
                <ul className="absolute w-full bg-white border rounded shadow">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                        >
                            {suggestion.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AddressInput;
