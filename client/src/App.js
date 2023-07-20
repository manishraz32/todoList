import { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';


function App() {
  const [tasks, setTasks] = useState();
  const [inputVal, setInputVal] = useState("");

  const getTasks = async () => {
    console.log("getTasks called");
    try {
      const response = await axios.get(`http://localhost:8080/tasks`);
      console.log(response);
      if (response.status === 200) {
        const data = response?.data?.tasks;
        console.log("data", data);
        setTasks((prvData) => data);
      } else {
        console.log(`data not found`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleOnClick = async (e) => {
    e.preventDefault();
    if (inputVal.trim() === '') {
      alert("Please enter valid Task");
      return;
    }
    try {
      const { data } = await axios.post(`http://localhost:8080/task`, {
        "task": inputVal,
      })
      if (data.success === true) {
        getTasks();
      }

    } catch (error) {
      console.log(error);
    }
    setInputVal("");
  }

  // delete item
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`http://localhost:8080/task/${id}`);
      getTasks();
    } catch (error) {
      console.log(error);
    }
  }

  //update items
  const handleUpdate = async (id) => {
    try {
      const { data } = await axios.put(`http://localhost:8080/task/${id}`, { "done": true });
      if (data.success === true) {
        getTasks();
      }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    getTasks();
  }, [inputVal]);

  return (
    <div className="App w-full flex-col">
      <form
        onSubmit={(e) => handleOnClick(e)}
        className="flex items-center mt-10"
      >
        <input
          type="text"
          placeholder="Enter Task"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="w-[400px] px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-400"
        />
        <button
          onClick={(e) => handleOnClick(e)}
          className="w-[100px] ml-2 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-400"
        >add Task
        </button>
      </form>
      <div className="mt-5">
        {
          tasks && tasks.map((t) => (
            <div className="mb-2 flex">
              <div
                contentEditable
                key={t._id}
                onClick={() => handleUpdate(t._id)}
                className={`w-[400px] text-lg font-medium cursor-pointer ${t.done ? 'line-through' : ''} bg-slate-500 mr-2`}
              >
                {t.task}
              </div>
              <button
                onClick={() => handleDelete(t._id)}
                className="w-[100px] px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-400"
              >
                Delete
              </button>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
