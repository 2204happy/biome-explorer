function getRanges(raw,cutoffs) {
    if (raw == null) {
        return null
    }
    for (let i = 0; i < cutoffs.length - 1; i++) {
        if (raw >= cutoffs[i] && raw <= cutoffs[i+1]) {
            return i
        }
    }
}

class Parameters {
    constructor(T,H,C,Er,W,D) {
        this.temperature = getRanges(T,temperatureRanges);
        this.humidity = getRanges(H,humidityRanges);
        this.continentalness = getRanges(C,continentalRanges);
        this.erosion = getRanges(Er,erosionRanges);
        this.weirdness = W;
        this.depth = D;

        this.rawPV = null;
        this.pv = null;
        if (W != null) {
            this.rawPV = 1-Math.abs(3*Math.abs(W)-2);
            this.pv = getRanges(this.rawPV,pvRanges);
        }

        this.rawTemperature = T;
        this.rawHumidity = H;
        this.rawContinentalness = C;
        this.rawErosion = Er;
    }

    printVals() {
        console.log(
            `Temperature: ${this.temperature}\n`+
            `Humidity: ${this.humidity}\n`+
            `Continentalness: ${this.continentalness}\n`+
            `Erosion: ${this.erosion}\n`+
            `Weirdness: ${this.weirdness}\n`+
            `PV: ${this.pv}\n`+
            `Depth: ${this.depth}`
        );
    }

    getRawParamsByString(param) {
        switch (param) {
            case "TEMPERATURE":
                return this.rawTemperature;
            case "HUMIDITY":
                return this.rawHumidity;
            case "CONTINENTALNESS":
                return this.rawContinentalness;
            case "EROSION":
                return this.rawErosion;
            case "WEIRDNESS":
                return this.weirdness;
            case "DEPTH":
                return this.depth;
        }
    }
}

const temperatureRanges = [-1.0,-0.45,-0.15,0.2,0.55,1.0];

const humidityRanges = [-1.0,-0.35,-0.1,0.1,0.3,1.0];

const continentalRanges = [-1.2,-1.05,-0.455,-0.19,-0.11,0.03,0.3,1.0];

const erosionRanges = [-1.0,-0.78,-0.375,-0.2225,0.05,0.45,0.55,1.0];

const pvRanges = [-1.0,-0.85,-0.2,0.2,0.7,1.0];

const caveRules = [
    ["SURFACE",new Parameters(null,null,null,null,null,0),new Parameters(null,null,null,null,null,0)],
    ["Dripstone Caves",new Parameters(null,null,0.8,null,null,0.2),new Parameters(null,null,1.0,null,null,0.9)],
    ["Lush Caves",new Parameters(null,0.7,null,null,null,0.2),new Parameters(null,1.0,null,null,null,0.9)],
    ["Sulfur Caves",new Parameters(null,null,-0.19,0.45,-1.1,0.2),new Parameters(null,null,0.55,1,-0.85,0.9)],
    ["SURFACE",new Parameters(null,null,null,null,null,1),new Parameters(null,null,null,null,null,1)],
    ["Deep Dark",new Parameters(null,null,null,-1.0,null,1.1),new Parameters(null,null,null,-0.375,null,1.1)]
];

const oceans =  [
    ["Deep Frozen Ocean","Deep Cold Ocean","Deep Ocean","Deep Lukewarm Ocean","Warm Ocean"],
    ["Frozen Ocean","Cold Ocean","Ocean","Lukewarm Ocean","Warm Ocean"]
];

const middleBiomeMatrix = [
    ["Snowy Plains",    "Plains",                   "Flower Forest",            "Savanna",          "Desert"],
    ["Snowy Plains",    "Plains",                   "Plains",                   "Savanna",          "Desert"],
    ["Snowy Plains",    "Forest",                   "Forest",                   "Forest",           "Desert"],
    ["Snowy Taiga",     "Taiga",                    "Birch Forest",             "Jungle",           "Desert"],
    ["Taiga",           "Old Growth Spruce Taiga",  "Dark Forest",              "Jungle",           "Desert"]
];

