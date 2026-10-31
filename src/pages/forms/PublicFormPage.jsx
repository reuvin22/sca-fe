import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CircleCheck } from 'lucide-react'
import AnswerField from '../../components/forms/AnswerField'
import Alert from '../../components/ui/Alert'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import useRequest from '../../hooks/useRequest'
import { getPublicForm, submitFormAnswers } from '../../services/formService'
import { numberQuestions } from '../../utils/formBuilderHelpers'

// Column share of each field on wider screens (phones always use the full width)
const SPANS = { full: 'sm:col-span-12', 'two-thirds': 'sm:col-span-8', half: 'sm:col-span-6', third: 'sm:col-span-4' }

const emptyAnswer = (item) => (item.type === 'checkbox' ? [] : item.parts?.length ? item.parts.map(() => '') : '')
const isEmpty = (value) => (Array.isArray(value) ? value.every((part) => !part.trim()) : !value.trim())
const answerable = (item) => item.type !== 'section' && item.type !== 'file'

// Public answer page (/f/:code): anyone with the link can answer, no sign-in
function PublicFormPage() {
  const { code } = useParams()
  const [form, setForm] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [answers, setAnswers] = useState({})
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const submit = useRequest((data) => submitFormAnswers(code, data))

  useEffect(() => {
    let ignore = false
    getPublicForm(code)
      .then((data) => {
        if (ignore) return
        setForm({ ...data, questions: numberQuestions(data.questions) })
        const items = [...data.header, ...data.questions].filter(answerable)
        setAnswers(Object.fromEntries(items.map((item) => [item.id, emptyAnswer(item)])))
      })
      .catch((error) => !ignore && setLoadError(error.message))
    return () => {
      ignore = true
    }
  }, [code])

  const setAnswer = (id, value) => setAnswers((prev) => ({ ...prev, [id]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const missing = [...form.header, ...form.questions].filter(
      (item) => answerable(item) && item.required && isEmpty(answers[item.id]),
    )
    setErrors(Object.fromEntries(missing.map((item) => [item.id, 'This question is required.'])))
    if (missing.length) {
      document.getElementById(`field-${missing[0].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    if (await submit.run(answers)) setSent(true)
  }

  const fields = (items) => (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-12">
      {items.map((item) =>
        item.type === 'section' ? (
          <h2
            key={item.id}
            className="rounded-md bg-brand-50 px-3 py-2 text-center text-sm font-semibold tracking-wide text-brand-700 uppercase sm:col-span-12"
          >
            {item.label}
          </h2>
        ) : (
          <div key={item.id} id={`field-${item.id}`} className={`min-w-0 ${SPANS[item.width] ?? SPANS.full}`}>
            <AnswerField
              question={item}
              value={answers[item.id]}
              error={errors[item.id]}
              onChange={(value) => setAnswer(item.id, value)}
            />
          </div>
        ),
      )}
    </div>
  )

  return (
    <main className="min-h-screen bg-page px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        {loadError && <Alert>{loadError}</Alert>}
        {!form && !loadError && <Skeleton className="h-96 rounded-xl" />}

        {form && sent && (
          <section className="flex flex-col items-center gap-3 rounded-xl bg-surface p-10 text-center shadow-sm">
            <CircleCheck size={40} className="text-green-600" />
            <h1 className="text-xl font-semibold text-gray-900">Thank you!</h1>
            <p className="text-sm text-gray-500">Your answers to &quot;{form.title}&quot; were sent.</p>
          </section>
        )}

        {form && !sent && (
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <header className="rounded-xl border-t-4 border-brand-600 bg-surface p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
              {form.description && <p className="mt-2 text-sm whitespace-pre-line text-gray-600">{form.description}</p>}
              <p className="mt-3 text-xs text-gray-400">
                <span className="text-red-600">*</span> Required
              </p>
            </header>

            {form.header.length > 0 && (
              <section className="rounded-xl bg-surface p-6 shadow-sm">{fields(form.header)}</section>
            )}
            {form.questions.length > 0 && (
              <section className="rounded-xl bg-surface p-6 shadow-sm">{fields(form.questions)}</section>
            )}

            <Alert>{submit.error}</Alert>
            <div className="flex justify-end">
              <Button type="submit" fullWidth={false} loading={submit.loading}>
                Submit answers
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}

export default PublicFormPage
