# Recursion


One Branch Recursion:

- Example: n! = n* (n-1) * (n-2) * (n*3) … * 2 * 1, Where 1 is the base number or _base case_.

Recursion: is Making one **BIG Problem**  into smaller **Sub Problems!**


```python

class Solution(object):
    def factorial(self, n):
    
    #base case:
		   if n == 0 or n == 1:
		   return 1
		
		#recursive case:
				return n * self.factorial(n-1)
```


Solving reverse Linked List via recursion


```python
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
		    #base case is that the head is null so return null
        if not head:
            return None
        #else try to find the new head everytime
        newHead = head
        if head.next:
		        # the head will be the last head that returns none
            newHead = self.reverseList(head.next)
            # and the original head will point backwords
            head.next.next = head
		        #last but not least cut off the original heads pointer 
		        head.next = None
		    # return the new head which is now the reversed linked list at the very end
        return newHead
```


Two Branch Recursion:

- Example: F(n) = F(n-1) + F(n-2), Where F(0) = F(1) = 1 is the base number or _base case_.

```python
class Solution:
    def fib(self, n:int) -> int:
		    #base case is that n is 1 or 0
        if n == 0 or n == 1:
            return 1
        #else two branch recurse go one down and two down and add :) 
	      return fib(n-1) + fib(n-2)
```


Similarly: Leetcode question


```python
class Solution:
    def climbStairs(self, n: int) -> int:
        if n == 0 or n == 1:
            return 1
        
        return self.climbStairs(n-1) + self.climbStairs(n-2)
```

