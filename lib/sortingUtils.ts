function sortRanking(items) {
    // Validate input
    if (!Array.isArray(items)) {
        throw new Error('Invalid input: expected an array of ranking items.');
    }

    return items.sort((a, b) => {
        // Null checking and sorting logic
        const aPoints = a.points ?? 0;
        const bPoints = b.points ?? 0;

        // Sort by points first
        if (aPoints !== bPoints) {
            return bPoints - aPoints; // descending
        }

        // If points are equal, sort by adversaries
        const aAdversaries = a.adversaries ?? 0;
        const bAdversaries = b.adversaries ?? 0;
        if (aAdversaries !== bAdversaries) {
            return bAdversaries - aAdversaries; // descending
        }

        // If adversaries are equal, sort by participations
        const aParticipations = a.participations ?? 0;
        const bParticipations = b.participations ?? 0;
        if (aParticipations !== bParticipations) {
            return bParticipations - aParticipations; // descending
        }

        // If participations are equal, sort by victories
        const aVictories = a.victories ?? 0;
        const bVictories = b.victories ?? 0;
        if (aVictories !== bVictories) {
            return bVictories - aVictories; // descending
        }

        // If victories are equal, sort by poles
        const aPoles = a.poles ?? 0;
        const bPoles = b.poles ?? 0;
        if (aPoles !== bPoles) {
            return bPoles - aPoles; // descending
        }

        // If poles are equal, sort by MV
        const aMV = a.MV ?? 0;
        const bMV = b.MV ?? 0;
        if (aMV !== bMV) {
            return bMV - aMV; // descending
        }

        // If MV are equal, sort by podiums
        const aPodiums = a.podiums ?? 0;
        const bPodiums = b.podiums ?? 0;
        if (aPodiums !== bPodiums) {
            return bPodiums - aPodiums; // descending
        }

        // If podiums are equal, sort by position
        const aPosition = a.position ?? Infinity;
        const bPosition = b.position ?? Infinity;
        return aPosition - bPosition; // ascending
    });
}

module.exports = sortRanking;