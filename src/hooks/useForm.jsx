import { useState } from 'react'

function useForm(initialValues) {
  const [form, setForm] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return { form, errors, setErrors, handleChange }
}

export default useForm
