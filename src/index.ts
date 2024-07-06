#! /usr/bin/env node

import { cwd } from "node:process";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { program } from "commander";

function printDependenciesToUpdate(
  title: string,
  dependenciesToUpdate: [string, { current: string; next: string }][]
) {
  console.info(
    `${title}:\n${dependenciesToUpdate
      .map(
        ([name, { current: currentVersion, next: nextVersion }]) =>
          `${name}@${currentVersion} -> ${name}@${nextVersion}`
      )
      .join("\n")}`
  );
}

function run(
  dependencyNameRegex: RegExp,
  {
    dependencyVersion: nextDependencyVersion,
    dryRun,
  }: { dependencyVersion: string; dryRun: boolean }
) {
  const require = createRequire(`${cwd()}/`);
  const pkg = require("./package.json");

  const dependenciesToUpdate = Object.entries(
    Object.assign({}, pkg.dependencies || {}, pkg.devDependencies || {})
  )
    .filter(([dependencyName]) => dependencyNameRegex.test(dependencyName))
    .map(
      ([dependencyName, currentDependencyVersion]) =>
        [
          dependencyName,
          {
            current: currentDependencyVersion as string,
            next: nextDependencyVersion as string,
          },
        ] as [string, { current: string; next: string }]
    );

  if (dependenciesToUpdate.length > 0) {
    if (dryRun) {
      printDependenciesToUpdate(
        "The next packages might be updated",
        dependenciesToUpdate
      );

      return;
    }

    const npmInstall = spawn(
      "npm",
      ["install"].concat(
        dependenciesToUpdate.map(
          ([name, { next: nextVersion }]) => `${name}@${nextVersion}`
        )
      )
    );

    npmInstall.on("close", (code: number) => {
      if (code === 0) {
        printDependenciesToUpdate(
          "The next packages were updated",
          dependenciesToUpdate
        );

        return;
      }

      program.error("Something went wrong");
    });

    return;
  }

  if (dryRun) {
    console.warn(
      `No packages found with the next regular expressions: ${dependencyNameRegex}`
    );

    return;
  }

  program.error(
    `No packages found with the next regular expressions: ${dependencyNameRegex}`
  );
}

program
  .name("npm-ri")
  .description(
    "npm install using regular expressions to update installed dependencies"
  )
  .version("0.0.6");

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
