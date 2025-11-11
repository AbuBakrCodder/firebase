import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase/config";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [modal, setModal] = useState(false);

  const getUsers = async () => {
    try {
      const usersData = await getDocs(collection(db, "users"));
      const users = usersData.docs.map((user) => ({
        id: user.id,
        ...user.data(),
      }));
      setData(users);
    } catch (error) {
      toast.error("Error fetching users");
      console.error(error);
    }
  };

  const submit = async () => {
    if (!name || !age) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "users"), {
        name,
        age: Number(age),
      });
      toast.success("User added successfully!");
      setData((prev) => [{ id: docRef.id, name, age: Number(age) }, ...prev]);
      setModal(false);
      setName("");
      setAge("");
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };


  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <Toaster position="top-right" />

      {/* 🔹 Modal */}
      {modal && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          onClick={() => {
            setModal(false);
          }}
          className="fixed top-0 left-0 w-screen h-screen bg-[#00000073] z-50 flex flex-col gap-5 items-center justify-center"
        >
          <div
            className="flex flex-col gap-5 items-center justify-center bg-white w-[500px] p-5 rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-4xl font-bold text-gray-500">
              Create new user
            </h1>

            <div className="w-full flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <label
                  htmlFor="name"
                  className="text-2xl font-semibold text-gray-700"
                >
                  Name
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  name="name"
                  placeholder="Enter name"
                  id="name"
                  className="bg-gray-300 rounded-2xl text-white outline-none px-3 w-full placeholder:text-white py-4"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label
                  htmlFor="age"
                  className="text-2xl font-semibold text-gray-700"
                >
                  Age
                </label>
                <input
                  onChange={(e) => setAge(e.target.value)}
                  value={age}
                  type="number"
                  name="age"
                  placeholder="Enter age"
                  id="age"
                  className="bg-gray-300 rounded-2xl text-white outline-none px-3 w-full placeholder:text-white py-4"
                />
              </div>
            </div>

            <div className="flex gap-5 mt-5">
              <button
                type="submit"
                className="cursor-pointer py-4 px-6 bg-green-500 text-white rounded-2xl text-xl w-40 hover:bg-green-600 transition-all"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setModal(false);
                  toast.success("Canceled!");
                }}
                className="cursor-pointer py-4 px-6 bg-red-500 text-white rounded-2xl text-xl w-40 hover:bg-red-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
      <button
        onClick={() => setModal(true)}
        className="cursor-pointer py-5 px-2 bg-gray-500 text-white rounded-2xl absolute top-10 right-10 z-10 text-2xl w-40 hover:bg-gray-600"
      >
        Create +
      </button>
      <div className="flex flex-wrap gap-5 justify-center items-center my-10">
        {data &&
          data.map(({ id, name, age }) => (
            <div
              className="w-[300px] h-[150px] flex items-center justify-center gap-2 flex-col bg-gray-400 text-white rounded-2xl shadow-lg"
              key={id}
            >
              <h1 className="text-3xl font-bold">{name}</h1>
              <p className="text-lg font-semibold">Age: {age}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
