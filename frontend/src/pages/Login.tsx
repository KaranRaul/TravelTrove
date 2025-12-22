import { useState, useContext } from "react";
import { loginUser } from "../api/auth.api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await loginUser(email, password);
            login(res.data.token);
            navigate("/chat");
        } catch (err: any) {
            setError(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div style={styles.container}>
            <h2>Login</h2>

            {error && <p style={styles.error}>{error}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">Login</button>
            </form>

            <p>
                Don’t have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
};

const styles = {
    container: {
        width: "300px",
        margin: "100px auto",
        textAlign: "center" as const,
    },
    form: {
        display: "flex",
        flexDirection: "column" as const,
        gap: "10px",
    },
    error: {
        color: "red",
    },
};

export default Login;
