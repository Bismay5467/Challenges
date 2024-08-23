/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState<File | null>();
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<Record<string, string | number>>();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!file) {
      setError("Upload a file");
      return;
    }
    setError("");
    const url = `${import.meta.env.VITE_SERVER_BASE_URL}/financial-flags`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios.post(url, formData, config).then((response) => {
      setData(response.data.flags);
    });
  };

  return (
    <div style={{ padding: "40px" }}>
      <div>
        <div
          style={{
            fontFamily: "sans-serif",
            fontWeight: "bold",
            paddingBlockEnd: "30px",
          }}
        >
          INPUT
        </div>
        <div style={{ marginBlockEnd: "30px" }}>
          <input
            type="file"
            accept="application/json"
            onChange={(e) => setFile((e.target.files ?? [])[0])}
          />
          {error.length > 0 && <p style={{ color: "red" }}>{error}</p>}
        </div>
        <div>
          <button type="submit" onClick={handleSubmit}>
            SUBMIT
          </button>
        </div>
      </div>
      {typeof data === "object" && Object.keys(data).length > 0 && (
        <>
          <div
            style={{
              fontFamily: "sans-serif",
              fontWeight: "bold",
              paddingBlock: "30px",
            }}
          >
            FLAGS
          </div>
          <div>
            {Object.keys(data).map((key) => (
              <li key={key} style={{ fontWeight: "bold" }}>
                {key.split("_").join(" ")} : {data[key]}
              </li>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
