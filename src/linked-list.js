const Node = require('./node');

class LinkedList {
    constructor() {
        this._head = null;
        this._tail = null;
        this.length = 0;
    }

    append(data) {
        //в this._head и this._tail присваивается ссылка на первую ноду
        if (this.length == 0) {
            this._head = new Node(data);
            this._tail = new Node(data, this._head);
            this._head.next = this._tail;
            this.length = 1;
        //в this._tail присваивается ссылка на сл. ноду
        } else if (this.length == 1) {
            this.length += 1;
            this._tail = new Node (data, this._head);
            this._head.next = this._tail;
        //в this._tail писваивается ссылка на сл. ноду, устанавливаются связи с предыдущей нодой
        } else if (this.length >= 2) {
            let tail = this._tail;
            this._tail = new Node(data);
            tail.next = this._tail;
            this._tail.prev = tail;
            this.length += 1;
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
        let counter = 0;
        if (index >= this.length)  {
            throw new Error ("Index exceeded length");
        }
        //функция рекурсивно сравнивает index с counter
        let getData = (node) => {
            if (index == counter) {
                return node.data;
            } else {
                counter++;
                return getData(node.next);
            }
        };
        return  getData(this._head);
    }

    insertAt(index, data) {
        let firstCounter = 0;
        let secondCounter = 0;
        if (this.length==0 && index == 0) {
            this.append(data);
        } else if (index == 0 && this.length == 1) {
            this._head = new Node(data);
            this._head.next = this._tail;
            this._tail.prev = this._head;
            this.length += 1;
        } else  if (index == 0 && this.length > 1) {
            let head = this._head;
            this._head = new Node(data);
            head.prev = this._head;
            this._head.next = head;
            this.length +=1;
        } else if (index >= this.length) {
            throw new Error ("Index exceeded length");
        } else {
            //функция ищет ноду, на место которой нужно вставить новую ноду
            let getCurrentNode = (node) => {
                if (index == firstCounter){
                    return node;
                } else {
                    firstCounter++;
                    return getCurrentNode(node.next);
                }
            };
            //функция ищет ноду, предыдущую ранее искомой ноде
            let getPreviousNode = (node) => {
                if (index == secondCounter) {
                    return node.prev;
                } else {
                    secondCounter++;
                    return getPreviousNode(node.next);
                }
            };
            //создается нода, устанавливаются связи между нодами
            let nextNode = getCurrentNode(this._head);
            let previousNode = getPreviousNode(this._head);
            let newCurrentNode = new Node(data);
            nextNode.prev = newCurrentNode;
            previousNode.next = newCurrentNode;
            newCurrentNode.next = nextNode;
            newCurrentNode.prev = previousNode;
            this.length += 1;
            return this;
        }
    }

    isEmpty() {
        return this.length == 0;
    }

    clear() {
        this._head.data = null;
        this._tail.data = null;
        this.length=0;
        return this;
    }

    deleteAt(index) {
        let firstCounter = 0;
        let secondCounter = 0;
        if (index == 0 && this.length == 1) {
            return this;
        } else if (index == 0 && this.length == 2) {
            this._head.data = this._tail.data;
            this._head.next=this._tail;
            this._tail.prev = this._head;
            this.length -= 1;
        } else if (index == 1 && this.length == 2) {
            this._tail.data = this._head.data;
            this._tail.prev = this._head;
            this._head.next = this._tail;
            this.length -= 1;
        }  else if (index == 0 && this.length > 2) {
            let head = this._head;
            this._head = head.next;
            this._head.prev = null;
            this.length -= 1;
        } else  if (index == this.length-1) {
            let tail = this._tail;
            this._tail = tail.prev;
            this._tail.next = null;
            this.length -= 1;
        } else {
            //функция ищет ноду, предыдущую удаляемой
            let getPreviousNode = (node) => {
                if (index == firstCounter) {
                    return node.prev;
                } else {
                    firstCounter++;
                    return getPreviousNode(node.next);
                }
            };
            //функция ищет ноду, следующую после удаляемой
            let getNextNode = (node) => {
                if (index == secondCounter) {
                    return node.next;
                } else {
                    secondCounter++;
                    return getNextNode(node.next);
                }
            };
            //устанавливаются связи между previousNode и nextNode
            let previousNode = getPreviousNode(this._head);
            let nextNode = getNextNode(this._head);
            previousNode.next = nextNode;
            nextNode.prev = previousNode;
            this.length -= 1;
        }
        return this;
    }

    reverse() {
        //создается новая нода
        let newHead = new Node();
        newHead.data = this._tail.data;
        //функция добавляет в новый сисок ноды в обратном порядке
        let appendInReverseOrder = (head, tail) => {
            if (!tail) {
                return;
            }
            head.next = tail.prev;
            return appendInReverseOrder(head.next, tail.prev);
        };
        appendInReverseOrder(newHead, this._tail);
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
        return this;
    }

    indexOf(data) {
        let counter = 0;
        //функция рекурсиво сравнивает data со свойством дата каждой последующей ноды
        let getIndex = (node) => {
            if (node == null) {
                return -1;
            }
            else if (data == node.data) {
                return counter;
            } else {
                counter++;
                return getIndex(node.next);
            }
        };
       return getIndex(this._head);
    }
}

module.exports = LinkedList;
