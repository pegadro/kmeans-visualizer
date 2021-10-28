
export class KMeans {
    constructor({
        dots,
        n_centroids,
        data_range_x,
        data_range_y,
    }) {
        this.dots = dots;
        this.n_centroids = n_centroids;
        this.data_range_x = data_range_x;
        this.data_range_y = data_range_y;
        this._centroids_history = [];

        this.previous_centroids = [];
        this.current_centroids = [];

        this.grouped_distances = {};

        this.centroids = this.create_centroids();
        //this.centroids = [[15.34, 0.71],[0.15, 7.95],[24.47, 12.68]]
    }

    clustering() {
        if (JSON.stringify(this.current_centroids) == JSON.stringify(this.previous_centroids)) {
            this.grouped_distances = this.get_grouped_distances(this.current_centroids, this.dots);
        } else if (JSON.stringify(this.current_centroids) != JSON.stringify(this.previous_centroids)) {
            let grouped_distances = this.get_grouped_distances(
                this.current_centroids, this.dots);

            this.previous_centroids = this.current_centroids;
            
            this._centroids_history.push(this.previous_centroids);
            this.current_centroids = this.calc_new_centroids(grouped_distances);

            this.clustering();
        }
    }

    get_grouped_distances(centroids, dots) {
        let distances = {};
        let grouped_distances = {};

        for (var i=0; i<dots.length; i++) {
            let dot = dots[i];
            distances[dot] = [];

            for(var j=0; j<centroids.length; j++) {
                let centroid = centroids[j];
                let distance = this.get_distance(dot, centroid);
                distances[dot].push(distance);
            }
        }

        for (var c=0; c<centroids.length; c++) {
            let centroid = centroids[c];
            grouped_distances[centroid] = [];
        }

        for (const key in distances) {
            let nearest_distance = Math.min(...distances[key]);
            let nearest_centroid = centroids[distances[key].indexOf(nearest_distance)];
            grouped_distances[nearest_centroid].push(key);
        }


        return grouped_distances
    }

    calc_new_centroids(grouped_distances) {
        let new_centroids = [];
        for (const centroid in grouped_distances) {
            let list_dots = grouped_distances[centroid];
            
            let sum_dots_x = 0;
            let sum_dots_y = 0;

            for (var i=0; i<list_dots.length; i++) {
                let list_array_dots = list_dots[i].split(',');
                sum_dots_x += Number(list_array_dots[0]);
                sum_dots_y += Number(list_array_dots[1]);
            }

            let average_dot_x = sum_dots_x / list_dots.length;
            let average_dot_y = sum_dots_y / list_dots.length;

            let new_centroid = [average_dot_x, average_dot_y];
            new_centroids.push(new_centroid);
        }
        this._centroids_history.push(new_centroids);
        return new_centroids;
    }

    get_distance(dot, centroid) {
        return Math.sqrt((dot[0] - centroid[0])**2 + (dot[1] - centroid[1])**2);
    }

    create_centroids() {
        let centroids = [];
        for(var i=0; i < this.n_centroids; i++){
            let x = Math.random() * (this.data_range_x);
            let y = Math.random() * (this.data_range_y);
            let centroid = [Number(x.toFixed(2)), Number(y.toFixed(2))];
            centroids.push(centroid);
        }
        this.current_centroids = centroids;
        return centroids;
    }
    
    get centroids_history() {
        return this._centroids_history;
    }
}

// let dots = [[30,24], [18,0], [0,8], [12,17], [14,8], [27,16], [4,16], [21,15], [10,12], [3,0], [10,22], [6,3], [27,17], [6,24], [14,5], [17,17], [3,19], [30,3], [20,17], [24,22], [13,20], [23,24], [24,10], [14,21], [1,30], [29,30], [6,15], [2,20], [17,12], [6,4], [13,14], [6,1], [21,5], [5,26], [24,5], [4,21], [30,7], [18,21], [6,10], [16,20], [7,29], [3,0], [5,8], [21,1], [16,22], [7,19], [6,21], [10,12], [18,20], [29,10], [16,6], [7,6], [3,11], [4,13], [2,24], [2,6], [28,27], [8,28], [2,8], [30,26], [0,25], [17,14], [20,23], [1,4], [16,21], [6,19], [30,14], [26,15], [25,17], [0,27], [6,11], [5,1], [14,10], [9,27], [6,12], [24,23], [25,5], [27,11], [27,22], [18,2], [12,5], [22,12], [13,3], [17,24], [19,28], [17,4], [1,10], [13,12], [3,27], [3,0], [21,28], [5,15], [21,13], [21,27], [26,4], [4,12], [19,12], [19,15], [13,6], [20,11]];

// const kmeans = new KMeans({
//     dots,
//     n_centroids: 3,
//     data_range_x: 30,
//     data_range_y: 30,
// });

// console.log(kmeans);

// kmeans.clustering();

// console.log(kmeans);

//[(30, 24), (18, 0), (0, 8), (12, 17), (14, 8), (27, 16), (4, 16), (21, 15), (10, 12), (3, 0), (10, 22), (6, 3), (27, 17), (6, 24), (14, 5), (17, 17), (3, 19), (30, 3), (20, 17), (24, 22), (13, 20), (23, 24), (24, 10), (14, 21), (1, 30), (29, 30), (6, 15), (2, 20), (17, 12), (6, 4), (13, 14), (6, 1), (21, 5), (5, 26), (24, 5), (4, 21), (30, 7), (18, 21), (6, 10), (16, 20), (7, 29), (3, 0), (5, 8), (21, 1), (16, 22), (7, 19), (6, 21), (10, 12), (18, 20), (29, 10), (16, 6), (7, 6), (3, 11), (4, 13), (2, 24), (2, 6), (28, 27), (8, 28), (2, 8), (30, 26), (0, 25), (17, 14), (20, 23), (1, 4), (16, 21), (6, 19), (30, 14), (26, 15), (25, 17), (0, 27), (6, 11), (5, 1), (14, 10), (9, 27), (6, 12), (24, 23), (25, 5), (27, 11), (27, 22), (18, 2), (12, 5), (22, 12), (13, 3), (17, 24), (19, 28), (17, 4), (1, 10), (13, 12), (3, 27), (3, 0), (21, 28), (5, 15), (21, 13), (21, 27), (26, 4), (4, 12), (19, 12), (19, 15), (13, 6), (20, 11)]

// for k, v in grouped_distances.items():
//         color = ["#" + ''.join([random.choice('0123456789ABCDEF')
//                                for j in range(6)])]
//         plt.scatter(k[0], k[1], color=color, marker='s')
//         for dot in v:
//             plt.scatter(dot[0], dot[1], color=color)