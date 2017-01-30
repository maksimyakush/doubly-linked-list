class Node {
    constructor(data = null, prev = null, next = null) {
        this.data = data;
        this.prev = prev;
        this.next = next;
        //добавилось свойство index
        this.index = 0;
    }
}

module.exports = Node;
