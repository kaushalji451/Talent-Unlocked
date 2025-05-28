import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const AddCandidate = () => {
  const navigate = useNavigate();
  const [form, setform] = useState({
    Name: "",
    EmailId: "",
    image: "",
    AiRating: "",
    AppliedOn: "",
    Tag: "",
  });

  let handleChange = (e) => {
    setform({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
     const formData = new FormData();
  formData.append("Name", form.Name);
  formData.append("EmailId", form.EmailId);
  formData.append("image", form.image); // file, not URL
  formData.append("AiRating", form.AiRating);
  formData.append("AppliedOn", form.AppliedOn);
  formData.append("Tag", form.Tag);
    try {
      let data = await fetch(`${import.meta.env.VITE_API_URL}/candidates`, {
        method: "POST",
        body: formData,
      });
      let result = await data.json();
      if (result) {
        setform({
          Name: "",
          EmailId: "",
          image: "",
          AiRating: "",
          AppliedOn: "",
          Tag: "",
        });
      }
      if(result) {
        alert("Candidate added successfully");
        navigate("/");
      }
    } catch (error) {
      console.log("Error in adding candidate:", error);
    }
  };
  return (
    <>
      <div className="mt-10 flex flex-col items-center">
        <h1 className="text-center font-bold text-3xl">Add A New Candidate</h1>
        <form
          className="h-full w-[60%] mt-5 flex flex-col gap-3 border p-8"
          onSubmit={handleSubmit}
        >
          {/* name */}
          <div className="flex flex-col">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="Name"
              className="border px-2 py-1 rounded-md"
              onChange={handleChange}
              value={form.Name}
              required
            />
          </div>
          {/* email */}
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="EmailId"
              className="border px-2 py-1 rounded-md"
              onChange={handleChange}
              value={form.EmailId}
              required
            />
          </div>
          {/* image url */}
          <div className="flex flex-col">
            <label htmlFor="image">Image Url</label>
            <input
              type="file"
              id="image"
              name="image"
              className="border px-2 py-1 rounded-md"
              // value={form.ImageUrl}
              onChange={(e) => {
                setform({
                  ...form,
                  image: e.target.files[0], // keep actual File object
                });
              }}
              required
            />
          </div>
          {/* ai rating */}
          <div className="flex flex-col">
            <label htmlFor="ai_rating">AI Rating</label>
            <input
              type="Number"
              id="ai_rating"
              name="AiRating"
              className="border px-2 py-1 rounded-md"
              onChange={handleChange}
              min={1}
              max={100}
              value={form.AiRating}
              required
            />
          </div>
          {/* appied on */}
          <div className="flex flex-col">
            <label htmlFor="applied_on">Applied On</label>
            <input
              type="date"
              id="applied_on"
              name="AppliedOn"
              className="border px-2 py-1 rounded-md"
              onChange={handleChange}
              value={form.AppliedOn}
              required
            />
          </div>
          {/* tag */}
          <div className="flex flex-col">
            <label htmlFor="tag">Tag</label>
            <select
              name="Tag"
              id="tag"
              className="border px-2 py-1 rounded-md"
              onChange={handleChange}
              value={form.Tag}
              required
            >
              <option value="">Select Tag</option>
              <option value="No Tag">No Tag</option>
              <option value="Potencial Fit">Potencial Fit</option>
              <option value="Average Portfolio">Average Portfolio</option>
              <option value="Strong Portfolio">Strong Portfolio</option>
            </select>
          </div>

          <button className="border bg-slate-400 w-[20%]">Submit</button>
        </form>
      </div>
    </>
  );
};

export default AddCandidate;
