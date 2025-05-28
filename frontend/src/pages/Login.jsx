import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../context/context";
const Login = () => {
  const { setUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        formData
      );
      if (response.status === 200) {
        let token = response.data.token;
        Cookies.set("token", token, {
          expires: 7,
          secure: true,
          path: "/",
          sameSite: "Strict",
        });
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        

        setUser(decodedToken);
        if (decodedToken.role === "admin") {
          navigate("/Dashboard");
        } else if (decodedToken.role === "candidate") {
          navigate("/assessment", { state: { id: decodedToken.id } });
        } else {
          navigate("/home");
        }
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred during login"
      );
    }
    // Add your login logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Welcome
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <div />
            <a href="#" className="text-indigo-600 hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-indigo-600 font-medium hover:underline"
          >
            Sign up
          </a>
        </p>
        <div>{error && <p className="text-red-500">{error}</p>}</div>
      </div>
    </div>
  );
};

export default Login;
