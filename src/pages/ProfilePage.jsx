import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import JobsContext from "../context/JobsContext";

function ProfilePage() {
  const { user, logout, updatedUser } = useContext(AuthContext);
  const {getUserApplication, jobs} = useContext(JobsContext);
  const navigate = useNavigate(); 

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    skills: "",
    experience: "",
    companyName: "",
    companyDescription: "",
    skillsRequired: "",
    experienceRequired: "", 
  });
  const [snapshort, setsnapshort] = useState(null); 

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    setFormData({
      name: user.name ?? "", 
      bio: user.bio ?? "",
      location: user.location ?? "",
      skills: user.skills ?? "",
      experience: user.experience ?? "",
      companyName: user.companyName ?? "",
      companyDescription: user.companyDescription ?? "",
      skillsRequired: user.skillsRequired ?? "",
      experienceRequired: user.experienceRequired ?? "",
    });
  }, [user, navigate]); 

  function handleChange(event) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }
  
  function handleSave() {
    const success = updatedUser(formData);
    if (success) {
      setIsEditing(true);
    }
  }
  function handleEdit() {
    setsnapshort(formData)
    setIsEditing(true);
  }
  function handleCancel() {
    setFormData(snapshort)
    setIsEditing(false); 
  }

  function handleLogout() {
    logout();
    navigate("/");
  }
  
  if (!user) return null; 

  const appliedCount = getUserApplication(user.email).length; 
  const postedCount = jobs.filter((job) => job.postedBy === user.email).length

  function renderField(label, name) {
    return (
      <div className="border-b border-slate-200 pb-4">
        <p className="text-sm text-slate-600 mb-1">{label}</p> 
        {isEditing ? (
          name === "bio" ? (
            <textarea
            name={name}
            value={formData[name]}
            onChange={handleChange}
            rows={4} 
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
          ) : (
          <input
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />
          )
        ) : ( 
          <p className="text-base text-slate-900 whitespace-pre-line">{formData[name] || "—"}</p> 
        )}
      </div>
    ); 
  }
   return (
    <div className="min-h-screen w-full bg-[#0B132B] overflow-x-hidden"> 
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 sm:px-6 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between max-w-7xl mx-auto w-full">
          <div className="text-lg font-semibold text-slate-900">JobBoard</div>
          <div className="flex flex-wrap gap-2">
            {user.isEmployer && (
              <>
                <button
                  onClick={() => navigate("/post-job")}
                  className="px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Post a job
                </button>
                <button
                  onClick={() => navigate("/manage-jobs")}
                  className="px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Manage jobs
                </button>
              </>
            )}
            <button
              onClick={() => navigate("/home")}
              className="px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-sm text-white bg-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Title row: stacks on phones, row from sm up */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-amber-200">Profile</h1>
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm text-white border border-slate-300 rounded-lg hover:bg-slate-600 cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm text-white border border-slate-300 rounded-lg hover:bg-slate-600 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleEdit}
              className="self-start sm:self-auto px-4 py-2 text-sm text-white border border-slate-800 rounded-lg hover:bg-slate-600 cursor-pointer"
            >
              Edit
            </button>
          )}
        </div>

        {/* Profile card */}
        <div className="bg-blue-100 border border-slate-200 rounded-lg p-4 sm:p-6 flex flex-col gap-4 w-full min-w-0">
          {!user.isEmployer && (
            <>
              {renderField("Name", "name")}
              {renderField("Bio", "bio")}
              {renderField("Location", "location")}
              {renderField("Skills", "skills")}
              {renderField("Experience", "experience")}
              <div className="border-b border-slate-200 pb-4">
                <p className="text-sm text-slate-600 mb-1">Jobs applied</p>
                <p className="text-base font-medium text-slate-900">{appliedCount}</p>
              </div>
            </>
          )}

          {user.isEmployer && (
            <>
              {renderField("Company name", "companyName")}
              {renderField("Company description", "companyDescription")}
              {renderField("Skills required", "skillsRequired")}
              {renderField("Experience required", "experienceRequired")}
              <div className="border-b border-slate-200 pb-4">
                <p className="text-sm text-slate-600 mb-1">Jobs posted</p>
                <p className="text-base font-medium text-slate-900">{postedCount}</p>
              </div>
            </>
          )}

          <div>
            <p className="text-sm text-slate-600 mb-1">Email</p>
            <p className="text-base font-medium text-slate-900 break-all">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage; 