import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase/config";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [modal, setModal] = useState(false);
  let [editmodal, setEModal] = useState(false)
  let [editid, setEditId] = useState(null)

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));

    // onSnapshot bilan real-time data olish
    const unsub = onSnapshot(q, (usersData) => {
      const users = usersData.docs.map((user) => ({
        id: user.id,
        ...user.data(),
      }));
      setData(users);
    });

    return () => unsub();
  }, []);

  const submit = async () => {
    if (!name || !age) {
      toast.error("Please fill in all fields!");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "users"), {
        name,
        age: Number(age),
        createdAt: serverTimestamp(),
      });
      toast.success("User added successfully!");
      setModal(false);
      setName("");
      setAge("");
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    }
  };

  const editUser = async (id, newData) => {
    updateDoc(doc(db, "users", id), newData);
    setEModal(false)
    toast.success("Edited !!!")
  }

  const deleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      toast.success("User deleted!");
    } catch (error) {
      toast.error("Delete failed!");
      console.error(error);
    }
  };

  return (
    <div>
      <Toaster position="top-center" />
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
      {editmodal && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            editUser(editid, { name: name, age: age });

          }}
          onClick={() => {
            setEModal(false);
          }}
          className="fixed top-0 left-0 w-screen h-screen bg-[#00000073] z-50 flex flex-col gap-5 items-center justify-center"
        >
          <div
            className="flex flex-col gap-5 items-center justify-center bg-white w-[500px] p-5 rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-4xl font-bold text-gray-500">
              Edit User
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
                  setEModal(false);
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
              className="w-[350px] h-[250px] flex items-center justify-around py-5 gap-2 flex-col bg-gray-400 text-white rounded-2xl shadow-lg"
              key={id}
            >
              <h1 className="text-2xl font-bold text-center">{name}</h1>
              <p className="text-md font-semibold">Age: {age}</p>
              <div className="w-full flex gap-3 items-center justify-center" >
                <button
                  onClick={() => { setEModal(true); setEditId(id) }}
                  className="py-5 w-30 rounded-2xl bg-gray-300 cursor-pointer"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                </button>
                <button
                  onClick={() => deleteUser(id)}
                  className="py-5 w-30 rounded-2xl bg-red-600 hover:bg-red-700 cursor-pointer"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
