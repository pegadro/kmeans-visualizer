// const Chart = require('chart.js');
let ctx = document.getElementById("myChart");
import { KMeans } from './kmeans.js';


let grouped_distances = {};
let n_dots = 0;
let n_centroids = 0;
let range_x = 0;
let range_y = 0;

let myChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
            data: [],
            backgroundColor: [],
            radius: [],
            pointStyle: [],
            borderColor: []
        }]
    },
    options: {
        scales: {
            y: {
                suggestedMax: range_y
            },
            x: {
                suggestedMax: range_x
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    },
});

let btnStart = document.getElementById("start");
let btnDelete = document.getElementById("delete");

let dotInput = document.getElementById("dotInput");

let dotsInput = document.getElementById("n_dots");
let centroidsInput = document.getElementById("n_centroids");
let rangexInput = document.getElementById("range_x");
let rangeyInput = document.getElementById("range_y");
let btnSetUp = document.getElementById("btnSetUp");

let pN_dots = document.getElementById("pN_dots");
let pN_centroids = document.getElementById("pN_centroids");
let pRange_x = document.getElementById("pRange_x");
let pRange_y = document.getElementById("pRange_y");

let colorsCentroids = {};
let colorProvicionalCentroids = [];

btnStart.addEventListener('click', () => {
    btnDelete.disabled = true;
    start();
});

btnDelete.addEventListener('click', () => {
    clean();
    disabledBtnDelete(true);
    disabledInputDot(true);
    disabledBtnStart(true);
});

dotInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
        let dotStr = dotInput.value;
        let dot = dotStr.split(',');

        addNewDot(Number(dot[0]), Number(dot[1]));

        dotInput.value = "";
    }
});

btnSetUp.addEventListener('click', () => {
    if (dotsInput.value.length > 0 && centroidsInput.value.length > 0) {
        setUpConfig();
    }
});

rangeyInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
        if (dotsInput.value.length > 0 && centroidsInput.value.length > 0) {
            setUpConfig();
        }
    }
});

function start() {
    let dots = generateDots(n_dots);
    let kmeans = new KMeans({
        dots,
        n_centroids: n_centroids,
        data_range_x: range_x,
        data_range_y: range_y,
    })
    kmeans.clustering();

    grouped_distances = kmeans.grouped_distances;

    draw_centroids(kmeans.centroids_history);
    draw(grouped_distances);
    
    disabledBtnDelete(false);
    disabledInputDot(false);
}

function draw(grouped_distances) {
    for (const dot in grouped_distances) {
        let set = grouped_distances[dot];
        let colorSet = "";

        let centroid = dot.split(',');
        let centroidArray = [Number(centroid[0]), Number(centroid[1])];

        for (let i=0; i < colorProvicionalCentroids.length; i++) {
            let centroids_history = colorProvicionalCentroids[i][0];
            for (let j=0; j < centroids_history.length; j++) {
                if (JSON.stringify(centroids_history[j]) == JSON.stringify(centroidArray)) {
                    colorSet = colorProvicionalCentroids[i][1];
                }
            }
        } 

        addNewColor(colorSet, dot);

        for (let i=0; i<set.length; i++) {
            let array = set[i].split(',');
            let data = {
                x: Number(array[0]),
                y: Number(array[1])
            }

            setTimeout(() => {
                addData(myChart, data, `${colorSet}`, "circle", 4);    
            }, 1);
        }
        disabledBtnStart(true);
    }
}

function draw_centroids(centroids_history) {
    let arrayOfHistory = [];

    for (let i=0; i < centroids_history[0].length; i++) {
        arrayOfHistory.push([]);
    }

    for (let i=0; i < centroids_history.length; i++) {
        for (let j=0; j < centroids_history[i].length; j++) {
            let index = centroids_history[i].indexOf(centroids_history[i][j]);
            arrayOfHistory[index].push(centroids_history[i][j]);
        }
    }

    for (let i=0; i < arrayOfHistory.length; i++) {
        let arrayOfCentroids = arrayOfHistory[i];
        let colorCentroid = `#${Math.floor(Math.random()*16777215).toString(16)}`;
        let arrayConfig = [arrayOfCentroids, colorCentroid];
        colorProvicionalCentroids.push(arrayConfig);
    }


    for (let i=0; i < centroids_history.length; i++) {
        for (let j=0; j < centroids_history[i].length; j++) {
            let centroid = centroids_history[i][j];
            let color = "";

            for (let c=0; c < colorProvicionalCentroids.length; c++) {
                if (colorProvicionalCentroids[c][0].indexOf(centroids_history[i][j]) != -1) {
                    color = colorProvicionalCentroids[c][1];
                }
            }   

            let data = {
                x: centroid[0],
                y: centroid[1]
            }

            if ( centroids_history.indexOf(centroids_history[i]) == centroids_history.length - 1) {
                addData(myChart, data, color, "rect", 7);
            }
            
            addData(myChart, data, color, "crossRot", 4);
        }
    }
}

