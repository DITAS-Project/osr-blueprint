/* jshint node: true, esversion: 6 */
'use strict';

const Category = require('./category');

class CategoryList {

    constructor(patientId) {
        this.patientId = patientId;
        this.trie = new Trie();
    }

    include(category) {
        this.trie.add(category.labels);
    }

    childrenOf(category) {
        return this.trie.childrenOf(category.labels)
            .map(labels => new Category(labels));
    }

    items() {
        return this.trie.flatList()
            .map(labels => new Category(labels));
    }

    isEmpty() {
        return this.items().length == 0;
    }
}

class Node {
    constructor(value, children = []) {
        this.value = value;
        this.children = children;
    }
}

class Trie {
    constructor(value = 'ROOT') {
        this.root = new Node(value);
    }

    add(values) {
        let walker = this.root;

        for (let value of values) {
            let index = walker.children
                .map(node => node.value)
                .indexOf(value);

            if (index == -1) {
                let child = new Node(value);
                walker.children.push(child);
                walker = child;
            } else {
                walker = walker.children[index];
            }
        }
    }

    childrenOf(values) {
        let walker = this.root;

        for (let value of values) {
            let index = walker.children
                .map(node => node.value)
                .indexOf(value);

            if (index == -1) {
                return [];
            } else {
                walker = walker.children[index];
            }
        }

        return walker.children
            .map(node => [...values, node.value]);
    }


    flatList() {
        let flatList = [];
        let queue = new Queue();

        for (let child of this.root.children) {
            queue.enqueue([], child);
        }

        while (!queue.isEmpty()) {
            let [values, node] = queue.dequeue();
            values.push(node.value);

            flatList.push(values);

            for (let child of node.children) {
                queue.enqueue(values.slice(), child);
            }
        }

        return flatList;
    }
}

class Queue {
    constructor() {
        this.array = [];
    }

    enqueue(...values) {
        this.array.push(values);
    }

    dequeue() {
        return this.array.shift();
    }

    isEmpty() {
        return this.array.length == 0;
    }
}

module.exports = CategoryList;
