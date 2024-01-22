export const config = {
    layers: {
        boat: {
            defaultScale: 1,
            defaultFlip: false,
            defaultLength: 120,
            man: {
                hasStick: true,
                hatNumber: 2,
            },
            boat: {
                fillColor: "rgba(255, 255, 255, 1)",
            },
            stroke: {
                width: 1,
                fillColor: "rgba(100,100,100,0.4)",
                color: "rgba(100,100,100,0.4)",
                strokeNoise: 0.5,
                strokeWidth: 1,
            },
        },
        backgroundMountain: {
            defaultSeed: 0,
            defaultHeight: 300,
            defaultWidth: 2000,
            segments: 5,
            span: 10,
            strokeWidth: 1,
            color: "none",
        },
        bottomMountain: {
            defaultSeed: 0,
            defaultHeight: {
                min: 40,
                max: 440,
            },
            defaultFlatness: 0.5,
            defaultWidth: {
                min: 400,
                max: 600,
            },
            background: {
                fillColor: "rgba(255, 255, 255, 1)",
                color: "none",
            },
            outline: {
                fillColor: "rgba(100, 100, 100, 0.3)",
                color: "rgba(100, 100, 100, 0.3)",
                strokeWidth: 3,
                strokeNoise: 1,
            },
            texture: {
                size: 80,
                shadow: 0,
            },
            polyline: {
                fillColor: "rgba(255, 255, 255, 1)",
                color: "none",
                strokeWidth: 2,
            },
            stroke: {
                fillColor: "rgba(100, 100, 100, 0.2)",
                color: "rgba(100, 100, 100, 0.2)",
                strokeWidth: 3,
            },
        },
        middleMountain: {
            defaultSeed: 0,
            defaultHeight: {
                min: 100,
                max: 500,
            },
            defaultWidth: {
                min: 400,
                max: 600,
            },
            defaultMiddleVegetation: true,
            texture: {
                size: 200,
            },
            rim: {
                colorNoAlfa: "rgba(100, 100, 100,",
                clusters: 2,
            },
            background: {
                fillColor: "rgba(255, 255, 255, 1)",
                strokeColor: "none",
            },
            outline: {
                fillColor: "rgba(100, 100, 100, 0.3)",
                color: "rgba(100, 100, 100, 0.3)",
                strokeWidth: 3,
                strokeNoise: 1,
            },
            top: {
                colorNoAlfa: "rgba(100, 100, 100,",
            },
            middle: {
                colorNoAlfa: "rgba(100, 100, 100,",
            },
            bottom: {
                colorNoAlfa: "rgba(100, 100, 100,",
            },
        },
        water: {
            defaultHeight: 2, // Height of the waves.
            defaultWidth: 800, // Width of the waves
            defaultWaveClusters: 10, // Number of clusters of waves.
            colorNoAlfa: "rgba(100, 100, 100,", // color without the alpha. Need to add alfa value and closing bracket
        },
    },
    cachedLayer: {
        flatMountainHeight: 100,
        flatMountainWidth: {
            min: 600,
            max: 1000,
        },
        flatMountainFlatness: {
            min: 0.5,
            max: 0.7,
        },
        distantMountainHeight: 150,
    },
    utils: {
        bezierCurvePoints: 20,
    },
    designer: {
        xStep: 5, // Step size along the x-axis for generating terrain.
        noiseSample: 0.03, // Sample value for the noise function.
        boatY: {
            min: 300,
            max: 690,
        },
        boat: {
            probability: 0.2, // Probability of generating a boat chunk.
            y: {
                min: 300,
                max: 690,
            },
            radiusThreshold: 400,
        },
        middleMountain: {
            coverThreshold: 0.3, // Threshold value for determining mountain coverage in the design.
            radius: 2, // Radius of the circular area used to check for local maxima.
        },
        bottomMountain: {
            probability: 0.01, // Probability of generating a flat mountain chunk.
        },
        backgroundMountain: {
            interval: 1000, // Interval at which distant mountains are generated.
        },
    },
    perlin: {
        yWrapb: 4, // Number of bits to wrap along the y-axis.
        zWrapb: 8, // Number of bits to wrap along the z-axis.
        size: 4095, // Size of the perlin array.
        octaves: 4, // Number of octaves used in the Perlin noise generation.
        ampFalloff: 0.5, // Amplitude falloff factor for each octave in the Perlin noise.
    },
    prng: {
        defaultSeed: 1234,
        primeOne: 999979,
        primeTwo: 999983,
    },
    structure: {
        house: {
            decorator: {
                horizontalSubPoints: [5, 5, 4],
                verticalSubPoints: [2, 2, 3],
            },
            height: 10,
            perspective: 5,
            defaultStrokeWidth: 50,
            defaultStories: 3,
            defaultRotatation: 0.3,
            defaultStyle: 1,
            defaultHasRail: false,
        },
        pagoda: {
            defaultStrokeWidth: 50,
            defaultStories: 7,
            height: 10,
            rotation: 0.7,
            period: 5,
            decorator: {
                style: 1,
                horizontalSubPoints: 4,
                verticalSubPoints: 2,
            },
        },
    },
    element: {
        defaultFillColor: "rgba(0,0,0,0)",
        defaultStrokeColor: "rgba(0,0,0,0)",
        defaultStrokeWidth: 0,
        blob: {
            defaultFillColor: "rgba(200,200,200,0.9)",
            defaultLength: 20,
            defaultStrokeWidth: 0.5,
            defaultNoise: 0.5,
        },
        branch: {
            defaultHeight: 360,
            defaultStrokeWidth: 6,
            defaultAngle: 0,
            defaultBendingAngle: 0.2 * Math.PI,
            defaultDetails: 10,
        },
        stroke: {
            defaultFillColor: "rgba(200,200,200,0.9)",
            defaultStrokeColor: "rgba(200,200,200,0.9)",
            defaultWidth: 2,
            defaultNoise: 0.5,
            defaultStrokeWidth: 1,
        },
    },
    ui: {
        resolution: 512,
        canvasWidth: 512,
        zoom: 1.142,
    },
};