function clean() {
    colorsCentroids = {};
    colorProvicionalCentroids = [];
    cleanData(myChart);
    updateInformationP(0, 0, 0, 0);
}

function addData(chart, data, color, style, radius) {
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
        dataset.backgroundColor.push(color);
        dataset.pointStyle.push(style);
        dataset.radius.push(radius);
        dataset.borderColor.push(color);
    });
    chart.update();
}

function cleanData(chart) {
    chart.data.datasets.forEach((dataset) => {
        dataset.data = [];
        dataset.backgroundColor = [];
        dataset.pointStyle = [];
        dataset.radius = [];
        dataset.borderColor = [];
    });
    myChart.update()
}

function setUpConfig() {
    n_dots = Number(dotsInput.value);
    n_centroids = Number(centroidsInput.value);

    range_x = Number(rangexInput.value);
    range_y = Number(rangeyInput.value);

    updateInformationP(n_dots, n_centroids, range_x, range_y);

    dotsInput.value = "";
    centroidsInput.value = "";
    rangexInput.value = "";
    rangeyInput.value = "";

    disabledBtnStart(false);
}

function generateDots(n_dots) {
    let dots = []
    for (let i = 0; i < n_dots; i++) {
        let x = Math.random() * (range_x);
        let y = Math.random() * (range_y);
        let dot = [Number(x.toFixed(2)), Number(y.toFixed(2))];
        dots.push(dot);
    }
    return dots
}

function disabledBtnDelete(disabled) {
    if (disabled == false) {
        btnDelete.disabled = false;
        btnDelete.className = "btn delete";
    } else {
        btnDelete.disabled = true;
        btnDelete.className = "btn delete disabled";
    }
    
}

function disabledInputDot(disabled) {
    if (disabled == false) {
        dotInput.disabled = false;
    } else {
        dotInput.disabled = true;
    }
}

function disabledBtnStart(disabled) {
    if (disabled == false) {
        btnStart.disabled = false;
        btnStart.className = "btn start";
    } else {
        btnStart.disabled = true;
        btnStart.className = "btn start disabled";
    }
}

function addNewDot(x, y) {
    let centroids = [];
    let distances = [];

    for (const dot in grouped_distances) {
        let dotArray = dot.split(',');
        let centroid = [Number(dotArray[0]), Number(dotArray[1])]
        centroids.push(centroid);
    }
    
    for(let i=0; i<centroids.length; i++) {
        let centroid = centroids[i];
        let distance = Math.sqrt((x - centroid[0])**2 + (y - centroid[1])**2);
        distances.push(distance);
    }

    let nearest_distance = Math.min(...distances);
    let nearest_centroid = centroids[distances.indexOf(nearest_distance)]
    let color = "";

    let centroidIdentificator = `${String(nearest_centroid[0])},${String(nearest_centroid[1])}`;
    grouped_distances[centroidIdentificator].push(`${x},${y}`);

    for (const centroid in colorsCentroids) {
        let centroidArray = centroid.split(',');
        if (nearest_centroid[0] == Number(centroidArray[0]) && nearest_centroid[1] == Number(centroidArray[1])) {
            color = colorsCentroids[centroid];
        }
    }

    let data = {
        x: x,
        y: y,
    }

    addData(myChart, data, color, "circle", 4);

    n_dots += 1;
    updateInformationP(n_dots, n_centroids, range_x, range_y);
}

function addNewColor(color, centroid) {

    colorsCentroids[centroid] = color;
}

function updateInformationP(n_dots, n_centroids, range_x, range_y) {
    pN_dots.innerText = `Number of dots: ${n_dots}`;
    pN_centroids.innerText = `Number of centroids: ${n_centroids}`;
    pRange_x.innerText = `Range of data in x: ${range_x}`;
    pRange_y.innerText = `Range of data in y: ${range_y}`;
}