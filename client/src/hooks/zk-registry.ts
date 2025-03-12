import { useEvent } from '@reactuses/core'
import TransgateConnect from '@zkpass/transgate-js-sdk'
import { utils } from 'ethers'
import { useCallback, useMemo, useState } from 'react'

import { config } from '@/config'
import {
  bus,
  BusEvents,
  createContract,
  ErrorHandler,
  formatProof,
  generateProof,
  truncateBigIntTo24Bytes,
} from '@/helpers'
import { ZKRegistry__factory } from '@/types'
import { useWeb3Context } from '@/web3-context'

export enum ZkFilesUrls {
  SMTWasm = 'https://zkpass-public.nyc3.digitaloceanspaces.com/ZKRegistrySMT.wasm',
  SMTZkey = 'https://zkpass-public.nyc3.digitaloceanspaces.com/ZKRegistrySMT.groth16.zkey',
  CommitmentBuilderWasm = 'https://zkpass-public.nyc3.digitaloceanspaces.com/CommitmentBuilder.wasm',
  CommitmentBuilderZkey = 'https://zkpass-public.nyc3.digitaloceanspaces.com/CommitmentBuilder.groth16.zkey',
}

const ZERO_HANDLE_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'

type ZkPassConnectorResult = {
  taskId: string
  publicFields: unknown[]
  allocatorAddress: string
  publicFieldsHash: string
  allocatorSignature: string
  uHash: string
  validatorAddress: string
  validatorSignature: string
}

export const useZkRegistry = () => {
  const [isZkPassChecking, setIsZkPassChecking] = useState(true)
  const { rawProviderSigner, address } = useWeb3Context()
  const zkRegistry = useMemo(() => {
    if (!rawProviderSigner) return null
    return createContract(config.ZK_REGISTRY_CONTRACT, rawProviderSigner, ZKRegistry__factory)
  }, [rawProviderSigner])

  const connector = useMemo(() => new TransgateConnect(config.ZK_PASS_APP_ID), [])
  const isTransgateAvailable = useEvent(async () => await connector.isTransgateAvailable())

  const registerUserOnZkRegistry = useCallback(
    async ({ onFirstTxDone }: { onFirstTxDone: () => void }) => {
      if (!zkRegistry || !address)
        throw new Error('ZKRegistry contract or address is not available')

      const connector = new TransgateConnect(config.ZK_PASS_APP_ID)
      const isAvailable = await isTransgateAvailable()

      if (!isAvailable) {
        bus.emit(BusEvents.error, {
          message: 'Install and enable zkPass TransGate extension',
        })
        throw new Error('Transgate is not available')
      }

      const result = (await connector.launch(config.ZK_PASS_SCHEMA_ID)) as ZkPassConnectorResult
      const { taskId, publicFieldsHash, uHash, validatorSignature } = result

      const registeredUserAddress = await zkRegistry.contractInstance.userAddresses(uHash)

      if (Number(registeredUserAddress) !== 0) {
        bus.emit(BusEvents.error, {
          message: 'This twitter account is already verified with another address',
        })
        throw new Error('This twitter account is already verified with another address')
      }

      const signaturePart = '0x' + validatorSignature.substring(4, 66)

      const commitmentProof = await generateProof(
        {
          contractAddress: config.ZK_REGISTRY_CONTRACT,
          userAddress: address,
          signaturePart,
        },
        ZkFilesUrls.CommitmentBuilderWasm,
        ZkFilesUrls.CommitmentBuilderZkey,
      )

      const signatureCommitmentHex =
        '0x' + BigInt(commitmentProof.publicSignals[0]).toString(16).padStart(64, '0')

      const commitTx = await zkRegistry.contractInstance.commitUserRegistration(
        signatureCommitmentHex,
        address,
        formatProof(commitmentProof.proof),
      )
      await commitTx.wait()
      onFirstTxDone()

      const completeTx = await zkRegistry.contractInstance.completeUserRegistration(
        utils.hexlify(utils.toUtf8Bytes(taskId)),
        utils.hexlify(utils.toUtf8Bytes(config.ZK_PASS_SCHEMA_ID)),
        uHash,
        publicFieldsHash,
        validatorSignature,
      )
      await completeTx.wait()
    },
    [zkRegistry, address, isTransgateAvailable],
  )

  const getSmtProofPayload = useCallback(
    async (handleHash: string) => {
      if (!zkRegistry) throw new Error('ZKRegistry contract is missing')

      const handleHashBigInt = BigInt(handleHash)
      const trimmedHandleHash = truncateBigIntTo24Bytes(handleHashBigInt)
      const hexHandleHash = utils.hexZeroPad(utils.hexlify(trimmedHandleHash), 32)

      const smtProof = await zkRegistry.contractInstance.getProof(hexHandleHash)

      const { proof, publicSignals } = await generateProof(
        {
          root: BigInt(smtProof.root),
          key: smtProof.key,
          value: smtProof.value,
          siblings: smtProof.siblings.map(sibling => BigInt(sibling)),
          auxKey: BigInt(smtProof.auxKey),
          auxValue: BigInt(smtProof.auxValue),
          auxIsEmpty: BigInt(smtProof.auxExistence),
          isExclusion: BigInt(0),
        },
        ZkFilesUrls.SMTWasm,
        ZkFilesUrls.SMTZkey,
      )

      return {
        proof,
        root: publicSignals[0],
      }
    },
    [zkRegistry],
  )

  const checkZkPass = useCallback(
    async (address: string) => {
      setIsZkPassChecking(true)
      try {
        return (await zkRegistry?.contractInstance.userHandles(address)) !== ZERO_HANDLE_HASH
      } catch (error) {
        ErrorHandler.process(error)
        return false
      } finally {
        setIsZkPassChecking(false)
      }
    },
    [zkRegistry?.contractInstance],
  )

  return {
    isTransgateAvailable,
    zkRegistry: zkRegistry?.contractInstance,
    registerUserOnZkRegistry,
    getSmtProofPayload,

    checkZkPass,
    isZkPassChecking,
  }
}
