import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingMode, setEditingMode] = useState(null);
  const { isAuthorized, user } = useContext(Context);

  const navigateTo = useNavigate();
  
  //Fetching all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          `${API}/api/v1/job/getmyjobs`,
          { withCredentials: true }
        );
        setMyJobs(data.myJobs);
      } catch (error) {
        toast.error(error.response.data.message);
        setMyJobs([]);
      }
    };
    fetchJobs();
  }, []);
  if (!isAuthorized || (user && user.role !== "Employer")) {
    navigateTo("/");
  }

  //Function For Enabling Editing Mode
  const handleEnableEdit = (jobId) => {
    setEditingMode(jobId);
  };

  //Function For Disabling Editing Mode
  const handleDisableEdit = () => {
    setEditingMode(null);
  };

  //Function For Updating The Job
  const handleUpdateJob = async (jobId) => {
    const updatedJob = myJobs.find((job) => job._id === jobId);
    await axios
      .put(`${API}/api/v1/job/update/${jobId}`, updatedJob, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setEditingMode(null);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  //Function For Deleting Job
  const handleDeleteJob = async (jobId) => {
    await axios
      .delete(`${API}/api/v1/job/delete/${jobId}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const handleInputChange = (jobId, field, value) => {
    setMyJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, [field]: value } : job
      )
    );
  };

  return (
    <div className="myJobs page" style={{ cursor: "default" }}>
      <div className="container">
        <h1>Your Posted Jobs</h1>
        {myJobs.length > 0 ? (
          <>
            <div className="banner">
              {myJobs.map((element) => (
                <div className="card" key={element._id} style={{ cursor: "pointer" }}>
                  <div className="content">
                    <div className="short_fields">
                      <div>
                        <span>Title:</span>
                        <input
                          type="text"
                          disabled={editingMode !== element._id}
                          value={element.title}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "title",
                              e.target.value
                            )
                          }
                          style={{ cursor: editingMode === element._id ? "text" : "not-allowed" }}
                        />
                      </div>
                      <div>
                        <span>Country:</span>
                        <input
                          type="text"
                          disabled={editingMode !== element._id}
                          value={element.country}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "country",
                              e.target.value
                            )
                          }
                          style={{ cursor: editingMode === element._id ? "text" : "not-allowed" }}
                        />
                      </div>
                      <div>
                        <span>City:</span>
                        <input
                          type="text"
                          disabled={editingMode !== element._id}
                          value={element.city}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "city",
                              e.target.value
                            )
                          }
                          style={{ cursor: editingMode === element._id ? "text" : "not-allowed" }}
                        />
                      </div>
                      <div>
                        <span>Category:</span>
                        <select
                          value={element.category}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "category",
                              e.target.value
                            )
                          }
                          disabled={editingMode !== element._id}
                          style={{ cursor: editingMode === element._id ? "pointer" : "not-allowed" }}
                        >
                          <option value="">Select Category</option>
                          <optgroup label="Technology & IT">
                            <option value="Frontend Development (React, Angular, Vue)">Frontend Development</option>
                            <option value="Backend Development (Node.js, Python, Java)">Backend Development</option>
                            <option value="Full Stack Development">Full Stack Development</option>
                            <option value="Mobile App Development (iOS, Android)">Mobile App Development</option>
                            <option value="DevOps / Cloud Engineering (AWS, Azure, Docker)">DevOps / Cloud Engineering</option>
                            <option value="Data Science & Machine Learning">Data Science & ML</option>
                            <option value="Artificial Intelligence (AI)">Artificial Intelligence</option>
                            <option value="Cybersecurity">Cybersecurity</option>
                          </optgroup>
                          <optgroup label="Business & Management">
                            <option value="Project Management (Agile, Scrum)">Project Management</option>
                            <option value="Product Management">Product Management</option>
                            <option value="Business Analysis">Business Analysis</option>
                            <option value="Digital Marketing (SEO, PPC, Social Media)">Digital Marketing</option>
                            <option value="Human Resources (HR)">Human Resources</option>
                            <option value="Sales & Business Development">Sales & Business Dev</option>
                          </optgroup>
                          <optgroup label="Creative & Design">
                            <option value="UI/UX Design">UI/UX Design</option>
                            <option value="Graphic Design">Graphic Design</option>
                            <option value="Motion Graphics & Animation">Motion Graphics</option>
                            <option value="Video Editing & Production">Video Editing</option>
                            <option value="3D Modeling & Rendering">3D Modeling</option>
                          </optgroup>
                        </select>
                      </div>
                      <div>
                        <span>
                          Salary:{" "}
                          {element.fixedSalary ? (
                            <input
                              type="number"
                              disabled={editingMode !== element._id}
                              value={element.fixedSalary}
                              onChange={(e) =>
                                handleInputChange(
                                  element._id,
                                  "fixedSalary",
                                  e.target.value
                                )
                              }
                              style={{ cursor: editingMode === element._id ? "text" : "not-allowed" }}
                            />
                          ) : (
                            <div>
                              <input
                                type="number"
                                disabled={editingMode !== element._id}
                                value={element.salaryFrom}
                                onChange={(e) =>
                                  handleInputChange(
                                    element._id,
                                    "salaryFrom",
                                    e.target.value
                                  )
                                }
                                style={{ cursor: editingMode === element._id ? "text" : "not-allowed" }}
                              />
                              <input
                                type="number"
                                disabled={editingMode !== element._id}
                                value={element.salaryTo}
                                onChange={(e) =>
                                  handleInputChange(
                                    element._id,
                                    "salaryTo",
                                    e.target.value
                                  )
                                }
                                style={{ cursor: editingMode === element._id ? "text" : "not-allowed" }}
                              />
                            </div>
                          )}
                        </span>
                      </div>
                      <div>
                        <span>Expired:</span>
                        <select
                          value={element.expired}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "expired",
                              e.target.value
                            )
                          }
                          disabled={editingMode !== element._id}
                          style={{ cursor: editingMode === element._id ? "pointer" : "not-allowed" }}
                        >
                          <option value={true}>TRUE</option>
                          <option value={false}>FALSE</option>
                        </select>
                      </div>
                    </div>
                    <div className="long_field">
                      <div>
                        <span>Description:</span>{" "}
                        <textarea
                          rows={5}
                          value={element.description}
                          disabled={editingMode !== element._id}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "description",
                              e.target.value
                            )
                          }
                          style={{ cursor: editingMode === element._id ? "text" : "not-allowed" }}
                        />
                      </div>
                      <div>
                        <span>Location: </span>
                        <textarea
                          value={element.location}
                          rows={5}
                          disabled={editingMode !== element._id}
                          onChange={(e) =>
                            handleInputChange(
                              element._id,
                              "location",
                              e.target.value
                            )
                          }
                          style={{ cursor: editingMode === element._id ? "text" : "not-allowed" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="button_wrapper">
                    <div className="edit_btn_wrapper">
                      {editingMode === element._id ? (
                        <>
                          <button
                            onClick={() => handleUpdateJob(element._id)}
                            className="check_btn"
                            style={{ cursor: "pointer" }}
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleDisableEdit()}
                            className="cross_btn"
                            style={{ cursor: "pointer" }}
                          >
                            <RxCross2 />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEnableEdit(element._id)}
                          className="edit_btn"
                          style={{ cursor: "pointer" }}
                        >
                          Edit
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteJob(element._id)}
                      className="delete_btn"
                      style={{ cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>
            You've not posted any job or may be you deleted all of your jobs!
          </p>
        )}
      </div>
    </div>
  );
};

export default MyJobs;