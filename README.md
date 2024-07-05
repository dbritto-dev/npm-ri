# npm-ri

npm install using regular expression

# Usage

## Basic (by default version is "latest")

```sh
npx npm-ri "<regex>"
```

### Example

```sh
npx npm-ri "@radix-ui/.*"
```

## With custom version

```sh
npx npm-ri "<regex>" -v <version>
```

### Example 

```sh
npx npm-ri "@tanstack/.*" -v beta
```
