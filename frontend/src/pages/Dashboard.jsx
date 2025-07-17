import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/currentUser", {
        withCredentials: true, // ✅ Token (cookie) bhejega
      })
      .then((res) => {
        console.log("User from token:", res.data.user); // ✅ Yahin show hoga
        setUser(res.data.user); // Optional: state me store bhi kar lo
      })
      .catch((err) => {
        console.error("Not logged in or invalid token:", err.response?.data);
      });
  }, []);

  return (
    <div className="p-4 ">
      <h1 className="text-xl font-bold">Dashboard</h1>
      {user ? (
        <>
        <pre>{JSON.stringify(user,null, 2)}</pre> 
        {/* <h1>dfkdfj</h1>// ✅ optional: UI me bhi dikhao */}
        </>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
};

export default Dashboard;
