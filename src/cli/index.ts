export * from "./commands";

import chalk from "chalk";
import { Option, program } from "commander";
import path from "path";
import updateNotifier from "update-notifier";
import { DEFAULT_CONFIG } from "../config";
import { swaCliConfigFilename } from "../core/utils/cli-config";
import registerLogin from "./commands/login";
import registerStart from "./commands/start";
import registerDeploy from "./commands/deploy";
import registerInit from "./commands/init";
const pkg = require("../../package.json");

const printWelcomeMessage = () => {
  // don't use logger here: SWA_CLI_DEBUG is not set yet
  console.log(chalk.dim.gray(`[swa]`));
  console.log(chalk.dim.gray(`[swa]`), `Azure Static Web App CLI v${pkg.version}`);
  console.log(chalk.dim.gray(`[swa]`));
};

export async function run(argv?: string[]) {
  printWelcomeMessage();

  // Once a day, check for updates
  updateNotifier({ pkg }).notify();

  program
    .name("swa")
    .usage("<command> [options]")
    .version(pkg.version, "-v, --version")

    // SWA CLI common configuration options
    .addOption(
      new Option("--verbose [prefix]", "enable verbose output. Values are: silly,info,log,silent")
        .preset(DEFAULT_CONFIG.verbose)
        .default(DEFAULT_CONFIG.verbose)
    )
    .addHelpText("after", "\nDocumentation:\n  https://aka.ms/swa/cli-local-development\n")

    .option("--config <path>", "path to swa-cli.config.json file to use", path.relative(process.cwd(), swaCliConfigFilename))
    .option("--print-config", "print all resolved options", false)
    .option(
      "--swa-config-location <swaConfigLocation>",
      "the directory where the staticwebapp.config.json file is located",
      DEFAULT_CONFIG.swaConfigLocation
    );

  // Register commands
  registerLogin(program);
  registerStart(program);
  registerDeploy(program);
  registerInit(program);

  await program.parseAsync(argv);
}
