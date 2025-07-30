# predicto89
Polymarket0-clone
   events. It is a full-stack application with a React frontend, a Node.js backend, and Solidity smart           │
 │       contracts for the blockchain functionality.                                                                   │
 │     4 +                                                                                                             │
 │     5 + ## Features                                                                                                 │
 │     6 +                                                                                                             │
 │     7 + *   **Decentralized Betting:** All bets are placed and settled on the blockchain, ensuring transparency     │
 │       and fairness.                                                                                                 │
 │     8 + *   **Wallet Authentication:** Users can sign in with their Ethereum wallets, providing a secure and        │
 │       seamless login experience.                                                                                    │
 │     9 + *   **Create and View Markets:** Users can create new prediction markets for any event and view a list of   │
 │       all available markets.                                                                                        │
 │    10 + *   **Place Bets:** Users can place bets on the outcome of any market.                                      │
 │    11 + *   **Real-time Updates:** The application uses Socket.io to provide real-time updates on market prices     │
 │       and outcomes.                                                                                                 │
 │    12 +                                                                                                             │
 │    13 + ## Technologies Used                                                                                        │
 │    14 +                                                                                                             │
 │    15 + ### Frontend                                                                                                │
 │    16 +                                                                                                             │
 │    17 + *   **React:** A JavaScript library for building user interfaces.                                           │
 │    18 + *   **Next.js:** A React framework for building server-side rendered and static web applications.           │
 │    19 + *   **Ethers.js:** A JavaScript library for interacting with the Ethereum blockchain.                       │
 │    20 + *   **Wagmi:** A React Hooks library for Ethereum.                                                          │
 │    21 + *   **Thirdweb:** A platform for building web3 applications.                                                │
 │    22 + *   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.                               │
 │    23 +                                                                                                             │
 │    24 + ### Backend                                                                                                 │
 │    25 +                                                                                                             │
 │    26 + *   **Node.js:** A JavaScript runtime built on Chrome's V8 JavaScript engine.                               │
 │    27 + *   **Express:** A fast, unopinionated, minimalist web framework for Node.js.                               │
 │    28 + *   **MongoDB:** A cross-platform document-oriented database program.                                       │
 │    29 + *   **Mongoose:** An object data modeling (ODM) library for MongoDB and Node.js.                            │
 │    30 + *   **Socket.io:** A library that enables real-time, bidirectional and event-based communication between    │
 │       the browser and the server.                                                                                   │
 │    31 + *   **JWT:** A compact, URL-safe means of representing claims to be transferred between two parties.        │
 │    32 +                                                                                                             │
 │    33 + ### Smart Contracts                                                                                         │
 │    34 +                                                                                                             │
 │    35 + *   **Solidity:** A contract-oriented, high-level language for implementing smart contracts.                │
 │    36 + *   **Hardhat:** A development environment to compile, deploy, test, and debug your Ethereum software.      │
 │    37 + *   **Chainlink:** A decentralized oracle network that enables smart contracts to securely access           │
 │       off-chain data feeds, web APIs, and traditional bank payments.                                                │
 │    38 +                                                                                                             │
 │    39 + ## Setup                                                                                                    │
 │    40 +                                                                                                             │
 │    41 + To run this project locally, you will need to have Node.js, npm, and MongoDB installed on your machine.     │
 │       You will also need to have an Ethereum wallet with some testnet ETH.                                          │
 │    42 +                                                                                                             │
 │    43 + 1.  **Clone the repository:**                                                                               │
 │    44 +                                                                                                             │
 │    45 + ```bash                                                                                                     │
 │    46 + git clone https://github.com/AsM802/predicto89.git                                                          │
 │    47 + ```                                                                                                         │
 │    48 +                                                                                                             │
 │    49 + 2.  **Install the dependencies for the backend:**                                                           │
 │    50 +                                                                                                             │
 │    51 + ```bash                                                                                                     │
 │    52 + cd backend                                                                                                  │
 │    53 + npm install                                                                                                 │
 │    54 + ```                                                                                                         │
 │    55 +                                                                                                             │
 │    56 + 3.  **Install the dependencies for the frontend:**                                                          │
 │    57 +                                                                                                             │
 │    58 + ```bash                                                                                                     │
 │    59 + cd ../frontend-new                                                                                          │
 │    60 + npm install                                                                                                 │
 │    61 + ```                                                                                                         │
 │    62 +                                                                                                             │
 │    63 + 4.  **Create a `.env` file in the `backend` directory and add the following environment variables:**        │
 │    64 +                                                                                                             │
 │    65 + ```                                                                                                         │
 │    66 + MONGODB_URI=<your_mongodb_uri>                                                                              │
 │    67 + JWT_SECRET=<your_jwt_secret>                                                                                │
 │    68 + ```                                                                                                         │
 │    69 +                                                                                                             │
 │    70 + 5.  **Start the backend server:**                                                                           │
 │    71 +                                                                                                             │
 │    72 + ```bash                                                                                                     │
 │    73 + cd ../backend                                                                                               │
 │    74 + npm start                                                                                                   │
 │    75 + ```                                                                                                         │
 │    76 +                                                                                                             │
 │    77 + 6.  **Start the frontend development server:**                                                              │
 │    78 +                                                                                                             │
 │    79 + ```bash                                                                                                     │
 │    80 + cd ../frontend-new                                                                                          │
 │    81 + npm run dev                                                                                                 │
 │    82 + ```                                                                                                         │
 │    83 +                                                                                                             │
 │    84 + The application should now be running on `http://localhost:3000`. 