const middleBiomeWeirdMatrix = [
    ["Ice Spikes",      "Dappled Forest",           "Sunflower Plains",         null,               null],
    [null,              null,                       null,                       null,               null],
    ["Snowy Taiga",     null,                       null,                       "Plains",           null],
    [null,              null,                       "Old Growth Birch Forest",  "Sparse Jungle",    null],
    [null,              "Old Growth Pine Taiga",    null,                       "Bamboo Jungle",    null]
];

const plateauBiomeMatrix = [
    ["Snowy Plains",    "Meadow",                   "Meadow",                   "Savanna Plateau",  "Badlands"],
    ["Snowy Plains",    "Meadow",                   "Meadow",                   "Savanna Plateau",  "Badlands"],
    ["Snowy Plains",    "Forest",                   "Meadow",                   "Forest",           "Badlands"],
    ["Snowy Taiga",     "Taiga",                    "Meadow",                   "Forest",           "Wooded Badlands"],
    ["Snowy Taiga",     "Old Growth Spruce Taiga",  "Pale Garden",              "Jungle",           "Wooded Badlands"]
];

const plateauBiomeWeirdMatrix = [
    ["Ice Spikes",      "Cherry Grove",             "Cherry Grove",             null,               "Eroded Badlands"],
    [null,              null,                       "Cherry Grove",             null,               "Eroded Badlands"],
    [null,              "Meadow",                   "Forest",                   null,               null],
    [null,              "Meadow",                   "Birch Forest",             null,               null],
    [null,              "Old Growth Pine Taiga",    null,                       null,               null]
];

const shatteredBiomeMatrix = [
    ["Windswept Gravelly Hills",    "Windswept Gravelly Hills", "Windswept Hills",  "Savanna",      "Desert"],
    ["Windswept Gravelly Hills",    "Windswept Gravelly Hills", "Windswept Hills",  "Savanna",      "Desert"],
    ["Windswept Hills",             "Windswept Hills",          "Windswept Hills",  "Forest",       "Desert"],
    ["Windswept Forest",            "Windswept Forest",         "Windswept Forest", "Jungle",       "Desert"],
    ["Windswept Forest",            "Windswept Forest",         "Windswept Forest", "Jungle",       "Desert"]
];

const shatteredBiomeWeirdMatrix = [
    [null,                          null,                       null,               null,           null],
    [null,                          null,                       null,               null,           null],
    [null,                          null,                       null,               "Plains",       null],
    [null,                          null,                       null,               "Sparse Jungle",null],
    [null,                          null,                       null,               "Bamboo Jungle",null]
];

function temperatureHumidityMatrix(standard,weird,params) {
    if (params.weirdness > 0) {
        let variant = weird[params.humidity][params.temperature];
        if (variant != null) {
            return variant;
        }
    }
    return standard[params.humidity][params.temperature];
}

function middle(params) {
    return temperatureHumidityMatrix(middleBiomeMatrix,middleBiomeWeirdMatrix,params);
}

function plateau(params) {
    return temperatureHumidityMatrix(plateauBiomeMatrix,plateauBiomeWeirdMatrix,params);
}

function shattered(params) {
    return temperatureHumidityMatrix(shatteredBiomeMatrix,shatteredBiomeWeirdMatrix,params);
}

function rivers(params) {
    return params.temperature > 0 ? "River" : "Frozen River";
}

function middleBadlands(params) {
    return params.temperature == 4 ? badlands(params) : middle(params);
}

function middleBadlandsW(params) {
    params.weirdness = 1;
    return middleBadlands(params);
}

function stony(params) {
    return "Stony Shore";
}

function beaches(params) {
    if (params.temperature == 0) {
        return "Snowy Beach";
    }
    else if (params.temperature == 4) {
        return "Desert";
    }
    else {
        return "Beach";
    }
}

function badlands(params) {
    params.temperature = 4;
    return plateau(params);
}

function slopes(params) {
    return params.humidity <= 1 ? "Snowy Slopes" : "Grove";
}

