# Local Server Setup

To run the server locally, follow these steps:

1. Ensure that your `.env` file has the required environment variables set up:
   **Explanation of environment variables:**

- **`PORT`**: The port number on which the server will listen (e.g., `3000`).
- **`DB_URL`**: The connection URL for the database
- **`LOG_LEVEL`**: Determines the logging level. Common values are `debug`, `info`, `warn`, `error`. Set to `debug` by default for detailed logs during development.
- **`MESSAGE`**: A message that is used to subscribe to on the client side and is checked for validation before performing certain actions.
- **`ZK_REGISTRY_CONTRACT_ADDRESS`**: The address of the Zero Knowledge (ZK) registry contract, necessary for interaction with the blockchain.
- **`PUBLIC_RPC_URL`**: The URL for the public RPC, used to interact with the blockchain network.

2. Install the dependencies using Yarn:

```bash
yarn install
```

3. Generate contract types with the following command:

```bash
yarn generate-ether-types
```

4. Finally, start the server locally:

```bash
yarn dev
```
