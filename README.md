# Java to TypeScript Transpiler

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

## Prerequisites

To run the code in this repository, ensure that you have the following installed on your system:

- Java Development Kit (JDK)
- Maven
- Kotlin Compiler
- Node.js

IntelliJ IDEA is strongly recommended for writing and executing kotlin code, but not required.

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

## Credits

- Assignment spec: INF222, UiB.

- Uses s for AST traversal.