function slopesMB(params) {
    return params.temperature == 0 ? slopes(params) : middleBadlands(params);
}

function slopesPlateau(params) {
    return params.temperature <= 2 ? slopes(params) : plateau(params);
}

function slopesPlateauCold(params) {
    return params.temperature == 0 ? slopes(params) : plateau(params);
}

function peaks(params) {
    if (params.temperature <= 2) {
        return params.weirdness <= 0 ? "Jagged Peaks" : "Frozen Peaks";
    }
    else if (params.temperature == 3) {
        return "Stony Peaks";
    }
    else {
        return badlands(params);
    }
}

function swamp(params) {
    return params.temperature <= 2 ? "Swamp" : "Mangrove Swamp";
}

function riverSwamp(params) {
    return params.temperature == 0 ? "Frozen River" : swamp(params);
}

function middleSwamp(params) {
    return params.temperature == 0 ? middle(params) : swamp(params);
}

function beachMiddle(params) {
    return params.weirdness <= 0 ? beaches(params) : middle(params);
}



const biomeMatrix = [
    [
        [rivers,        rivers,         middleBadlandsW,middleBadlandsW],
        [stony,         middleBadlands, slopesMB,       slopesMB],
        [stony,         slopesPlateau,  slopesPlateau,  slopesPlateau],
        [middle,        slopesPlateau,  peaks,          peaks],
        [peaks,         peaks,          peaks,          peaks]
    ],
    [
        [rivers,        rivers,         middleBadlandsW,middleBadlandsW],
        [stony,         middleBadlands, slopesMB,       slopesMB],
        [stony,         slopesMB,       slopesMB,       slopesPlateauCold],
        [middle,        slopesMB,       slopesPlateau,  slopesPlateau],
        [slopesMB,      slopesMB,       peaks,          peaks]
    ],
    [
        [rivers,        rivers,         rivers,         rivers],
        [stony,         middle,         middleBadlands, middleBadlands],
        [stony,         middle,         middleBadlands, plateau],
        [middle,        middle,         plateau,        plateau],
        [middle,        middle,         plateau,        plateau]
    ],
    [
        [rivers,        rivers,         rivers,         rivers],
        [beaches,       middle,         middleBadlands, middleBadlands],
        [middle,        middle,         middleBadlands, middleBadlands],
        [middle,        middle,         middleBadlands, plateau],
        [middle,        middle,         middleBadlands, plateau]
    ],
    [
        [rivers,        rivers,         rivers,         rivers],
        [beaches,       middle,         middle,         middle],
        [beachMiddle,   middle,         middle,         middle],
        [middle,        middle,         middle,         middle],
        [middle,        middle,         middle,         middle]
    ],
    [
        [rivers,        rivers,         rivers,         rivers],
        [beachMiddle,   middle,         middle,         middle],
        [beachMiddle,   middle,         shattered,      shattered],
        [middle,        middle,         shattered,      shattered],
        [shattered,     shattered,      shattered,      shattered]
    ],
    [
        [rivers,        riverSwamp,     riverSwamp,     riverSwamp],
        [beaches,       middleSwamp,    middleSwamp,    middleSwamp],
        [beachMiddle,   middleSwamp,    middleSwamp,    middleSwamp],
        [middle,        middle,         middle,         middle],
        [middle,        middle,         middle,         middle]
    ]
];

function getContinentalBiome(params) {
    if (params.erosion == 5 && params.pv > 0 && params.continentalness <= 4 && params.weirdness > 0 && params.temperature >= 2 && params.humidity <= 3) {
        return "Windswept Savanna";
    }
    else {
        return biomeMatrix[params.erosion][params.pv][params.continentalness-3](params);
    }
}

function getSurfaceBiome(params) {
    if (params.continentalness == 0) {
        return "Mushroom Fields";
    }
    else if (params.continentalness < 3) {
        return oceans[params.continentalness-1][params.temperature];
    }
    else {
        return getContinentalBiome(params);
    }
}

