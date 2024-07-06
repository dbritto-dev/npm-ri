#! /usr/bin/env node

import { cwd } from "node:process";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { program } from "commander";

function run(
  dependencyNameRegex: RegExp,
  { dependencyVersion, dryRun }: { dependencyVersion: string; dryRun: boolean }
) {
  const require = createRequire(`${cwd()}/`);
  const pkg = require("./package.json");

  const dependencies = Object.keys(pkg.dependencies || {})
    .concat(Object.keys(pkg.devDependencies || {}))
    .filter((dependency) => dependencyNameRegex.test(dependency))
    .map((dependency) => `${dependency}@${dependencyVersion}`);

  if (dependencies.length > 0) {
    if (dryRun) {
      console.info(
        `The next packages might be updated:\n${dependencies.join("\n")}`
      );

      return;
    }

    const npmInstall = spawn("npm", ["install"].concat(dependencies));

    npmInstall.on("close", (code: number) => {
      if (code === 0) {
        console.info(
          `The next packages were updated:\n${dependencies.join("\n")}`
        );

        return;
      }

      throw new Error("Something went wrong");
    });

    return;
  }

  throw new Error(
    `No packages found with the next regular expressions: ${dependencyNameRegex}`
  );
}

program
  .name("npm-ri")
  .description(
    "npm install using regular expressions to update installed dependencies"
  )
  .version("0.0.4");

program
  .argument(
    "<dependency-name-regex>",
    "regex that will be use to find dependencies",
    (value) => {
      return new RegExp(value);
    }
  )
  .option(
    "-dv, --dependency-version <dependency-version>",
    "version that will be use to update dependencies",
    "latest"
  )
  .option("--dry-run", "do not actually perform updates", false)
  .action(run);

program.parse();
