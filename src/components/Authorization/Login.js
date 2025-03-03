import { useState } from "react";
import { auth } from "../FireBase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import {Link, useNavigate} from "react-router-dom";
import { useAuth } from "./AuthContext";

const Login = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    if (user) {
        navigate("/");
        return null;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            const response = await fetch("https://musicapplicationbackend-production.up.railway.app/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to authenticate with backend");
            }

            const userData = await response.json();
            setUser(userData);
            navigate("/");
        } catch (error) {
            setError("Invalid email or password. Please try again.");
        }
    };

    return (
        <div style={styles.container}>
            <h2>Login</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={handleLogin} style={styles.form}>
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
                <button type="submit" style={styles.button}>Login</button>
                <h6>New around here? Register <Link to="/register">here</Link></h6>
            </form>
        </div>
    );
};

const styles = {
    container: {maxWidth: "400px", margin: "auto", padding: "20px", textAlign: "center" },
    form: { display: "flex", flexDirection: "column", gap: "10px" },
    input: { padding: "10px", fontSize: "16px" },
    button: { padding: "10px", fontSize: "16px", cursor: "pointer" },
    error: { color: "red" },
};

export default Login;
