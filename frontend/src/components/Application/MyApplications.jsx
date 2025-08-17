import { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";

const API = import.meta.env.VITE_API_URL;

const MyApplications = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeFileUrl, setResumeFileUrl] = useState("");

  const navigateTo = useNavigate();

  useEffect(() => {
    try {
      if (user && user.role === "Employer") {
        axios
          .get(`${API}/api/v1/application/employer/getall`, {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      } else {
        axios
          .get(`${API}/api/v1/application/jobseeker/getall`, {
            withCredentials: true,
          })
          .then((res) => {
            setApplications(res.data.applications);
          });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error loading applications");
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    navigateTo("/");
  }

  const deleteApplication = (id) => {
    try {
      axios
        .delete(`${API}/api/v1/application/delete/${id}`, {
          withCredentials: true,
        })
        .then((res) => {
          toast.success(res.data.message);
          setApplications((prevApplication) =>
            prevApplication.filter((application) => application._id !== id)
          );
        });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting application");
    }
  };

  const openModal = (fileUrl) => {
    setResumeFileUrl(fileUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <section className="my_applications page">
      {user && user.role === "Job Seeker" ? (
        <div className="container">
          <center>
            <h1>My Applications</h1>
          </center>
          {applications.length <= 0 ? (
            <center>
              <h4>No Applications Found</h4>
            </center>
          ) : (
            applications.map((element) => (
              <JobSeekerCard
                element={element}
                key={element._id}
                deleteApplication={deleteApplication}
                openModal={openModal}
              />
            ))
          )}
        </div>
      ) : (
        <div className="container">
          <center>
            <h1>Applications From Job Seekers</h1>
          </center>
          {applications.length <= 0 ? (
            <center>
              <h4>No Applications Found</h4>
            </center>
          ) : (
            applications.map((element) => (
              <EmployerCard
                element={element}
                key={element._id}
                openModal={openModal}
              />
            ))
          )}
        </div>
      )}
      {modalOpen && <ResumeModal fileUrl={resumeFileUrl} onClose={closeModal} />}
    </section>
  );
};

export default MyApplications;

const getFileType = (url) => {
  if (url.endsWith(".pdf")) return "pdf";
  if (url.endsWith(".doc") || url.endsWith(".docx")) return "doc";
  return "image";
};

const JobSeekerCard = ({ element, deleteApplication, openModal }) => {
  const fileType = getFileType(element.resume.url);

  return (
    <div className="job_seeker_card" style={{ marginBottom: "20px" }}>
      <div className="detail">
        <p><span>Name:</span> {element.name}</p>
        <p><span>Email:</span> {element.email}</p>
        <p><span>Phone:</span> {element.phone}</p>
        <p><span>Address:</span> {element.address}</p>
        <p><span>CoverLetter:</span> {element.coverLetter}</p>
      </div>

      <div className="resume">
        {fileType === "image" && (
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
            style={{ cursor: "pointer", maxWidth: "200px", borderRadius: "5px" , marginTop: "10px"}}
          />
        )}
        
        {fileType === "doc" && (
          <a
            href={element.resume.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              cursor: "pointer",
              textDecoration: "none",
              color: "#28a745",
              fontWeight: "bold",
            }}
          >
            ⬇ Download DOC/DOCX
          </a>
        )}
      </div>

      <div className="btn_area" 
     style={{ display: "flex", gap: "12px", marginTop: "15px" }}>
  {fileType === "pdf" && (
    <button
      onClick={() => openModal(element.resume.url)}
      style={{
        cursor: "pointer",
        backgroundColor: "#007bff",
        color: "#fff",
        padding: "8px 16px",
        border: "none",
        borderRadius: "5px",
        fontSize: "14px",
        transition: "0.3s",
        flex: "1"
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
      onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
    >
      📄 View PDF
    </button>
  )}

  <button 
    onClick={() => deleteApplication(element._id)}
    style={{
      cursor: "pointer",
      backgroundColor: "#dc3545",
      color: "#fff",
      padding: "8px 16px",
      border: "none",
      borderRadius: "5px",
      fontSize: "14px",
      transition: "0.3s",
      flex: "1"
    }}
    onMouseOver={(e) => (e.target.style.backgroundColor = "#b02a37")}
    onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
  >
    🗑 Delete Application
  </button>
</div>

    </div>
  );
};

const EmployerCard = ({ element, openModal }) => {
  const fileType = getFileType(element.resume.url);

  return (
    <div className="job_seeker_card">
      <div className="detail">
        <p><span>Name:</span> {element.name}</p>
        <p><span>Email:</span> {element.email}</p>
        <p><span>Phone:</span> {element.phone}</p>
        <p><span>Address:</span> {element.address}</p>
        <p><span>CoverLetter:</span> {element.coverLetter}</p>
      </div>

      <div className="resume">
        {fileType === "image" && (
          <img
            src={element.resume.url}
            alt="resume"
            onClick={() => openModal(element.resume.url)}
            style={{ cursor: "pointer", maxWidth: "150px", borderRadius: "5px" }}
          />
        )}
        {fileType === "pdf" && (
          <button
            onClick={() => openModal(element.resume.url)}
            style={{
              cursor: "pointer",
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "8px 16px",
              border: "none",
              borderRadius: "5px",
              fontSize: "14px",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            📄 View PDF
          </button>
        )}
        {fileType === "doc" && (
          <a
            href={element.resume.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              cursor: "pointer",
              textDecoration: "none",
              color: "#28a745",
              fontWeight: "bold",
            }}
          >
            ⬇ Download DOC/DOCX
          </a>
        )}
      </div>
    </div>
  );
};
