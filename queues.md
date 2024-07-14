- Follow FIFO - First In First Out
- Enque - It appends (push to end) to the list
- Deque - It removes from the front

Problems: Constrcut a Queue


Notes:

- Need to Implement Queue via DLL
	- To do so first create DLL node class which has : **val, prev, and next**
	- In Queue/Deque constructor: Initialize a **head** pointers and **tail** pointers and set the **next** and **prev** to **each other**.
	- Checking if IsEmpty ⇒ Check if s_elf.head.next_ == _self.tail_
	- To append: Construct a new_node and depending on where you have to get that tail.prev node (next/prev) values  and the _tail node_ (next/prev) values
	- To Pop: Use IsEmpty() method and check if it is, if it is _return -1_
		- Then get the node you are trying to delete and set the delete_node.prev to its delete_node.next.

```python
class Node:
    def __init__(self,value):
        self.value = value
        self.next = None
        self.prev = None
class Deque:
    
    def __init__(self):
        self.head = Node(-1)
        self.tail = Node(-1)
        self.head.next = self.tail
        self.tail.prev = self.head


    def isEmpty(self) -> bool:
        if self.head.next == self.tail:
            return True
        return False

        

    def append(self, value: int) -> None:
        new_node = Node(value)
        last_node = self.tail.prev

        last_node.next = new_node
        new_node.prev = last_node
        new_node.next = self.tail
        self.tail.prev = new_node
        

    def appendleft(self, value: int) -> None:
        new_node = Node(value)
        first_node = self.head.next
        self.head.next = new_node
        new_node.prev = self.head
        new_node.next = first_node
        first_node.prev = new_node

    def pop(self) -> int:
        if self.isEmpty():
            return -1
        last_node = self.tail.prev
        val = last_node.value

        prev_node = last_node.prev
        self.tail.prev = prev_node
        prev_node.next = self.tail
        return val
    def popleft(self) -> int:
        if self.isEmpty():
            return -1
        first_node = self.head.next
        val = first_node.value
        next_node = first_node.next
        next_node.prev = self.head
        self.head.next = next_node
        return val
        

```


Operations Of generic queue:

- .popleft() - pops from the left  (start of the queue)
- .append() - appends or pushes to the right (end of the queue)
- .isEmpty() - checks if the queue is empty or not!
