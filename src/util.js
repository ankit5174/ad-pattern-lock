export function getLengthAngle(x1, x2, y1, y2) {
    const xDiff = x2 - x1;
    const yDiff = y2 - y1;

    return {
        length: Math.ceil(Math.sqrt(xDiff * xDiff + yDiff * yDiff)),
        angle: Math.round((Math.atan2(yDiff, xDiff) * 180) / Math.PI),
    };
}

export function getPointID(xi, yi, radius, margin, matrix, patternDotRadius) {
    const cellLength = radius * 2 + margin * 2;
    const qsntX = Math.floor(xi / cellLength);
    const qsntY = Math.floor(yi / cellLength);

    let i, j;
    if (xi >= (qsntX * cellLength + margin) && xi <= (qsntX * cellLength + margin + radius * 2)) {
        j = qsntX
    }
    if (yi >= (qsntY * cellLength + margin) && yi <= (qsntY * cellLength + margin + radius * 2)) {
        i = qsntY
    }

    let id = i * matrix[1] + j;
    let x = j * cellLength + margin + radius - patternDotRadius;
    let y = i * cellLength + margin + radius - patternDotRadius;

    return {
        id,
        x,
        y
    }
}

export function getPattern(path, delimeter) {
    let pattern = "";
    path.forEach((point, index) => {
        pattern = pattern + (point.id + 1);
        if (index < path.length - 1) {
            pattern = pattern + delimeter;
        }
    });
    return pattern;
}
