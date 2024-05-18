
## Singly Linked List

- Similarities and Differences from Stacks
- Linked List (Single) are a bunch of **LIST NODES** connected to one another
	- LISTNODE

		| VALUE | NEXT |
		| ----- | ---- |

	- NEXT: is a pointer to another address to another list node.
	- In memory the List nodes can be anywhere in memory but they are connected to each other via pointers.
- To do a connection between two ListNodes is :

	```python
	ListNode one
	ListNode two
	one.next = two
	```

- Looping through the ListNode:

	```python
	curr = head
	while curr != None:
			curr = curr.next
	```

- Removing a Node:

	```python
	head.next = head.next.next 
	
	#Removes the head.next node and instead the head points to the node next to head.next
	```

- Reversing a Linked  List: ( create a prev pointer and set [head.next](http://head.next/) to it and each time set prev to head and continue moving head forward) [PROBLEM](https://leetcode.com/problems/reverse-linked-list/)

	```python
	
	class Solution(object):
	    def reverseList(self, head):
	
	        prev = None
	
	        while head:
	            #temp storing the next head
	            nextNode = head.next
	            # making sure the list is doing oppoiste "reversing the link"
	            head.next = prev
	
	            # now adding on to prev so head can do it again 
	            prev = head
	            #setting head to the next head value like usual
	            head = nextNode
	        return prev
	        """
	        :type head: ListNode
	        :rtype: ListNode
	        """
	```

- Combing or adding Nodes to a linked list [(Combing two sorted Lists)](https://leetcode.com/problems/merge-two-sorted-lists/description/)
	- To do this you have to create a dummy pointer and a return pointer that points to the dummy
	- then at the end of adding everything return the return_pointer.next

	```python
	class Solution(object):
	    def mergeTwoLists(self, list1, list2):
	
	        mergeList = ListNode(-1)
	        returnList = mergeList
	        while list1 and list2:
		        #check whatever node from the list is lower and set that as the next
		        #val of the merge List and then move each list accordingly
	            if list1.val <= list2.val:
	                mergeList.next = list1
	                list1 = list1.next
	                
	            else:
	                mergeList.next = list2
	                list2 = list2.next
	            #traverse through 
	            mergeList = mergeList.next
	        # at the end if there is a leftover of any of the lists add it to the end 
	        # merget list
	        if list1:
	            mergeList.next = list1
	        
	        else:
	            mergeList.next = list2
	        
	        return returnList.next
	```


## Doubly Linked List

- Now there are two pointers  NEXT → and PREV ←
- DLListNode

	| PREV | VALUE | NEXT |
	| ---- | ----- | ---- |


Time Complexities:


| **Operation**         | **Arrays Big-O Time** | **Linked Lists  Big O Time**               |
| --------------------- | --------------------- | ------------------------------------------ |
| Access i-th element   | O(1)                  | O(n)                                       |
| Insert/Remove end     | O(1)                  | O(1)                                       |
| Insert/ Remove middle | O(n)                  | O(n) → but if we are at that node alr O(1) |

