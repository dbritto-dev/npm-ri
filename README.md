# npm-ri

npm install using regular expression to update installed packages

# Usage

## Basic (by default the dependency version is "latest")

```sh
npx npm-ri "<dependecy-name-regex>"
```

### Example

```sh
npx npm-ri "@radix-ui/.*"
```

## With custom version

```sh
npx npm-ri "<dependency-name-regex>" --dependency-version <dependency-version>
```

or

```sh
npx npm-ri "<dependency-name-regex>" -dv <dependency-version>
```

### Example

```sh
npx npm-ri "@tanstack/.*" -dv beta
```
