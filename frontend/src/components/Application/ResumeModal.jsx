
const ResumeModal = ({ fileUrl, onClose }) => {
  const getFileType = (url) => {
    if (url.endsWith(".pdf")) return "pdf";
    if (url.endsWith(".doc") || url.endsWith(".docx")) return "doc";
    return "image";
  };

  const fileType = getFileType(fileUrl);

  // Google Docs Viewer fallback (for DOC/DOCX, or if PDF fails)
  const getGoogleViewerUrl = (url) =>
    `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          maxWidth: "90%",
          maxHeight: "90%",
          overflow: "auto",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          ✖
        </button>

        {/* File rendering */}
        {fileType === "pdf" && (
          <iframe
            src={fileUrl}
            title="PDF Resume"
            style={{ width: "80vw", height: "80vh", border: "none" }}
            onError={(e) => {
              e.target.src = getGoogleViewerUrl(fileUrl); // fallback
            }}
          />
        )}

        {fileType === "image" && (
          <img
            src={fileUrl}
            alt="Resume"
            style={{ maxWidth: "80vw", maxHeight: "80vh", borderRadius: "5px" }}
          />
        )}

        {fileType === "doc" && (
          <iframe
            src={getGoogleViewerUrl(fileUrl)}
            title="DOC Resume"
            style={{ width: "80vw", height: "80vh", border: "none" }}
          />
        )}
      </div>
    </div>
  );
};

export default ResumeModal;

