import solc from "solc";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface CompileResult {
  abi: any[];
  bytecode: string;
}

export function compileContract(contractName: string, constructorArgs: string[]): CompileResult {
  const contractPath = path.join(__dirname, "..", "contracts", `${contractName}.sol`);
  const source = fs.readFileSync(contractPath, "utf8");

  const input = {
    language: "Solidity",
    sources: {
      [`${contractName}.sol`]: {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  if (output.errors) {
    const errors = output.errors.filter((error: any) => error.severity === "error");
    if (errors.length > 0) {
      throw new Error(`Compilation failed: ${errors[0].message}`);
    }
  }

  const contract = output.contracts[`${contractName}.sol`][contractName];

  return {
    abi: contract.abi,
    bytecode: contract.evm.bytecode.object,
  };
}

export function getContractNameForType(tokenType: string): string {
  const contractMap: Record<string, string> = {
    standard: "ERC20Standard",
    mintable: "ERC20Mintable",
    burnable: "ERC20Burnable",
    taxable: "ERC20Taxable",
  };

  return contractMap[tokenType] || "ERC20Standard";
}
