// utils/formatDate.ts
export function formatDate(dateString: string | Date | null | undefined): string {
    if (!dateString) {
        return "Дата неизвестна";
    }

    const date = new Date(dateString);

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    // Format for recent dates
    if (diffDays < 1) {
        if (diffMinutes < 1) {
            return "Только что";
        } else if (diffHours < 1) {
            return `${diffMinutes} ${getRussianWordForm(diffMinutes, ["минуту", "минуты", "минут"])} назад`;
        } else {
            return `${diffHours} ${getRussianWordForm(diffHours, ["час", "часа", "часов"])} назад`;
        }
    } else if (diffDays < 7) {
        return `${diffDays} ${getRussianWordForm(diffDays, ["день", "дня", "дней"])} назад`;
    } else {
        // For older dates, use full format
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }
}

// Helper function for Russian word forms
function getRussianWordForm(number: number, forms: [string, string, string]): string {
    const remainder100 = number % 100;
    const remainder10 = number % 10;

    if (remainder100 >= 11 && remainder100 <= 19) {
        return forms[2];
    }

    if (remainder10 === 1) {
        return forms[0];
    }

    if (remainder10 >= 2 && remainder10 <= 4) {
        return forms[1];
    }

    return forms[2];
}