// 1_mul.ts
import { compile, acir_from_bytes } from '@noir-lang/noir_wasm';
import { setup_generic_prover_and_verifier, create_proof, verify_proof, create_proof_with_witness } from '@noir-lang/barretenberg/dest/client_proofs';
import { packed_witness_to_witness, serialise_public_inputs, compute_witnesses } from '@noir-lang/aztec_backend';
import path from "path";
import hardhat from "hardhat";
import { ethers } from 'ethers';

// To begin proving and verifying a Noir program,
// it first needs to be compiled by calling noir_wasm's compile function:
const compiled_program = compile(path.resolve(__dirname, "../src/main.nr"));

// The compiled_program returned by the function contains
// the ACIR and the Application Binary Interface (ABI) of your Noir program.
// They shall be stored for proving your program later:

let acir = compiled_program.circuit;
const abi = compiled_program.abi;

// # main.nr
// fn main(x: u32, y: pub u32) -> pub u32 {
//     let z = x * y;
//     z
// }

// 1_mul.ts
abi.x = 3;
abi.y = 4;
abi.return = 12;


// Deploy verifier contract
let Verifier: ContractFactory;
let verifierContract: Contract;


// Prior to proving and verifying, the prover and verifier have to first be initialized
// by calling barretenberg's setup_generic_prover_and_verifier with your Noir program's ACIR:
let [prover, verifier] = await setup_generic_prover_and_verifier(acir);

// The Noir program can then be executed and proved by calling
// barretenberg's create_proof function:
const proof = await create_proof(prover, acir, abi);

// The proof obtained can be verified by calling barretenberg's verify_proof function:
const verified = await verify_proof(verifier, proof);
// console.log(verified) # true

// Verify proof on TurboVerifier contract
const sc_verified = await verifierContract.verify(proof);
// console.log(sc_verified) # true

before(async () => {
    Verifier = await ethers.getContractFactory("TurboVerifier");
    verifierContract = await Verifier.deploy();
});

function join(__dirname: string, filename: string): import("fs").PathOrFileDescriptor {
    throw new Error('Function not implemented.');
}

function before(arg0: () => Promise<void>) {
    throw new Error('Function not implemented.');
}

function expect(sc_verified: any) {
    throw new Error('Function not implemented.');
}

