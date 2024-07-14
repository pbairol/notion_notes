
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

