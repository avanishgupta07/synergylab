import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // Make sure you include Bootstrap in index.html or App.css

function App() {
  const [data, setData] = useState([]);
  const [id, setId] = useState(null); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);

  // Fetch data from JSONPlaceholder
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleEdit = (id) => {
    const user = data.find(item => item.id === id);
    if (user) {
      setIsUpdate(true);
      setId(id);  
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
    }
  };

  const handleDelete = (id) => {
    if (id > 0 && window.confirm("Are you sure you want to delete?")) {
      axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
        .then(() => {
          const updatedData = data.filter(item => item.id !== id);
          setData(updatedData);
        })
        .catch(error => {
          console.error('Error deleting user:', error);
        });
    }
  };

  const handleSave = () => {
    let error = '';

    if (name === '') {
      error += "Please Enter Name\n";
    }
    if (email === '') {
      error += "Please Enter Email\n";
    }
    if (phone === '') {
      error += "Please Enter Phone\n";
    }

    if (error === '') {
      const newUser = {
        id: data.length + 1,  
        name,
        email,
        phone
      };

      axios.post('https://jsonplaceholder.typicode.com/users', newUser)
        .then(response => {
          setData([...data, response.data]);
          handleClear();  
        })
        .catch(error => {
          console.error('Error saving user:', error);
        });
    } else {
      alert(error);  
    }
  };

  const handleUpdate = () => {
    const updatedUser = {
      id,
      name,
      email,
      phone
    };

    axios.put(`https://jsonplaceholder.typicode.com/users/${id}`, updatedUser)
      .then(() => {
        const updatedData = data.map(item =>
          item.id === id ? updatedUser : item
        );
        setData(updatedData);
        handleClear();  
      })
      .catch(error => {
        console.error('Error updating user:', error);
      });
  };

  const handleClear = () => {
    setId(null);  
    setName('');
    setEmail('');
    setPhone('');
    setIsUpdate(false);  
  };

  return (
    <div className="container mt-4">
      {/* Form Section */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Name"
            value={name}  
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter Email"
            value={email}  
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-3">
          <label>Phone:</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Phone"
            value={phone}  
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="col-md-12 d-flex justify-content-end">
          {!isUpdate ? (
            <button className="btn btn-primary me-2" onClick={handleSave}>Save</button>
          ) : (
            <button className="btn btn-primary me-2" onClick={handleUpdate}>Update</button>
          )}
          <button className="btn btn-secondary" onClick={handleClear}>Clear</button>
        </div>
      </div>

      {/* Table Section */}
      <div className="row">
        <div className="col-md-12">
          <table className="table table-striped table-bordered table-responsive">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Sr. No</th>
                {/* <th scope="col">Id</th> */}
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  {/* <td>{item.id}</td> */}
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>
                    <button className="btn btn-warning me-2" onClick={() => handleEdit(item.id)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
