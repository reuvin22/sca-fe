import { Link } from 'react-router-dom'

function TextLink(props) {
  return <Link className="font-medium text-gray-900 hover:underline" {...props} />
}

export default TextLink
