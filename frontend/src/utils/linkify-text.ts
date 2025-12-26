import linkifyit, { Match } from 'linkify-it';

const linkify = new linkifyit();

export const linkifyText = (text: string) => {
    if (!text || !linkify.pretest(text)) {
        return text;
    }

    const matches = linkify.match(text);
    if (!matches) {
        return text;
    }

    let lastIndex = 0;
    const result: string[] = [];

    matches.forEach((match: Match) => {
        if (match.index > lastIndex) {
            // Escape HTML in regular text
            result.push(escapeHtml(text.slice(lastIndex, match.index)));
        }

        // Add styled link
        result.push(
            `<a href="${match.url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline hover:text-blue-600 break-all">${escapeHtml(match.text)}</a>`
        );

        lastIndex = match.lastIndex;
    });

    if (lastIndex < text.length) {
        result.push(escapeHtml(text.slice(lastIndex)));
    }

    return result.join('');
};

// Helper function to escape HTML to prevent XSS
const escapeHtml = (text: string): string => {
    const map: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
};
