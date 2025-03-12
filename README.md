# INF222 V24 - Obligatory Assignment 2

This obligatory assignment is about implementing a _transpiler_ that translates Java source code into TypeScript source code.

## Input and Output Example

### Input

The input is a Java file that contains variables marked with physical units in comments:

```java
public void ex() {
   int /*km*/ dist = 5;
   int /*s*/ time = 10;
   System.out.println(dist / time);
}
```

In this code:

- `dist` is marked in kilometers (`km`)
- `time` is marked in seconds (`s`)
- `dist / time` is a computed value -- the physical unit should be inferred, and the resulting value should be calculated accordingly (see below in the _Expected Output_)

### Expected Output

The output is a TypeScript file where physical units are converted and validated:

```ts
function ex() {
  let dist: Unit = new Unit("km", 5);
  let speed: Unit = new Unit("s", 10);
  console.log(
    new Unit(inferUnitKind("km / s"), baseValue(dist) / baseValue(time))
  );
}
```

In this output:

- Variables are wrapped in the `Unit` class to properly represent values with physical units.
- Expressions with units are also wrapped in the `Unit` class, and the helper methods `inferUnitKind` and `baseValue` are used to compute the resulting unit kind and value, respectively.

## Task Overview

Your task is to implement key components of a system that:

- parses Java code,
- identifies unit-annotated variables,
- performs type checks, and
- generates unit-consistent output in TypeScript.

The programs you'll be translating will have variables marked with a preceding comment, signifying that a variable represents a specific unit. For example:

```java
int /*m*/ a; // here variable 'a' is marked with the unit meters
```

Your goal is to transpile Java code into TypeScript, ensuring that all units are correctly inferred, processed, and converted when necessary. You'll also need to implement the helper functions to analyze and process the units, as well as to infer the unit type of an expression based on these units.

## Detailed Task Description

### 1. Familiarize yourself with the codebase.

### 2. AST Processing with JavaParser

You will use the [JavaParser library](https://javaparser.org/) to traverse the abstract syntax tree (AST) of Java code and "convert" it to TypeScript.
You are provided with the file [JavaToTypeSriptTranspiler.kt](./src/main/kotlin/org/uib/JavaToTypeScriptTranspiler.kt).

Your task is to complete the implementation of the [TranspilerVisitor.kt](./src/main/kotlin/org/uib/TranspilerVisitor.kt) class, which is responsible for converting Java code into TypeScript. The core objective is to traverse the AST of the Java source code, process the units attached to variables and expressions, and output the corresponding TypeScript code as a string.

The visitor should leverage JavaParser's preorder traversal of the AST to construct TypeScript code in a natural and intuitive manner.
Since the traversal visits each node before its children, you can build the code incrementally.
For example, when encountering a class declaration node, you can append `class X {`, recursively visit its child nodes, and finally append `}` to close the class definition. This approach aligns with the structure of the AST and ensures that code is generated in the correct order.

The class contains methods that process various parts of the AST.
The first two methods (`visit(ClassOrInterfaceDeclaration)` and `visit(ExpressionStmt)`) are already implemented. You will need to complete the remaining methods to handle other AST nodes.

### 3. Implement helper function `inferUnitKind`

This helper function in [base.ts](./ts/src/base.ts) should determine the resulting unit type of an arithmetic expression. To perform this inference, you should analyze an AST representation of the expression passed to the function. You can generate this AST using [tokenizer.ts](./ts/src/tokenizer.ts) and [parser.ts](./ts/src/parser.ts).

#### Behavior

**Input:** An expression string containing only units, constants, and arithmetic operators.

**Output:** The base unit (e.g., `m` for meters, `s` for seconds, etc.).

**Throws:** An exception if any of the rules listed below are violated in the expression.

For example, calling `getBaseUnit("(m * 2 + m) / s")` should return `"m/s"`.
Use this function in your TypeScript code to ensure that units are correctly handled.

#### Arithmetic Rules

| Left Operand | Operator(s)  | Right Operand | Result           |
| ------------ | ------------ | ------------- | ---------------- |
| Length       | `+` or `-`   | Length        | Length           |
| Time         | `+` or `-`   | Time          | Time             |
| Velocity     | `+` or `-`   | Velocity      | Velocity         |
| Length       | `/`          | Time          | **Velocity**     |
| Velocity     | `*`          | Time          | **Length**       |
| Time         | `*`          | Velocity      | **Length**       |
| All other    | Any Operator | All other     | :x: Incompatible |

# Prerequisites

To run the code in this repository, ensure that you have the following installed on your system:

- Java Development Kit (JDK)
- Maven
- Kotlin Compiler
- Node.js

IntelliJ IDEA is strongly recommended for writing and executing kotlin code in this assignment, but not required.

## Running the Tasks

### Transpiler

To invoke the transpiler, execute the following command in the terminal:

```sh
mvn clean compile exec:java
```

### TypeScript Code

Navigate to the `ts` folder in the terminal.

To initialize dependencies (this only needs to be done once), execute:

```sh
npm install
```

To run `transpiled.ts`, execute:

```sh
npm run start
```
