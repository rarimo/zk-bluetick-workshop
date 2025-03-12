# ZK BlueTick Workshop UI

## Getting Started

This project uses **Yarn** as the package manager.

### Prerequisites

Make sure you have **Yarn** installed. If not, follow these steps:

1. **Install Node.js** (if not installed)
   Download and install from: [https://nodejs.org/](https://nodejs.org/)

2. **Install Yarn**
   Run one of the following commands:

   - Using Corepack (recommended for Node.js 16.10+):
     ```
     corepack enable
     ```
   - Using npm:
     ```
     npm install -g yarn
     ```

3. **Verify Installation**
```
yarn -v
```
If you see a version number, Yarn is installed successfully.

---

Follow these steps to set up and run the frontend locally:

1. Ensure you have a `.env` file. Copy `.env-example` and fill in the required values.
2. Install dependencies:
```bash
yarn install
```
3. Generate Ethereum types:
```bash
yarn generate-ether-types
```
4. Start the development server:
```bash
yarn start
```

The application will run on port `8333`.
