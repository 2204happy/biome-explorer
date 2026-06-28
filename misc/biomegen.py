def getRanges(raw,cutoffs):
    if raw == None:
        return None
    for i in range(len(cutoffs)-1):
        if raw >= cutoffs[i] and raw <= cutoffs[i+1]:
            return i

class Parameters:
    def __init__(self,T,H,C,E,W,D):
        self.temperature = getRanges(T,temperatureRanges)
        self.humidity = getRanges(H,humidityRanges)
        self.continentalness = getRanges(C,continentalRanges)
        self.erosion = getRanges(E,erosionRanges)
        self.weirdness = W
        self.depth = D

        self.pv = None
        if W != None:
            self.pv = getRanges(1-abs(3*abs(W)-2),pvRanges)

        self.rawTemperature = T
        self.rawHumidity = H
        self.rawContinentalness = C
        self.rawErosion = E

    def printVals(self):
        print(
                f"Temperature: {self.temperature}\n"
                f"Humidity: {self.humidity}\n"
                f"Continentalness: {self.continentalness}\n"
                f"Erosion: {self.erosion}\n"
                f"Weirdness: {self.weirdness}\n"
                f"PV: {self.pv}\n"
                f"Depth: {self.depth}"
        )

    def getRawParamsByString(self,param):
        match param:
            case "TEMPERATURE":
                return self.rawTemperature
            case "HUMIDITY":
                return self.rawHumidity
            case "CONTINENTALNESS":
                return self.rawContinentalness
            case "EROSION":
                return self.rawErosion
            case "WEIRDNESS":
                return self.weirdness
            case "DEPTH":
                return self.depth

temperatureRanges = [-1.0,-0.45,-0.15,0.2,0.55,1.0]

humidityRanges = [-1.0,-0.35,-0.1,0.1,0.3,1.0]

continentalRanges = [-1.2,-1.05,-0.455,-0.19,-0.11,0.03,0.3,1.0]

erosionRanges = [-1.0,-0.78,-0.375,-0.2225,0.05,0.45,0.55,1.0]

pvRanges = [-1.0,-0.85,-0.2,0.2,0.7,1.0]

caveRules = [
        ["SURFACE",Parameters(None,None,None,None,None,0),Parameters(None,None,None,None,None,0)],
        ["Dripstone Caves",Parameters(None,None,0.8,None,None,0.2),Parameters(None,None,1.0,None,None,0.9)],
        ["Lush Caves",Parameters(None,0.7,None,None,None,0.2),Parameters(None,1.0,None,None,None,0.9)],
        ["Sulfur Caves",Parameters(None,None,-0.19,0.45,-1.1,0.2),Parameters(None,None,0.55,1,-0.85,0.9)],
        ["SURFACE",Parameters(None,None,None,None,None,1),Parameters(None,None,None,None,None,1)],
        ["Deep Dark",Parameters(None,None,None,-1.0,None,1.1),Parameters(None,None,None,-0.375,None,1.1)]
]

oceans = [
    ["Deep Frozen Ocean","Deep Cold Ocean","Deep Ocean","Deep Lukewarm Ocean","Warm Ocean"],
    ["Frozen Ocean","Cold Ocean","Ocean","Lukewarm Ocean","Ocean"]
]


middleBiomeMatrix = [
    ["Snowy Plains",    "Plains",                   "Flower Forest",            "Savanna",          "Desert"],
    ["Snowy Plains",    "Plains",                   "Plains",                   "Savanna",          "Desert"],
    ["Snowy Plains",    "Forest",                   "Forest",                   "Forest",           "Desert"],
    ["Snowy Taiga",     "Taiga",                    "Birch Forest",             "Jungle",           "Desert"],
    ["Taiga",           "Old Growth Spruce Taiga",  "Dark Forest",              "Jungle",           "Desert"]
]

middleBiomeWeirdMatrix = [
    ["Ice Spikes",      "Dappled Forest",           "Sunflower Plains",         None,               None],
    [None,              None,                       None,                       None,               None],
    ["Snowy Taiga",     None,                       None,                       "Plains",           None],
    [None,              None,                       "Old Growth Birch Forest",  "Sparse Jungle",    None],
    [None,              "Old Growth Pine Taiga",    None,                       "Bamboo Jungle",    None]
]

plateauBiomeMatrix = [
    ["Snowy Plains",    "Meadow",                   "Meadow",                   "Savanna Plateau",  "Badlands"],
    ["Snowy Plains",    "Meadow",                   "Meadow",                   "Savanna Plateau",  "Badlands"],
    ["Snowy Plains",    "Forest",                   "Meadow",                   "Forest",           "Badlands"],
    ["Snowy Taiga",     "Taiga",                    "Meadow",                   "Forest",           "Wooded Badlands"],
    ["Snowy Taiga",     "Old Growth Spruce Taiga",  "Pale Garden",              "Jungle",           "Wooded Badlands"]
]

plateauBiomeWeirdMatrix = [
    ["Ice Spikes",      "Cherry Grove",             "Cherry Grove",             None,               "Eroded Badlands"],
    [None,              None,                       "Cherry Grove",             None,               "Eroded Badlands"],
    [None,              "Meadow",                   "Forest",                   None,               None],
    [None,              "Meadow",                   "Birch Forest",             None,               None],
    [None,              "Old Growth Pine Taiga",    None,                       None,               None]
]

