import { auth } from "../FireBase/firebase";
import { signOut } from "firebase/auth";

const Logout = () => {
    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert("Logged out successfully!");
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <button onClick={handleLogout} className="btn btn-danger btn-sm px-3 rounded-pill">
            Logout
        </button>
    );};

export default Logout;
