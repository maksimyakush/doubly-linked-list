const Node = require('./node');

class LinkedList {
    constructor() {
        this._head = null;
        this._tail = null;
        this.length = 0;
    }

    append(data) {
        //в this._head и this._tail присваивается ссылка на первую ноду
        if (!this._head) {
            this._head = new Node(data);
            this._tail = new Node(data, this._head);
            this._head.next = this._tail;
            this.length = 1;
        //в this._tail присваивается ссылка на сл. ноду
        } else if (this.length == 1) {
            this.length += 1;
            this._tail = new Node (data, this._head);
            this._tail.index = this.length-1;
            this._head.next = this._tail;
        //в this._tail писваивается ссылка на сл. ноду, устанавливаются связи с предыдущей нодой
        } else if (this.length >= 2) {
            let tail = this._tail;
            this._tail = new Node(data);
            tail.next = this._tail;
            this._tail.prev = tail;
            this.length += 1;
            this._tail.index = this.length-1;
        }
        return this;
    }

    head() {
        return this._head.data;
    }

    tail() {
        return this._tail.data;
    }

    at(index) {
        if (index == 0) {
            return this._head.data;
        }
        //функция рекурсивно сравнивает index со свойством индекс каждой последующей ноды
        let getData = (node) => {
            if (index == node.index) {
                return node.data;
            } else {
                return getData(node.next);
            }
        };
        return  getData(this._head.next);
    }

    insertAt(index, data) {
        if (index == 0) {
            return this._head.data;
        }
        if (index > 0) {
            //функция ищет ноду, на место которой нужно вставить новую ноду
            let getCurrentNode = (node) => {
                if (index == node.index){
                    return node;
                } else {
                    return getCurrentNode(node.next);
                }
            };
            //функция ищет ноду, предыдущую ранее искомой ноде
            let getPreviousNode = (node) => {
                if (index == node.index) {
                    return node.prev;
                } else {
                    return getPreviousNode(node.next);
                }
            };
            //создается нода, устанавливаются связи между нодами
            let nextNode = getCurrentNode(this._head.next);
            let previousNode = getPreviousNode(this._head.next);
            let newCurrentNode = new Node(data);
            nextNode.prev = newCurrentNode;
            previousNode.next = newCurrentNode;
            newCurrentNode.next = nextNode;
            newCurrentNode.prev = previousNode;
            newCurrentNode.index = nextNode.index;
            this.length += 1;
            //функция увеличивает значения свойств index на 1 в каждой ноде после newCurrentNode
            let changeIndexes = (node) => {
                if (node.next == null) return;
                node.next.index = node.next.index + 1;

                return changeIndexes(node.next);
            };
            changeIndexes(newCurrentNode);
            return this;
        }
    }

    isEmpty() {
        return this.length == 0;
    }

    clear() {
        if(this._head) {
            this._head.data = null;
            this._tail.data = null;
            this.length=0;
        }
        return this;
    }

    deleteAt(index) {
        if (index == 0) {
            return this.clear();
        }
        //функция ищет ноду, предыдущую удаляемой
        let getPreviousNode = (node) => {
            if (index == node.index) {
                return node.prev;
            } else {
                return getPreviousNode(node.next);
            }
        };
        //функция ищет ноду, следующую после удаляемой
        let getNextNode = (node) => {
            if (index == node.index) {
                return node.next;
            } else {
                return getNextNode(node.next);
            }
        };
        //устанавливаются связи между previousNode и nextNode
        let previousNode = getPreviousNode(this._head.next);
        let nextNode = getNextNode(this._head.next);
        previousNode.next = nextNode;
        nextNode.prev = previousNode;
        //функция уменьшает значения свойства index в каждой ноде после previousNode
        let changeIndexes = (node) => {
            if (node.next == null) {
                return;
            }
            node.next.index  -= 1;
            return changeIndexes(node.next);
        };
        changeIndexes(previousNode);
        this.length -= 1;
        return this;
    }

    reverse() {
        //создается новая нода
        let newHead = new Node();
        newHead.data = this._tail.data;
        //функция добавляет в новый сисок ноды в обратном порядке
        let appendInReverseOrder = (tail, head) => {
            if (!tail) {
                return;
            }
            head.next = tail.prev;
            return appendInReverseOrder(tail.prev, head.next);
        };
        appendInReverseOrder(this._tail, newHead);
        this._head = null;
        this._tail = null;
        this._head = newHead;
        //функция помещает в this._tail ссылку на последнюю ноду в новом списке
        let makeLastNodeAsTail = (node) => {
            if (node.next==null) {
                return this._tail = node;
            }
            if (node.next) {
                return makeLastNodeAsTail(node.next);
            }
        };
        makeLastNodeAsTail(this._head);
        //функция меняет свойства prev у потомков this._head
        let turnNextPreviousAsNext = (node) => {
            if (node.next == null) {
                return;
            }
            if (node.next) {
                node.next.prev = node;
            }
            return turnNextPreviousAsNext(node.next);
        };
        turnNextPreviousAsNext(this._head);
        //функция упорядочивает индексы
        let changeIndexes = (node) => {
            if (node.next==null) return;
            if (node.next) {
                node.next.index = node.index + 1;
            }
            return changeIndexes(node.next);
        };
        changeIndexes(this._head);
        return this;
    }

    indexOf(data) {
        //функция рекурсиво сравнивает data со свойством дата каждой последующей ноды
        let getIndex = (node) => {
            if (node == null) {
                return -1;
            }
            else if (data == node.data) {
                return node.index;
            } else {
                return getIndex(node.next);
            }
        };
       return getIndex(this._head);
    }
}

module.exports = LinkedList;
