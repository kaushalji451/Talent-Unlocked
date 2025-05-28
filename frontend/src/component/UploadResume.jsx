import React, { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { motion, AnimatePresence } from "framer-motion";

const UploadResume = () => {
  const [form, setFormdata] = useState({
    username: "",
    resume: null,
  });

  const [search, setsearch] = useState("");
  const [dropdown, setdropdown] = useState(false);

  const handleChange = async (e) => {
    const value = e.target.value;
    setFormdata({ ...form, username: value });

    if (!value) {
      setsearch("");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/candidates/search?name=${value}`
      );
      const result = await res.json();
      setsearch(result.data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  useEffect(() => {
    setdropdown(search.length > 0);
  }, [search]);

  const handleNameSubmit = (candidate) => {
    setFormdata({ ...form, username: candidate.username });
    setdropdown(false);
  };

  const handleClick = async (e, close) => {
    e.preventDefault();
    if (!form.username || !form.resume) {
      alert("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("cvUrl", form.resume);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/candidate/upload`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result) {
        alert("Candidate added successfully");
        close();
      }
    } catch (err) {
      console.error("Error uploading resume:", err);
    }
  };

  return (
    <div>
      <Popup
        trigger={
          <button className="bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 transition">
            Upload CV
          </button>
        }
        modal
        nested
      >
        {(close) => (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="p-6 rounded-lg bg-white shadow-xl relative mx-auto"
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl"
              onClick={close}
            >
              &times;
            </button>

            <h1 className="font-bold text-2xl text-center mb-6 text-blue-700">Upload Resume</h1>

            <form onSubmit={(e) => handleClick(e, close)} className="flex flex-col gap-6">
              {/* Candidate Name */}
              <div className="relative">
                <label htmlFor="name" className="block mb-1 font-semibold">Find Candidate</label>
                <input
                  type="text"
                  id="name"
                  name="username"
                  className="w-full border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Type candidate name"
                  required
                  onChange={handleChange}
                  value={form.username}
                />

                <AnimatePresence>
                  {dropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 mt-2 w-full bg-white border border-slate-300 rounded-md shadow-md max-h-40 overflow-y-auto"
                    >
                      {search.map((candidate) => (
                        <div
                          key={candidate._id}
                          className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                          onClick={() => handleNameSubmit(candidate)}
                        >
                          {candidate.username}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Resume Upload */}
              <div>
                <label htmlFor="resume" className="block mb-1 font-semibold">Upload CV</label>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  className="w-full border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                  onChange={(e) =>
                    setFormdata({
                      ...form,
                      resume: e.target.files[0],
                    })
                  }
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition"
              >
                Submit
              </button>
            </form>
          </motion.div>
        )}
      </Popup>
    </div>
  );
};

export default UploadResume;
