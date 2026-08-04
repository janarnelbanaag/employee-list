import { useState, type ChangeEvent } from "react"

type EmployeeType = {
    id: string;
    name: string;
    position: string;
    startDate: string;
    endDate?: string;
    employment: "probationary" | "regular" | "contract";
}

type EmployeeInputType = Omit<EmployeeType, "id">

const defaultEmployee = {
    name: "",
    position: "",
    startDate: "",
    employment: "probationary" as const
}

const Home = () => {
    const [employees, setEmployees] = useState<EmployeeInputType[]>([])
    const [newEmployee, setNewEmployee] = useState<EmployeeInputType>(defaultEmployee);
    const [errors, setErrors] = useState<Partial<Record<keyof EmployeeInputType, string>>>({})

    const setField = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewEmployee(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const validateFields = () => {
        const newErrors: Partial<Partial<Record<keyof EmployeeInputType, string>>> = {};

        if (!newEmployee.name)
            newErrors.name = "Name is required";
        if (!newEmployee.position) 
            newErrors.position = "Position is required"
        if (!newEmployee.startDate) 
            newErrors.startDate = "Start Date is required"
        if (!newEmployee.employment) 
            newErrors.employment = "Employment is required"

        if (Object.keys(newErrors).length) {
            setErrors(newErrors);
            return false;
        }

        return true;
    }
    
    const handleSubmit = () => {
        setErrors({})
        if (!validateFields()) return;

        setEmployees(prev => [...prev, newEmployee])
        setNewEmployee(defaultEmployee)
    }

    return (
        <div className="grid grid-cols-12 items-center bg-black gap-1 h-screen">
            <div className="col-span-7 h-full py-10 flex flex-col items-center gap-4 bg-slate-900 min-h-0">
                <h1 className="text-5xl font-bold">
                    Employee List
                </h1>
                <h2>
                    A Kubernetes Training Project
                </h2>

                <div className="flex-1 border-4 rounded-lg p-4 border-slate-600 w-4/5 bg-slate-400 overflow-y-auto text-black">
                    <ul className="grid grid-cols-2 gap-4">
                        {employees.map(emp => (
                            <li
                                key={emp.name}
                                className="group relative grid grid-cols-[7em_1fr] p-2 bg-slate-200 rounded-sm shadow-md"
                            >
                                <p>Name:</p> <span className="font-bold capitalize">{emp.name}</span>
                                <p>Position:</p> <span className="font-bold capitalize">{emp.position}</span>
                                <p>Start Date:</p> <span className="font-bold capitalize">{emp.startDate}</span>
                                <p>Employment:</p> <span className="font-bold capitalize">{emp.employment}</span>

                                <div className="hidden absolute top-1 right-1 group-hover:flex gap-2">
                                    <button className="bg-slate-500 px-2 rounded cursor-pointer">Edit</button>
                                    <button className="bg-red-500 px-2 rounded cursor-pointer">Del</button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {employees.length === 0 && (
                        <div className="col-span-2 flex items-center justify-center text-2xl font-bold h-full">
                            No Employee Records yet.
                        </div>
                    )}
                </div>
            </div>

            <div className="col-span-5 h-full flex flex-col gap-10 justify-center items-center bg-slate-600">
                <h2 className="text-4xl">Add New Employee</h2>

                <div className="space-y-2">
                    <div className="grid grid-cols-[8em_1fr]">
                        <label>Name: </label>
                        <input
                            type="text"
                            name="name"
                            className="bg-white border text-black px-1 rounded"
                            value={newEmployee.name}
                            onChange={setField}
                        />
                    </div>

                    <div className="grid grid-cols-[8em_1fr]">
                        <label>Position: </label>
                        <input
                            type="text"
                            name="position"
                            className="bg-white border text-black px-1 rounded"
                            value={newEmployee.position}
                            onChange={setField}
                        />
                    </div>

                    <div className="grid grid-cols-[8em_1fr]">
                        <label>Start Date: </label>
                        <input
                            type="date"
                            name="startDate"
                            className="bg-white border text-black px-1 rounded"
                            value={newEmployee.startDate}
                            onChange={setField}
                        />
                    </div>

                    <div className="grid grid-cols-[8em_1fr]">
                        <label>Employment: </label>
                        <select
                            name="employment"
                            className="bg-white border text-black px-1 rounded"
                            value={newEmployee.employment}
                            onChange={setField}
                        >
                            <option value="probationary">Probationary</option>
                            <option value="regular">Regular</option>
                            <option value="contract">Contract</option>
                        </select>
                    </div>

                    <div className="grid place-items-center pt-4">
                        <button
                            className="border border-slate-400 p-2 w-full rounded-lg bg-slate-900 cursor-pointer hover:bg-slate-800 active:bg-slate-950"
                            onClick={handleSubmit}
                        >Save</button>
                    </div>

                    <div className="absolute text-slate-400">
                        {Object.values(errors).map(err => (
                            <div>{err}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home