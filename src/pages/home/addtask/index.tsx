import { z } from "zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"

import { addTodoApi } from "@/api/todo"
import Loader from "@/components/loader"
import { getUsersApi } from "@/api/users"
import { TodoData, User } from "@/interfaces"
import { Button } from "@/components/ui/button"

const AddTask = () => {

  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const navigate = useNavigate()

  const todoSchema = z.object({
    title: z.string().min(3, "minimum 3 characters").max(12, 'maximum of 12 characters'),
    description: z.string().min(10, "minimum 10 characters").max(20, 'maximum of 20 characters'),
    dueDate: z.string(),
    assignedUser: z.string().nonempty("assigned user is required"),
    status: z.string(),
    priority: z.string()
  })

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      assignedUser: "",
      status: "todo",
      priority: "low"
    }
  })

  const getUsers = async () => {
    try {
      setIsLoading(true)
      const users = await getUsersApi()
      setUsers(users)

    } catch (error) {
      setIsLoading(false)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const addTask = async (data: TodoData) => {
    try {
      setIsAdding(true)
      const response = await addTodoApi(data)

      console.log(response, "add response")
      navigate('/')

    } catch (error) {
      setIsAdding(false)
      console.error(error)
    } finally {
      setIsAdding(false)
    }
  }

  const onSubmit = (data: TodoData) => {
    addTask(data)
  }

  useEffect(() => {
    getUsers()
  }, [])

  const userOptions = users?.map((user) => {
    return <option key={user?.id} value={user?.id}>{user?.email}</option>
  })

  if (isLoading) return <Loader />

  return (

    <div className=" h-full flex justify-center items-center ">
      <div className=" w-[600px] flex flex-col gap-8 p-4 bg-slate-700 rounded-md">
        <h1 className="text-4xl text-white text-center">ADD NEW TASK</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <input {...register("title")} className="min-h-[40px] px-2 rounded" type="text" placeholder="title" />
          {errors.title?.message && <p className="text-red-500">{errors.title.message}</p>}
          <input {...register("description")} className="min-h-[40px] px-2 rounded" type="text" placeholder="description" />
          {errors.description?.message && <p className="text-red-500">{errors.description.message}</p>}
          <input {...register("dueDate")} className="min-h-[40px] px-2 rounded" type="date" />
          {errors.dueDate?.message && <p className="text-red-500">{errors.dueDate.message}</p>}
          <select {...register("assignedUser")} className="min-h-[40px] px-2 rounded" >
            <option value=''>select user</option>
            {userOptions}
          </select>
          {errors.assignedUser?.message && <p className="text-red-500">{errors.assignedUser.message}</p>}
          <select {...register("status")} className="min-h-[40px] px-2 rounded" >
            <option value='todo'>todo</option>
            <option value='inProgress'>inProgress</option>
            <option value='done'>done</option>
          </select>
          {errors.status?.message && <p className="text-red-500">{errors.status.message}</p>}
          <select {...register("priority")} className="min-h-[40px] px-2 rounded" >
            <option value='high'>high</option>
            <option value='low'>low</option>
          </select>
          {errors.priority?.message && <p className="text-red-500">{errors.priority.message}</p>}
          <Button type='submit'>{isAdding ? "adding" : "Add task"}</Button>

        </form>


      </div>
    </div>
  )
}

export default AddTask
