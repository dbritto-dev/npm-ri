#! /usr/bin/env node

import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { program } from "commander";

function run(regex: RegExp, { version }: { version: string }) {
  const require = createRequire(import.meta.url);
  const pkg = require("./package.json");

  const dependencies = Object.keys(pkg.dependencies || {})
    .concat(Object.keys(pkg.devDependencies || {}))
    .filter((dependency) => regex.test(dependency))
    .map((dependency) => `${dependency}@${version}`);

  if (dependencies.length > 0) {
    const npmInstall = spawn("npm", ["install"].concat(dependencies));

    npmInstall.on("close", (code: number) => {
      if (code === 0) {
        console.info(
          `The next packages were updated to their latest version:\n${dependencies.join(
            "\n"
          )}`
        );
      } else {
        console.error("Something went wrong");
      }

      process.exit(code);
    });
    return;
  }

  console.log(`No packages found with the next regular expression: ${regex}`);
  process.exit(1);
}

program
  .argument(
    "<regex>",
    "regex that will be use to find packages",
    (value) => new RegExp(value)
  )
  .option(
    "-v, --version <version>",
    "version that will be use to update packages",
    "latest"
  )
  .action(run);

program.parse();
