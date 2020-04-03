import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    axios.get('/api/folders').then(res => {
      setFiles(res.data);
    }).catch(err => console.log('error loading files', err))
  }, []);

  const selectFile = e => setSelectedFile(files.find(f => f.id === e.target.value));

  const updateApi = e => {
    e.preventDefault();
    axios.put(`/api/files/${selectedFile.id}`).then(res => {
      console.log('done pushing===>>', res.data);
      if (res.data.status) {
        alert('File pushed to API!!!');
      } else {
        alert(JSON.stringify(res.data));
      }
    }).catch(err => console.log('err pushing files==>>>', err));
  }

  return (
    <div className="App mt-3">
      <div className="container">
        <form onSubmit={updateApi}>
          <select onChange={selectFile} required className="form-control mb-3">
            <option value="">Select a File</option>)}
            {files.map(file => <option key={file.id} value={file.id}>{file.name}</option>)}
          </select>
          <button className="btn btn-success">Push to API</button>
        </form>
      </div>
    </div>
  );
}

export default App;
