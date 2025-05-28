import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formValidationSchema } from "../types/formValidationSchema";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(formValidationSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    const fd = new FormData();
    for (let key in data) {
      fd.append(key, data[key]);
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, fd);

      if (res.data) {
        localStorage.setItem("UserInfo", JSON.stringify(res.data.userSaved));
        navigate("/login");
      } else {
        alert("Failed: " + data.message);
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const sopValue = watch("sop") || "";

  function get18YearsAgo() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split("T")[0];
  }


  return (
    <div className="p-10 bg-gradient-to-r from-blue-500 to-purple-500">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto p-5 bg-white rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h2
          className="text-3xl  font-bold col-span-full text-center text-indigo-700 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Join Innate Gamma Talent Scan
        </motion.h2>

        <div className="col-span-full md:col-span-1">
          <label htmlFor="name" className="block font-medium">Full Name:</label>
          <input
            id="name"
            {...register("name")}
            placeholder="Full Name"
            className="p-2 border mt-2 border-gray-300 rounded-md w-full"
          />
          {errors.name && <p className="error-text">{errors.name.message}</p>}
        </div>

        <div className="col-span-full md:col-span-1">
          <label htmlFor="username" className="block font-medium">Username:</label>
          <input
            id="username"
            {...register("username")}
            type="text"
            placeholder="Username"
            className="p-2 border mt-2 border-gray-300 rounded-md w-full"
          />
          {errors.username && <p className="error-text">{errors.username.message}</p>}
        </div>

        <div className="col-span-full md:col-span-1">
          <label htmlFor="email" className="block font-medium">Email:</label>
          <input
            id="email"
            type="email"
            {...register("email")}
            placeholder="Email Address"
            className="p-2 border mt-2 border-gray-300 rounded-md w-full"
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div className="col-span-full md:col-span-1">
          <label htmlFor="phone" className="block font-medium">Mobile No:</label>
          <input
            id="phone"
            type="tel"
            {...register("phoneno")}
            placeholder="Phone Number"
            className="p-2 border mt-2 border-gray-300 rounded-md w-full"
          />
          {errors.phoneno && <p className="error-text">{errors.phoneno.message}</p>}
        </div>

        <div className="col-span-full md:col-span-1">
          <label htmlFor="dob" className="block font-medium">Date of Birth:</label>
          <input
            id="dob"
            {...register("dob")}
            type="date"
            max={get18YearsAgo()}
            placeholder="Date of Birth (e.g., 1999-01-01)"
            className="p-2 border mt-2 border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.dob && <p className="text-sm text-red-600 mt-1">{errors.dob.message}</p>}
        </div>


        <div className="col-span-full md:col-span-1">
          <label htmlFor="gender" className="block font-medium">Select Gender</label>
          <select {...register("gender")} className="p-2 mt-2 border border-gray-300 rounded-md w-full">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="error-text">{errors.gender.message}</p>}
        </div>

        <div className="col-span-full md:col-span-1">
          <label htmlFor="deg" className="block font-medium">Degree:</label>
          <input
            id="deg"
            {...register("degree")}
            placeholder="Degree"
            className="p-2 border mt-2 border-gray-300 rounded-md w-full"
          />
          {errors.degree && <p className="error-text">{errors.degree.message}</p>}
        </div>

        <div className="col-span-full md:col-span-1">
          <label htmlFor="department" className="block font-medium">Department:</label>
          <select {...register("department")} className="p-2 mt-2 border border-gray-300 rounded-md w-full">
            <option value="">Select Department</option>
            <option value="technical_role">Technical</option>
            <option value="business_role">Business</option>
          </select>
          {errors.department && <p className="error-text">{errors.department.message}</p>}
        </div>

        <div className="col-span-full">
          <label htmlFor="sop" className="block font-medium">Statement of Purpose</label>
          <textarea
            id="sop"
            {...register("sop")}
            placeholder="Tell us why you're a great fit"
            rows={4}
            className="p-2 border mt-2 border-gray-300 rounded-md w-full resize-none"
          />
          <p className="text-sm text-gray-500 mt-1">
            Characters: {sopValue.length}
          </p>
          {errors.sop && <p className="error-text">{errors.sop.message}</p>}
        </div>

        <div className="col-span-full md:col-span-1">
          <label htmlFor="resume" className="block font-medium">Upload Resume:</label>
          <input
            id="resume"
            type="file"
            onChange={(e) => setValue("file", e.target.files[0])}
            className="p-2 mt-2 border border-gray-300 rounded-md w-full cursor-pointer"
          />
          {errors.file && <p className="error-text">{errors.file.message}</p>}
        </div>

        <div className="col-span-full md:col-span-1">
          <label htmlFor="password" className="block font-medium">Password:</label>
          <input
          id="password"
            type="password"
            {...register("password")}
            placeholder="Create Password"
            className="p-2 border mt-2 border-gray-300 rounded-md w-full"
          />
          {errors.password && <p className="error-text">{errors.password.message}</p>}
        </div>

        <div className="col-span-full">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all duration-300 disabled:bg-indigo-300"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

export default Home;
