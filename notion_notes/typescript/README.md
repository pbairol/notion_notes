# Typescript


### **What is Typescript:**

- Alternative to JS ( superset)
- Allows us to use strict types
- Supports modern features ( arrow functions, let ,const)
- Extra features ( generics, interfaces, tuples)

### **JS Attributes:**


**Arrow Functions:**
In JS and TS, _arrow functions_ provide a more concise syntax for defining functions. They are particularly useful for writing simple, **one-line functions** or when you need to **pass a function as an argument** to another function


	```javascript
	(parameters) => {
	  // function body
	}
	```


	Traditional Function in JS


	```javascript
	function add(a, b) {
	  return a + b;
	}
	```


	Same functionality via Arrow functions in JS


	```javascript
	const sum = (a,b)=>a+b;
	```


	Arrow functions also have a lexical `this` binding, which means that the value of `this` inside the function is determined by the surrounding context, rather than being dynamically bound like in a traditional function.


**DOM** (Document Object Model):


The DOM is a programming interface for web documents that represents the structure of an HTML or XML document. It allows programs and scripts to dynamically access and update the content, structure, and style of a web page.
In JS and TS, you can interact with the DOM using various methods and properties provided by the browser's DOM API. For example, you can select elements on the page using methods like document.getElementById(), document.querySelector(), or document.querySelectorAll()


Once you have a reference to an element, you can manipulate its properties, such as element.textContent or element.style.color
Here's an example of how you can use the DOM to change the text of an HTML element:


**Classes**



In both JS and TS, you can use classes to define custom objects and their behavior. Classes provide a way to create objects with shared properties and methods, similar to how classes work in Java or Python.
The syntax for defining a class in JS and TS is:


```typescript
class Animal {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  speak(): void {
    console.log(`${this.name} makes a sound.`);
  }
}

class Dog extends Animal {
  private breed: string;

  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }

  speak(): void {
    console.log(`${this.name} (${this.breed}) barks.`);
  }
}
```


In this TypeScript example, the `Animal` class has a protected `name` property and a `speak()` method. The `Dog` class extends the `Animal` class, adding a private `breed` property and overriding the `speak()` method.


*Remember browsers don’t understand TS we still need something that compiles TS to JS

- To Facilitate this you can run the command to compile .ts to .js

	```shell
	tsc file_name.ts
	```

- To recompile every time you update the .ts file you can run the command:

	```shell
	tsc file_name.ts -w
	```


### **Types**


Explicit Types:


	```typescript
	let character: string;
	let age: number;
	let isLogged: boolean;
	```


Arrays


	```typescript
	let ninjas: string[] = [];                        
	```


Unions


	Arrays


	```typescript
	let mixed: (string| number| boolean)[] = [];
	```


	Variable


	```typescript
	let uid: string|number;
	```


Objects


	```typescript
	let ninjaOne: object;
	ninjaOne = {name: 'yoshi', age:30};
	```


### Dynamic (Any) Types:


```typescript
//any variable
let age: any = 25;
age = true
age = 'hello';

//array can be any
let mixed: any[] = []

mixed.push(5);
mixed.push('mario');
mixed.push(false);
console.log(mixed);

//objects can have fields set to any as well

let ninja: {name:any, age: any};

ninja = {name: 'yoshi', age: 25};
ninja = {name: 25, age: 'yoshi'};
//^^ however this rips out the point of typescript and reverts it back to javascript
```

