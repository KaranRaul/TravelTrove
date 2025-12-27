import linkifyit from 'linkify-it';

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
    const result = [];
    matches.forEach(match => {
        if (match.index > lastIndex) {
            result.push(text.slice(lastIndex, match.index));
        }
        result.push(`<a href="${match.url}" target="_blank" rel="noopener noreferrer">${match.text}</a>`);
        lastIndex = match.lastIndex;
    });

    if (lastIndex < text.length) {
        result.push(text.slice(lastIndex));
    }

    return result.join('');
};

