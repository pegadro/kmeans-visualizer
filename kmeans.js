
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