function getDistanceFromCaveRule(params,rule) {
    let distance = 0;
    const paramNames = ["TEMPERATURE","HUMIDITY","CONTINENTALNESS","EROSION","WEIRDNESS","DEPTH"];
    for (let i = 0; i < paramNames.length; i++) {
        let param = paramNames[i];
        let point = params.getRawParamsByString(param);
        let lower = rule[1].getRawParamsByString(param);
        let upper = rule[2].getRawParamsByString(param);
        if (lower != null && upper != null) {
            if (point < lower) {
                distance += (lower-point)**2;
            }
            else if (point > upper) {
                distance += (point-upper)**2;
            }
        }
    }
    return distance;
}

function getCaveBiome(params) {
    let bestDistance = Infinity;
    let bestRule = null;
    for (let i = 0; i < caveRules.length; i++) {
        let caveRule = caveRules[i];
        let distance = getDistanceFromCaveRule(params,caveRule);
        if (distance < bestDistance) {
            bestDistance = distance;
            bestRule = caveRule[0];
        }
    }
    return bestRule;
}

function getBiome(params) {
    let caveBiome = getCaveBiome(params);
    if (caveBiome != "SURFACE") {
        return caveBiome;
    }
    else {
        return getSurfaceBiome(params);
    }
}


function getBiomeImageURL(biome) {
    return `imgs/${biome.toLowerCase().replaceAll(" ","_")}.png`;
}

continentalnessNames = ["Mushroom Fields","Deep Ocean","Ocean","Coast","Near-Inland","Mid-Inland","Far-Inland"];
pvNames = ["Valleys","Low","Mid","High","Peaks"];

function updateBiomeDisplay() {
    temperature = document.getElementById("temperature").valueAsNumber,
    humidity = document.getElementById("humidity").valueAsNumber,
    continentalness = document.getElementById("continentalness").valueAsNumber,
    erosion = document.getElementById("erosion").valueAsNumber,
    weirdness = document.getElementById("weirdness").valueAsNumber,
    depth = document.getElementById("depth").valueAsNumber

    let params = new Parameters(temperature,humidity,continentalness,erosion,weirdness,depth);

    document.getElementById("temperatureDisplay").innerHTML = `Temperature: ${params.rawTemperature.toFixed(2)}`;
    document.getElementById("humidityDisplay").innerHTML = `Humidity: ${params.rawHumidity.toFixed(2)}`;
    document.getElementById("continentalnessDisplay").innerHTML = `Continentalness: ${params.rawContinentalness.toFixed(2)}`;
    document.getElementById("erosionDisplay").innerHTML = `Erosion: ${params.rawErosion.toFixed(2)}`;
    document.getElementById("weirdnessDisplay").innerHTML = `Weirdness: ${params.weirdness.toFixed(2)}`;
    document.getElementById("depthDisplay").innerHTML = `Depth: ${params.depth.toFixed(2)}`;

    document.getElementById("params").innerHTML =
        `Parameters:<br>`+
        `Temperature: ${params.temperature}<br>`+
        `Humidity: ${params.humidity}<br>`+
        `Continentalness: ${continentalnessNames[params.continentalness]} (${params.continentalness})<br>`+
        `Erosion: ${params.erosion}<br>`+
        `Weirdness: ${params.weirdness >= 0 ? "Positive" : "Negative"}<br>`+
        `Peaks and Valleys (PV): ${pvNames[params.pv]} (${params.pv})<br>`+
        `PV (raw): ${params.rawPV.toFixed(2)}`;

    const biome = getBiome(params);
    document.getElementById("biomeName").innerHTML = `<b>${biome}</b>`;

    document.getElementById("biomeImage").src = getBiomeImageURL(biome);
}

function init() {
    document.getElementById("temperature").value = 0;
    document.getElementById("humidity").value = 0;
    document.getElementById("continentalness").value = 0;
    document.getElementById("erosion").value = 0;
    document.getElementById("weirdness").value = 0;
    document.getElementById("depth").value = 0;
    updateBiomeDisplay();
}



