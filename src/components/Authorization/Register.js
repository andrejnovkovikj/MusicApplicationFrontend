import { useState } from "react";
import { auth } from "../FireBase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {Link, useNavigate} from "react-router-dom";
import { useAuth } from "./AuthContext";

const Register = () => {
    const { user,setUser } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [role, setRole] = useState("USER");

    if (user) {
        navigate("/");
        return null;
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            const response = await fetch("https://musicapplicationbackend-production.up.railway.app/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    role: role,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to register with backend");
            }
            const userData = await response.json();
            setUser(userData);
            navigate("/");
        } catch (error) {
            console.error("Registration Error:", error);
            setError("Error registering. Please try again.");
        }
    };

    return (
        <div style={styles.container}>
            <h2>Register</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleRegister} style={styles.form}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />
                <div className="mb-3">
                    <label className="form-label">Role:</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="form-select"
                        required
                    >
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>
                <button type="submit" style={styles.button}>Register</button>
                <h6>Already have an account? Sign in <Link to="/login">here</Link></h6>
            </form>
        </div>
    );
};

const styles = {
    container: {maxWidth: "400px", margin: "auto", padding: "20px", textAlign: "center"},
    form: {display: "flex", flexDirection: "column", gap: "10px"},
    input: {padding: "10px", fontSize: "16px"},
    button: {padding: "10px", fontSize: "16px", cursor: "pointer"},
    error: {color: "red"},
};

export default Register;
