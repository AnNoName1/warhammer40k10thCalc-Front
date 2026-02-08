// js/router.js

const calculatorTemplate = `
<div class="calculator-wrapper">
    <section class="logic-section">
        <form id="calc-form" class="params-grid">
            <div class="param-group">
                <h4>Attacker Profile</h4>
                <div class="input-row">
                    <div class="field">
                        <label for="numModels">Num Models</label>
                        <input type="number" id="numModels" name="numModels" value="5" min="1">
                    </div>
                    <div class="field">
                        <label for="attacks">Attacks</label>
                        <input type="text" id="attacks" name="attacks" value="2" placeholder="e.g. 2D6+2" required>
                        <span class="field-hint">Format: 2D6+1</span>
                    </div>
                    <div class="field">
                        <label for="skill">WS/BS</label>
                        <input type="number" id="skill" name="skill" value="3" min="2" max="6" required>
                    </div>
                    <div class="field">
                        <label for="strength">S</label>
                        <input type="number" id="strength" name="strength" value="4" required>
                    </div>
                    <div class="field">
                        <label for="ap">AP</label>
                        <input type="number" id="ap" name="ap" value="1" required>
                        <span class="field-hint">Base: 0+</span>
                    </div>
                    <div class="field">
                        <label for="damage">D</label>
                        <input type="text" id="damage" name="damage" value="1" placeholder="e.g. D3+3" required>
                        <span class="field-hint">Format: D3+1</span>
                    </div>
                </div>
                
                <div class="checkbox-row">
                    <label class="checkbox-label"><input type="checkbox" name="blast"> Blast</label>
                    <label class="checkbox-label"><input type="checkbox" name="lethalHits"> Lethal</label>
                    <label class="checkbox-label"><input type="checkbox" name="devastatingWounds"> Devastating</label>
                    <label class="checkbox-label"><input type="checkbox" name="torrent"> Torrent</label>
                </div>

                <div class="input-row" style="margin-top: 10px;">
                    <div class="field">
                        <label for="sustainedHits">Sustained (X)</label>
                        <input type="number" id="sustainedHits" name="sustainedHits" value="0" placeholder="0+">
                    </div>
                    <div class="field">
                        <label for="hitMod">Hit Mod</label>
                        <input type="number" id="hitMod" name="hitMod" value="0" min="-1" max="1" placeholder="±1">
                    </div>
                    <div class="field">
                        <label for="woundMod">Wound Mod</label>
                        <input type="number" id="woundMod" name="woundMod" value="0" min="-1" max="1" placeholder="±1">
                    </div>
                </div>
            </div>

            <div class="param-group">
                <h4>Defender Profile</h4>
                <div class="input-row">
                    <div class="field">
                        <label for="toughness">T</label>
                        <input type="number" id="toughness" name="toughness" value="4" placeholder="1+" required>
                    </div>
                    <div class="field">
                        <label for="save">Sv</label>
                        <input type="number" id="save" name="save" value="3" min="2" max="7" placeholder="2-7" required>
                    </div>
                    <div class="field">
                        <label for="invulnerable">Inv Sv</label>
                        <input type="number" id="invulnerable" name="invulnerable" min="2" max="6" placeholder="None">
                    </div>
                    <div class="field">
                        <label for="woundsPerModel">W / Model</label>
                        <input type="number" id="woundsPerModel" name="woundsPerModel" value="2" placeholder="1+" required>
                    </div>
                    <div class="field">
                        <label for="fnp">FNP</label>
                        <input type="number" id="fnp" name="fnp" min="2" max="6" placeholder="None">
                    </div>
                    <div class="field">
                        <label for="modelCount">Model Count</label>
                        <input type="number" id="modelCount" name="modelCount" value="5" placeholder="Inf.">
                    </div>
                </div>
                <div class="checkbox-row">
                     <label class="checkbox-label"><input type="checkbox" name="cover"> Cover</label>
                </div>
            </div>

            <div class="param-group" style="grid-column: span 2;">
                <h4>Rules & Critical Thresholds</h4>
                <div class="input-row">
                    <div class="field">
                        <label for="hitReroll">Hit Reroll</label>
                        <select id="hitReroll" name="hitReroll" class="custom-select">
                            <option value="0" selected>None</option>
                            <option value="1">Reroll 1s</option>
                            <option value="2">Full Reroll</option>
                        </select>
                    </div>
                    <div class="field">
                        <label for="woundReroll">Wound Reroll</label>
                        <select id="woundReroll" name="woundReroll" class="custom-select">
                            <option value="0" selected>None</option>
                            <option value="1">Reroll 1s</option>
                            <option value="2">Full Reroll</option>
                        </select>
                    </div>
                    <div class="field">
                        <label for="saveReroll">Save Reroll</label>
                        <select id="saveReroll" name="saveReroll" class="custom-select">
                            <option value="0" selected>None</option>
                            <option value="1">Reroll 1s</option>
                            <option value="2">Full Reroll</option>
                        </select>
                    </div>
                    <div class="field">
                        <label for="saveMod">Save Mod</label>
                        <input type="number" id="saveMod" name="saveMod" value="0" placeholder="±X">
                    </div>
                    <div class="field">
                        <label for="critHit">Crit Hit On</label>
                        <input type="number" id="critHit" name="critHit" value="6" min="2" max="6" placeholder="2-6">
                    </div>
                    <div class="field">
                        <label for="critWound">Anti-X (Crit W)</label>
                        <input type="number" id="critWound" name="critWound" value="6" min="2" max="6" placeholder="2-6">
                    </div>
                </div>
            </div>

            <button type="submit" id="calculate-btn">RUN SIMULATION</button>
        </form>

        <div id="results-display" class="results-container">
            <p class="placeholder-text">Enter parameters and calculate to see results...</p>
        </div>
        
        <div id="charts-container" class="charts-grid"></div>

    </section>
</div>
`;

