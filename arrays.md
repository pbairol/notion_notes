# Arrays


# Arrays

- Have two attributes per index in an array block: **value & memory address**
- Arrays are contiguous which means the address of each block are right next to each other
- Each value that is a int/float takes up 4 bytes or 32 bits
- Each value that is an ASCII character takes up 1 byte or 8 bits

 YO


## Properties of Arrays

- Reading from an array (via indices) takes O(1) operation
- Looping through an array occurs through for loops - O(n) operation

## Static vs Dynamic Arrays

- Static arrays are set in size (Python does not have this)
- Dynamic arrays can grow even after initialization
	- Amortized Cost of inserting at the end is still O(1) **AND** you can grow the array

| <u>**Operation**</u>      | <u>**Big(O)**</u> |
| ------------------------- | ----------------- |
| Read/Write ith character  | O(1)              |
| Insert & Remove End block | O(1)              |
| Insert & Remove in Middle | O(n)              |
| Looping/Iterating through | O(n)              |

