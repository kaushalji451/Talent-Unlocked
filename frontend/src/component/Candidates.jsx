import { useState, useEffect } from "react";
import EditCandidate from "./EditCandidate";
import BulkUpdate from "./BulkUpdate";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Candidates = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [filters, setFilters] = useState({
    position: "",
    appliedOn: "",
    aiRating: "",
  });

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  let filteredData = null;

  const applyFilters = () => {
    setPage(1); // Reset to page 1 when filters are applied
    fetchData({ ...filtersToQuery(filters), page: 1 });
  };

  const resetFilters = () => {
    setFilters({ position: "", from: "", to: "", aiRating: "" });
    setPage(1);
    fetchData({ page: 1, limit: 10 });
  };

  const filtersToQuery = (filters) => {
    const { appliedOn, position, aiRating } = filters;
    return {
      position: position || undefined,
      appliedOn: appliedOn || undefined,
      gte: aiRating === "above8" ? 8 : undefined,
      lte: aiRating === "below7" ? 7 : undefined,
    };
  };
 

  const fetchData = async ({
    page = 1,
    limit = 10,
    position,
    appliedOn,
    gte,
    lte,
  } = {}) => {
    try {
      const params = new URLSearchParams({ page, limit });
      setLoading(true);
      if (position) params.append("position", position);
      if (appliedOn) params.append("appliedOn", appliedOn);
      if (gte !== undefined) params.append("gte", gte);
      if (lte !== undefined) params.append("lte", lte);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/candidates?${params}`);
      const result = await res.json();

      if (result) {
        setData(result.data);
        setTotal(result.total);
        setPage(result.page);
        setPages(result.pages);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }finally{
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/candidates/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    const result = await res.json();
    if (result) {
      alert("Deleted Successfully");
      fetchData({ page, ...filtersToQuery(filters) });
    } else {
      alert("Error in Deletion");
    }
  };

  useEffect(() => {
    fetchData({ page });
  }, []);

  const displayData = filteredData !== null ? filteredData : data;

  const [ids, setIds] = useState([]);
  const handleCheckBox = (id, checked) => {
    if (checked) {
      setIds((prev) => [...prev, id]);
    } else {
      setIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchData({ page: newPage, ...filtersToQuery(filters) });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-2"
    >
      {/* Header */}
      <div className="flex flex-wrap justify-between gap-4 py-4 items-center">
        <p className="text-zinc-600 text-sm md:text-base">
          Showing {displayData?.length || 0} out of {total}
        </p>
        <BulkUpdate ids={ids} setIds={setIds} refreshCallback={fetchData} />

        <div className="flex flex-wrap gap-3 items-center bg-white p-3 rounded-md border border-slate-300">
          <select
            value={filters.position}
            onChange={(e) => setFilters({ ...filters, position: e.target.value })}
            className="border border-slate-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="">All Positions</option>
            <option value="technical_role">Technical</option>
            <option value="business_role">Business</option>
          </select>

          <input
            type="date"
            value={filters.appliedOn}
            onChange={(e) => setFilters({ ...filters, appliedOn: e.target.value })}
            className="border border-slate-300 rounded-md px-3 py-1 text-sm"
            placeholder="Applied On"
          />

          <select
            value={filters.aiRating}
            onChange={(e) => setFilters({ ...filters, aiRating: e.target.value })}
            className="border border-slate-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="">All Ratings</option>
            <option value="below7">Below 7</option>
            <option value="above8">Above 8</option>
          </select>

          <button
            disabled = {loading}
            onClick={applyFilters}
            className="border px-3 py-1 rounded-md text-sm bg-blue-50"
          >
            {!loading ? "Apply Filters" : "Filtering"}
          </button>

          <button
            onClick={resetFilters}
            className="border px-3 py-1 rounded-md text-sm bg-red-100 text-red-700"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border border-slate-300 bg-slate-100 w-full h-[80vh] pb-10">
        <table className="text-sm text-zinc-700 w-full">
          <thead className="bg-slate-200 text-zinc-600 font-medium">
            <tr>
              <th className="p-3">-</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">AI Rating</th>
              <th className="p-3">Applied on</th>
              <th className="p-3">Tags</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {displayData.map((candidate) => (
              <motion.tr
                key={candidate._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full border-b border-gray-200 hover:bg-slate-300"
              >
                <td className="p-3 align-middle">
                  <input
                    type="checkbox"
                    className="size-4"
                    checked={ids.includes(candidate._id)}
                    onChange={(e) => handleCheckBox(candidate._id, e.target.checked)}
                  />
                </td>
                <td className="p-3 align-middle font-semibold text-black">{candidate.username?.toUpperCase()}</td>
                <td className="p-3 align-middle font-semibold text-black">{candidate.email}</td>
                <td className="p-3 align-middle">
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded-md text-sm">
                    {candidate.status}
                  </span>
                </td>
                <td className="p-3 align-middle">{candidate.aiRating}%</td>
                <td className="p-3 align-middle">{candidate.appliedOn?.split("T")[0]}</td>
                <td className="p-3 align-middle text-sm">{candidate.tag}</td>
                <td className="p-3 align-middle">
                  <div className="flex justify-end items-center gap-2">
                    <Link to={candidate.cvUrl} className="border px-2 py-1 text-sm rounded-sm border-slate-400">View CV</Link>
                    <div className="relative">
                      <button
                        className="px-2 text-xl"
                        onClick={() =>
                          setOpenDropdown(openDropdown === candidate._id ? null : candidate._id)
                        }
                      >
                        ⋮
                      </button>
                      {openDropdown === candidate._id && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute right-0 mt-2 w-28 bg-white border border-gray-300 rounded shadow-lg z-10"
                        >
                          <EditCandidate
                            Candidate_id={candidate._id}
                            fetchData={fetchData}
                            setOpenDropdown={setOpenDropdown}
                          />
                          <button
                            onClick={() => handleDelete(candidate._id)}
                            className="block w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 text-sm"
                          >
                            Delete
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
          className="px-3 py-1 rounded-md bg-gray-100 border border-gray-300 disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={`px-3 py-1 rounded-md border ${
              page === i + 1 ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page >= pages}
          onClick={() => handlePageChange(page + 1)}
          className="px-3 py-1 rounded-md bg-gray-100 border border-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default Candidates;
