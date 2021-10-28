// const Chart = require('chart.js');
let ctx = document.getElementById("myChart");
import { KMeans } from './kmeans.js';

let myChart = new Chart(ctx, {
    type: 'bubble',
    data: {
        datasets: [{
            data: [],
            backgroundColor: [],
            radius: 5
        }]
    },
    options: {
        scales: {
            y: {
                suggestedMax: 30
            },
            x: {
                suggestedMax: 30
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    },
});

let grouped_distances = {};
let n_dots = 0;
let n_centroids = 0;

let btnStart = document.getElementById("start");
let btnDelete = document.getElementById("delete");

let dotInput = document.getElementById("dotInput");

let btnSetUp = document.getElementById("btnSetUp");
let dotsInput = document.getElementById("n_dots");
let centroidsInput = document.getElementById("n_centroids");

let colorsCentroids = {};

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

centroidsInput.addEventListener('keyup', (e) => {
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
        data_range_x: 50,
        data_range_y: 50,
    })

    kmeans.clustering();

    grouped_distances = kmeans.grouped_distances;
    
    
    console.log(kmeans.centroids_history);
    console.log(grouped_distances);

    draw(grouped_distances);
    
    disabledBtnDelete(false);
    disabledInputDot(false);
}

function draw(grouped_distances) {
    for (const dot in grouped_distances) {
        let set = grouped_distances[dot];
        let colorSet = Math.floor(Math.random()*16777215).toString(16);

        addNewColor(colorSet, dot);

        for (let i=0; i<set.length; i++) {
            let array = set[i].split(',');
            let data = {
                x: Number(array[0]),
                y: Number(array[1])
            }
            setTimeout(() => {
                addData(myChart, data, `#${colorSet}`);
            }, 1);
            
        }
        disabledBtnStart(true);
    }
}

function clean() {
    for (const dot in grouped_distances) {
        let set = grouped_distances[dot];
        for (let i=0; i<set.length; i++) {
            setTimeout(() => {
                cleanData(myChart);    
            }, 1);
        }
    }
}

function addData(chart, data, color) {
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
        dataset.backgroundColor.push(color);
    });
    chart.update();
}

function cleanData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
        dataset.backgroundColor.pop();
    });
    chart.update();
}

function setUpConfig() {
    n_dots = Number(dotsInput.value);
    n_centroids = Number(centroidsInput.value);

    disabledBtnStart(false);
}

function generateDots(n_dots) {
    let dots = []
    for (let i = 0; i < n_dots; i++) {
        let x = Math.random() * (50);
        let y = Math.random() * (50);
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

    console.log(grouped_distances);

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
            color = "#" + colorsCentroids[centroid];
        }
    }

    let data = {
        x: x,
        y: y,
    }

    addData(myChart, data, color);
}

function addNewColor(color, centroid) {

    colorsCentroids[centroid] = color;
}