shatteredBiomeMatrix = [
    ["Windswept Gravelly Hills",    "Windswept Gravelly Hills", "Windswept Hills",  "Savanna",      "Desert"],
    ["Windswept Gravelly Hills",    "Windswept Gravelly Hills", "Windswept Hills",  "Savanna",      "Desert"],
    ["Windswept Hills",             "Windswept Hills",          "Windswept Hills",  "Forest",       "Desert"],
    ["Windswept Forest",            "Windswept Forest",         "Windswept Forest", "Jungle",       "Desert"],
    ["Windswept Forest",            "Windswept Forest",         "Windswept Forest", "Jungle",       "Desert"]
]

shatteredBiomeWeirdMatrix = [
    [None,                          None,                       None,               None,           None],
    [None,                          None,                       None,               None,           None],
    [None,                          None,                       None,               "Plains",       None],
    [None,                          None,                       None,               "Sparse Jungle",None],
    [None,                          None,                       None,               "Bamboo Jungle",None]
]

def temperatureHumidityMatrix(standard,weird,params):
    if params.weirdness > 0:
        variant = weird[params.humidity][params.temperature]
        if variant != None:
            return variant
    return standard[params.humidity][params.temperature]

def middle(params):
    return temperatureHumidityMatrix(middleBiomeMatrix,middleBiomeWeirdMatrix,params)

def plateau(params):
    return temperatureHumidityMatrix(plateauBiomeMatrix,plateauBiomeWeirdMatrix,params)

def shattered(params):
    return temperatureHumidityMatrix(shatteredBiomeMatrix,shatteredBiomeWeirdMatrix,params)



def rivers(params):
    return "River" if params.temperature > 0 else "Frozen River"

def middleBadlands(params):
    return badlands(params) if params.temperature == 4 else middle(params)

def middleBadlandsW(params):
    params.weirdness = 1
    return middleBadlands(params)

def stony(params):
    return "Stony Shore"

def beaches(params):
    if params.temperature == 0:
        return "Snowy Beach"
    elif params.temperature == 4:
        return "Desert"
    else:
        return "Beach"

def badlands(params):
    params.temperature = 4
    return plateau(params)

def slopes(params):
    return "Snowy Slopes" if params.humidity <= 1 else "Grove"

def slopesMB(params):
    return slopes(params) if params.temperature == 0 else middleBadlands(params)

def slopesPlateau(params):
    return slopes(params) if params.temperature <= 2 else plateau(params)

def slopesPlateauCold(params):
    return slopes(params) if params.temperature == 0 else plateau(params)

def peaks(params):
    if params.temperature <= 2:
        return "Jagged Peaks" if params.weirdness <= 0 else "Frozen Peaks"
    elif params.temperature == 3:
        return "Stony Peaks"
    else:
        return badlands(params)

def swamp(params):
    return "Swamp" if params.temperature <= 2 else "Mangrove Swamp"

def riverSwamp(params):
    return "Frozen River" if params.temperature == 0 else swamp(params)

def middleSwamp(params):
    return middle(params) if params.temperature == 0 else swamp(params)



def beachMiddle(params):
    return beaches(params) if params.weirdness <= 0 else middle(params)



biomeMatrix = [
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
]

def getContinentalBiome(params):
    if params.erosion == 5 and params.pv > 0 and params.continentalness <= 4 and params.weirdness > 0 and params.temperature >= 2 and params.humidity <= 3:
        return "Windswept Savanna"
    else:
        return biomeMatrix[params.erosion][params.pv][params.continentalness-3](params)



def getSurfaceBiome(params):
    if params.continentalness == 0:
        return "Mushroom Fields"
    elif params.continentalness < 3:
        return oceans[params.continentalness-1][params.temperature]
    else:
        return getContinentalBiome(params)


def getDistanceFromCaveRule(params,rule):
    distance = 0
    paramNames = ["TEMPERATURE","HUMIDITY","CONTINENTALNESS","EROSION","WEIRDNESS","DEPTH"]
    for param in paramNames:
        point = params.getRawParamsByString(param)
        lower = rule[1].getRawParamsByString(param)
        upper = rule[2].getRawParamsByString(param)
        if lower != None and upper != None:
            if point < lower:
                distance += (lower-point)**2
            elif point > upper:
                distance += (point-upper)**2
    return distance

def getCaveBiome(params):
    bestDistance = float("inf")
    bestRule = None
    for caveRule in caveRules:
        distance = getDistanceFromCaveRule(params,caveRule)
        if distance < bestDistance:
            bestDistance = distance
            bestRule = caveRule[0]
    return bestRule

def getBiome(params):
    caveBiome = getCaveBiome(params)
    if caveBiome != "SURFACE":
        return caveBiome
    else:
        return getSurfaceBiome(params)

temperature = float(input("Temperature:"))
humidity = float(input("Humidity:"))
continentalness = float(input("Continentalness:"))
erosion = float(input("Erosion:"))
weirdness = float(input("Weirdness:"))
depth = float(input("Depth:"))

params = Parameters(temperature,humidity,continentalness,erosion,weirdness,depth)

params.printVals()

print(getBiome(params))
