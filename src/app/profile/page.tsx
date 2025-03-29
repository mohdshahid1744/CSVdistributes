"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Select from "react-select";
import React from "react";


const countryOptions = [
  { value: "+1", label: "🇺🇸 +1 (USA)" },
  { value: "+91", label: "🇮🇳 +91 (India)" },
  { value: "+44", label: "🇬🇧 +44 (UK)" },
  { value: "+61", label: "🇦🇺 +61 (Australia)" },
  { value: "+971", label: "🇦🇪 +971 (UAE)" },
];
interface AssignedItem {
    _id: string;
    name: string;
    mobile: string;
    details: string;
  }

  interface Agent {
    _id: string;
    name: string;
    mobile: string;
    email:string;
    assignedItems: AssignedItem[]; 
  }
function ProfilePage() {
    
      
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [agentLoading, setAgentLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [emailError, setEmailError] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [agentData, setAgentData] = useState({
    name: "",
    email: "",
    mobile: "",
    countryCode: "+91",
    password: "",
  });

 
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const fetchAgents = async () => {
    try {
      const res = await axios.get<{ agents: Agent[] }>("/api/users/agent");
      console.log("Response:", res.data);
      setAgents(res.data.agents); 
    } catch (error) {
      console.error("Error fetching agents:", error);
    }
  };
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("/api/users/me"); 
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        router.push("/login"); 
      }
    };

    checkAuth();
  }, [router]);
 
  useEffect(() => {
    fetchAgents();
  }, []);
  
  if (!isAuthenticated) {
    return null; 
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; 
    if (!file) return;
  
    if (agents.length === 0) {
      toast.error("No agents available to distribute the file!");
      return;
    }
  
    const agentIds = agents.map((agent) => agent._id); 
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("agentIds", JSON.stringify(agentIds)); 
  
    uploadFile(formData);
  };
  
  
  const uploadFile = async (formData: FormData) => {
    try {
      const res = await fetch("/api/users/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
      
      if (res.ok) {
        setMessage("File uploaded successfully!");
        toast.success("File uploaded successfully!");
  
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(data.error || "Upload failed");
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload failed", error);
      setMessage("Upload failed. Please try again.");
      toast.error("Upload failed. Please try again.");
    }
  };
  
  


  const logout = async () => {
    setLoading(true);
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
      router.refresh(); 
    } catch (error: any) {
      toast.error("Failed to log out. Try again!");
    } finally {
      setLoading(false);
    }
  };
  

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setAgentLoading(true);
    setErrors({ name: "", email: "", mobile: "", password: "" });

    let formErrors: typeof errors = { name: "", email: "", mobile: "", password: "" };

    if (!agentData.name.trim()) {
      formErrors.name = "Name is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(agentData.email)) {
      formErrors.email = "Please enter a valid email address.";
    }

    if (agentData.password.length < 6) {
      formErrors.password = "Password must be at least 6 characters long.";
    }

    const mobileLengthRules: { [key: string]: number } = {
      "+91": 10, 
      "+1": 10, 
      "+44": 10, 
      "+61": 9, 
      "+971": 9,
    };

    const expectedLength = mobileLengthRules[agentData.countryCode] || 10;
    if (agentData.mobile.length !== expectedLength) {
      formErrors.mobile = `Mobile number must be ${expectedLength} digits for this country.`;
    }

    if (Object.values(formErrors).some((error) => error)) {
      setErrors(formErrors);
      setAgentLoading(false);
      return;
    }

    try {
      await axios.post("/api/users/agent", {
        ...agentData,
        mobile: `${agentData.countryCode}${agentData.mobile}`,
      });
      toast.success("Agent created successfully!");
      setIsModalOpen(false);
      setAgentData({ name: "", email: "", mobile: "", countryCode: "+91", password: "" });
      fetchAgents();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create agent.");
    } finally {
      setAgentLoading(false);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    try {
      const response = await fetch(`/api/users/agent/${agentId}`, {
        method: "DELETE",
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message);
  
        setAgents((prevAgents) => prevAgents.filter((agent) => agent._id !== agentId));
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error deleting agent:", error);
    }
  };
  
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-5 relative">
      <h2 className="text-2xl font-bold text-center mt-5">Agents List</h2>

<button
  onClick={() => setIsModalOpen(true)}
  className="absolute top-5 left-5 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md transition duration-300"
>
  Create Agent
</button>

<button
  onClick={logout}
  disabled={loading}
  className={`absolute top-5 right-5 py-2 px-4 rounded-lg font-semibold shadow-md transition duration-300 ${
    loading ? "bg-red-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
  }`}
>
  {loading ? "Logging out..." : "Logout"}
</button>

<label className="absolute top-5 left-40 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md cursor-pointer flex items-center gap-2">
  📁 Upload
  <input
    type="file"
    accept=".csv, .xlsx, .xls"
    className="hidden"
    onChange={handleFileChange}
  />
</label>
{message && (
  <p className="mt-2 text-green-500 text-center">{message}</p>
)}

{selectedFile && (
  <p className="mt-2 text-sm text-gray-400">
    Selected File: {selectedFile.name}
  </p>
)}

<div className="mt-10 w-full max-w-4xl">
  {agents.length === 0 ? (
    <p className="text-center text-gray-400">No agents found.</p>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.isArray(agents) ? (
  agents.map((agent) => (
    <div
      key={agent._id}
      className="relative bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer"
      onClick={() => setSelectedAgent(agent)} 
    >
      <button
        onClick={(e) => {
          e.stopPropagation(); 
          handleDeleteAgent(agent._id);
        }}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xl"
      >
        ✖
      </button>
      <h3 className="text-lg font-semibold">{agent.name}</h3>
      <p className="text-gray-400">{agent.email}</p>
      <p className="text-gray-400">{agent.mobile}</p>
    </div>
  ))
) : (
  <p>No agents found</p>
)}

    </div>
  )}
</div>
<div>
{selectedAgent && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
    <div className="relative bg-gray-900 p-6 rounded-lg shadow-lg w-3/4 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800">
      
      <div className="sticky top-0 bg-gray-900 py-2 flex justify-end z-10">
        <button
          onClick={() => setSelectedAgent(null)}
          className="text-white text-xl"
        >
          ✖
        </button>
      </div>

      <h2 className="text-2xl font-bold text-white">{selectedAgent.name}</h2>
      <p className="text-gray-400">{selectedAgent.email}</p>
      <p className="text-gray-400">{selectedAgent.mobile}</p>

      <h3 className="text-xl font-semibold mt-4 text-white">Assigned Items</h3>
      {selectedAgent?.assignedItems && selectedAgent.assignedItems.length > 0 ? (
        <ul className="mt-2">
          {selectedAgent.assignedItems.map((item: AssignedItem, index: number) => (
            <React.Fragment key={index}>
              <li className="text-gray-300 pb-3">
                <strong>Name:</strong> {item.name} <br />
                <strong>Mobile:</strong> {item.mobile} <br />
                <strong>Notes:</strong> {item.details}
              </li>
              {index !== selectedAgent.assignedItems.length - 1 && (
                <hr className="my-3 border-gray-500" />
              )}
            </React.Fragment>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No items assigned.</p>
      )}
    </div>
  </div>
)}





    </div>


      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-4">Create Agent</h2>

            <form onSubmit={handleCreateAgent} className="flex flex-col gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={agentData.name}
                  onChange={(e) => setAgentData({ ...agentData, name: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={agentData.email}
                  onChange={(e) => setAgentData({ ...agentData, email: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="flex gap-2">
                <Select
                  options={countryOptions}
                  value={countryOptions.find((option) => option.value === agentData.countryCode)}
                  onChange={(selectedOption) =>
                    setAgentData({ ...agentData, countryCode: selectedOption?.value || "+91" })
                  }
                  className="w-1/3"
                  formatOptionLabel={(option) => (
                    <div className="flex items-center gap-2">
                      <span>{option.label}</span>
                    </div>
                  )}
                />

                <div className="w-2/3">
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    value={agentData.mobile}
                    onChange={(e) => setAgentData({ ...agentData, mobile: e.target.value })}
                    className="border p-2 rounded w-full"
                    required
                  />
                  {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
                </div>
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={agentData.password}
                  onChange={(e) => setAgentData({ ...agentData, password: e.target.value })}
                  className="border p-2 rounded w-full"
                  required
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={agentLoading}
                className={`py-2 px-4 rounded-lg font-semibold shadow-md transition duration-300 ${
                  agentLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {agentLoading ? "Creating..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
