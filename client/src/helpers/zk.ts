import { CircuitSignals, groth16, Groth16Proof } from 'snarkjs'

import { VerifierHelper } from '@/types/contracts/ZKRegistry'

export function formatProof(proof: Groth16Proof): VerifierHelper.ProofPointsStruct {
  return {
    a: [proof.pi_a[0], proof.pi_a[1]],
    b: [
      [proof.pi_b[0][1], proof.pi_b[0][0]],
      [proof.pi_b[1][1], proof.pi_b[1][0]],
    ],
    c: [proof.pi_c[0], proof.pi_c[1]],
  }
}

export function truncateBigIntTo24Bytes(value: bigint): bigint {
  return value & 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn
}

export async function generateProof(
  inputs: CircuitSignals,
  wasmPath: string,
  zkeyPath: string,
): Promise<{ proof: Groth16Proof; publicSignals: string[] }> {
  try {
    const [wasmFile, zkeyFile] = await Promise.all([
      fetchBinaryFile(wasmPath),
      fetchBinaryFile(zkeyPath),
    ])

    const { proof, publicSignals } = await groth16.fullProve(inputs, wasmFile, zkeyFile)

    return { proof, publicSignals }
  } catch (error) {
    console.error('Error generating proof:', error)
    throw error
  }
}

async function fetchBinaryFile(url: string): Promise<Uint8Array> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch file from ${url}`)
  }
  const buffer = await response.arrayBuffer()
  return new Uint8Array(buffer)
}
