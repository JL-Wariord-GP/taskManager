//! Levantamos el servidor

import app from "./app";

//! Define the port for the server
const PORT = process.env.PORT || 3000;

/**
 * Starts the server.
 */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
