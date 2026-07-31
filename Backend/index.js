//entry point of the backend application
import connectdb from "./src/config/db.js";
import app from "./app.js";
const PORT = process.env.PORT || 4000;

connectdb().then(() => {
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error("Failed to connect to the database:", error);
  process.exit(1); // Exit the application if the database connection fails
})
   
app.get("/test", (req, res) => {
  res.send("Server is working fine");
})
