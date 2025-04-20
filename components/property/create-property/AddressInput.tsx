'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AddressInputProps {
    onAddressSelect: (latitude: number, longitude: number, address: string) => void;
    address: string;
}

interface AddressSuggestion {
    label: string;
    lat: number;
    lon: number;
}

const AddressInput: React.FC<AddressInputProps> = ({ onAddressSelect, address }) => {
    const [inputValue, setInputValue] = useState(address);
    const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const ymapsRef = useRef<any>(null);
    const [ymapsLoaded, setYmapsLoaded] = useState(false);

    useEffect(() => {
        setInputValue(address);
    }, [address]);

    // Load Yandex Maps API
    useEffect(() => {
        const loadYmapsScript = () => {
            if (window.ymaps) {
                ymapsRef.current = window.ymaps;
                setYmapsLoaded(true);
                return;
            }

            const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY;
            const script = document.createElement('script');
            script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
            script.async = true;
            script.defer = true;

            script.onload = () => {
                window.ymaps.ready(() => {
                    ymapsRef.current = window.ymaps;
                    setYmapsLoaded(true);
                });
            };

            document.body.appendChild(script);
        };

        loadYmapsScript();

        return () => {
            // Clean up if needed
        };
    }, []);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Debounce function
    const debounce = (func: Function, delay: number) => {
        let timer: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    const fetchSuggestions = async (query: string) => {
        if (!ymapsLoaded || !ymapsRef.current || query.length < 3) {
            setSuggestions([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);

            // Using Yandex Maps geocoder for address suggestions
            const geocoder = ymapsRef.current.geocode(query, { results: 5 });
            const results = await geocoder;

            if (results.geoObjects.getLength() === 0) {
                setSuggestions([]);
                setIsOpen(false);
                setIsLoading(false);
                return;
            }

            const newSuggestions: AddressSuggestion[] = [];

            results.geoObjects.each((item: any) => {
                const coords = item.geometry.getCoordinates();
                newSuggestions.push({
                    label: item.getAddressLine(),
                    lat: coords[0], // Yandex returns [lat, lon]
                    lon: coords[1]
                });
            });

            setSuggestions(newSuggestions);
            setIsOpen(newSuggestions.length > 0);
        } catch (error) {
            console.error('Error fetching address suggestions:', error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Create debounced version of fetch function
    const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        setIsOpen(true);

        if (value.length >= 3 && ymapsLoaded) {
            setIsLoading(true);
            debouncedFetchSuggestions(value);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion: AddressSuggestion) => {
        setInputValue(suggestion.label);
        setSuggestions([]);
        setIsOpen(false);
        onAddressSelect(suggestion.lat, suggestion.lon, suggestion.label);
    };

    const getCityFromAddress = (address: string): string => {
        const parts = address.split(', ');
        // Find the part that's likely to be a city
        return parts.find(part =>
            !part.includes('область') &&
            !part.includes('район') &&
            !part.includes('улица') &&
            !part.includes('дом') &&
            !part.includes('Россия') &&
            part.trim().length > 0
        ) || '';
    };

    return (
        <div className="relative" ref={suggestionsRef}>
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => inputValue.length >= 3 && setIsOpen(true)}
                    placeholder="Введите адрес (город, улица, дом)"
                    className="pl-10 transition-all focus:ring-2 focus:ring-primary/20"
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                )}
            </div>

            {isOpen && (
                <Card className="absolute z-10 mt-1 w-full max-h-60 overflow-auto shadow-lg">
                    {suggestions.length > 0 ? (
                        <ul className="divide-y">
                            {suggestions.map((suggestion, index) => {
                                const city = getCityFromAddress(suggestion.label);
                                return (
                                    <li
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className={cn(
                                            "p-3 cursor-pointer hover:bg-muted transition-colors",
                                            index === 0 && "rounded-t-md",
                                            index === suggestions.length - 1 && "rounded-b-md"
                                        )}
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium truncate">{suggestion.label}</span>
                                            {city && (
                                                <div className="flex items-center mt-1">
                                                    <Badge variant="outline" className="text-xs">{city}</Badge>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : inputValue.length >= 3 && !isLoading ? (
                        <div className="p-3 text-sm text-muted-foreground">
                            Адрес не найден. Попробуйте уточнить запрос.
                        </div>
                    ) : null}
                </Card>
            )}
        </div>
    );
};

interface WindowWithYmaps extends Window {
    ymaps?: any;
}

declare const window: WindowWithYmaps;

export default AddressInput;