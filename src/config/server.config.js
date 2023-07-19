import { Command } from "commander";

const program = new Command();

//Server options
program.option("-d, --dao", "Data Access Object", "MONGO");

export const options = program.opts();
