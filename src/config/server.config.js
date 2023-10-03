import { Command } from "commander";

const program = new Command();

//Server options
program
  .option("-d, --dao <dao>", "Data Access Object", "MONGO")
  .option("-e, --env <env>", "Environment", "dev");
program.parse(process.argv);

export const serverOptions = program.opts();
