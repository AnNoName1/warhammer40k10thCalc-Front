// js/api.js

const parsePtrInt = (val) => {
    const n = parseInt(val);
    return isNaN(n) ? null : n;
};

const parseIntSafe = (val, def = 0) => {
    const n = parseInt(val);
    return isNaN(n) ? def : n;
};

const rerollMap = {
    0: "none",
    1: "ones",
    2: "fail"
};


export async function calculateResults(formData) {
    const payload = {
        attacker: {
            num_models: parseIntSafe(formData.numModels, 1),
            attacks_string: formData.attacks,
            bs: parseIntSafe(formData.skill),
            s: parseIntSafe(formData.strength),
            ap: parseIntSafe(formData.ap),
            d: formData.damage,
            // Keywords
            blast: formData.blast === 'on',
            sustained_hits: parseIntSafe(formData.sustainedHits, 0),
            lethal_hits: formData.lethalHits === 'on',
            devastating_wounds: formData.devastatingWounds === 'on',
            torrent: formData.torrent === 'on',
            // Modifiers
            hit_modifier: parseIntSafe(formData.hitMod, 0),
            wound_modifier: parseIntSafe(formData.woundMod, 0)
        },
        target: {
            t: parseIntSafe(formData.toughness),
            save: parseIntSafe(formData.save),
            wounds_per_model: parseIntSafe(formData.woundsPerModel),
            model_count: parsePtrInt(formData.modelCount), // Sending null triggers "Infinite Target" logic
            cover: formData.cover === 'on',
            invulnerable: parsePtrInt(formData.invulnerable),
            feel_no_pain: parsePtrInt(formData.fnp)
        },
        rules: {
            hit_reroll: rerollMap[parseIntSafe(formData.hitReroll, 0)],
            wound_reroll: rerollMap[parseIntSafe(formData.woundReroll, 0)],
            save_reroll: rerollMap[parseIntSafe(formData.saveReroll, 0)],
            save_modifier: parseIntSafe(formData.saveMod, 0),
            critical_hit_threshold: parseIntSafe(formData.critHit, 6),
            critical_wound_threshold: parseIntSafe(formData.critWound, 6)
        }
    };

    try {
        const response = await fetch('http://localhost:8080/api/damage/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Cortex computational failure.');
        return await response.json();
    } catch (error) {
        console.error("Transmission Error:", error);
        return null;
    }
}

export async function checkServerStatus() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout for health checks

    try {
        const response = await fetch('http://localhost:8080/alive', {
            method: 'GET',
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response.ok;
    } catch (error) {
        return false;
    }
}