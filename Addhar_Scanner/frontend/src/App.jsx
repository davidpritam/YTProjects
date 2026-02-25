import { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

function App() {
  const webcamRef = useRef(null);

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "",
    father: "",
    address: ""
  });

  const captureAndScan = async () => {
    console.log("Button clicked");
    try {
      setLoading(true);

      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);

      const blob = await fetch(imageSrc).then(res => res.blob());

      const form = new FormData();
      form.append("image", blob, "aadhar.jpg");

      const response = await axios.post(
        "http://localhost:5000/scan-aadhar",
        form
      );

      setFormData(response.data);
      setLoading(false);

    } catch (error) {
      console.error(error);
      setLoading(false);
      alert("Error scanning image");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Aadhar OCR Scanner (Vite + React)</h2>

      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={350}
      />

      <br /><br />

      <button onClick={captureAndScan}>
        Capture & Extract
      </button>

      {loading && <p>Processing OCR... Please wait ⏳</p>}

      {image && (
        <>
          <h3>Captured Image</h3>
          <img src={image} alt="aadhar" width={350} />
        </>
      )}

      <h3>Auto Filled Form</h3>

      <input
        placeholder="Name"
        value={formData.name}
        onChange={e => setFormData({...formData, name: e.target.value})}
      />
      <br /><br />

      <input
        placeholder="Date of Birth"
        value={formData.dob}
        onChange={e => setFormData({...formData, dob: e.target.value})}
      />
      <br /><br />

      <input
        placeholder="Gender"
        value={formData.gender}
        onChange={e => setFormData({...formData, gender: e.target.value})}
      />
      <br /><br />

      <input
        placeholder="Father Name"
        value={formData.father}
        onChange={e => setFormData({...formData, father: e.target.value})}
      />
      <br /><br />

      <textarea
        placeholder="Address"
        rows="4"
        cols="40"
        value={formData.address}
        onChange={e => setFormData({...formData, address: e.target.value})}
      />
    </div>
  );
}

export default App;