const instructionsTemplate = `
<div class="page-container">
    <h1>Manual Cogitator</h1>
    
    <section class="visual-guide">
        <h3>Interface Blueprint</h3>
        <img src="assets/ui-diagram.png" alt="UI Diagram" class="diagram-asset">
        <p class="caption">Tactical Interface Overview</p>
    </section>

    <div class="instruction-steps">
        <div class="step"><strong>1. Select Units:</strong> Use the Roster (Top) to select your attacking and defending units.</div>
        <div class="step"><strong>2. Choose Weaponry:</strong> Select the specific damage profile you wish to simulate.</div>
        <div class="step"><strong>3. Verify Stats:</strong> Parameters are automatically inserted, but can be manually adjusted in the Logic section.</div>
        <div class="step"><strong>4. Calculate:</strong> Press the calculation button to generate probability graphs.</div>
    </div>
</div>
`;

const aboutTemplate = `
<div class="page-container">
    <h1>Project Core</h1>
    <p>A strategic tool for Warhammer 40,000 10th Edition tabletop simulation.</p>
    <div class="credits">
        <p><strong>Logic Engine:</strong> Based on <a href="https://github.com/AnNoName1/warhammer40k10thCalc">AnNoName1's Server Logic</a>.</p>
        <p><strong>Data Source:</strong> Statistics via <a href="https://wahapedia.ru">Wahapedia.ru</a>.</p>
    </div>
</div>
`;

const routes = {
    "/": { title: "Calculator", render: () => calculatorTemplate },
    "/instructions": { title: "Instructions", render: () => instructionsTemplate },
    "/about": { title: "About", render: () => aboutTemplate }
};

export const router = () => {
    // Handling local file paths vs server paths
    const path = window.location.pathname;
    const route = routes[path] || { 
        title: "404 - Lost in the Warp", 
        render: () => `<h1 class="error">404</h1><p>The coordinates you entered do not exist in Imperial Records.</p>` 
    };

    document.title = `${route.title} | 10th Calc`;
    document.getElementById("content").innerHTML = route.render();
};

// Function to handle link clicks without page reload
export const navigateTo = (url) => {
    window.history.pushState(null, null, url);
    router();
};